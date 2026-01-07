import qrcode from 'qrcode-terminal';
import pkg from 'whatsapp-web.js';
import fs from 'fs';
import { prisma } from '../../config/prisma.js';
import { executeAgentIa } from '../../agents/execute-agent.js';
import { transcribeAudio } from '../../agents/utils/transcribe-audio.js';

const { Client, LocalAuth } = pkg;

export const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    headless: true,
  },
});

client.on('qr', (qr) => {
  console.log('scan qrcode!');
  qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
  console.log('📩 whatsapp conectado!');
});

client.on('message', async (message) => {
  const phoneNumber = message.from;
  const testNumber = '5514991787247@c.us';
  console.log(phoneNumber);
  if (phoneNumber === testNumber) {
    let session = await prisma.whatsAppSession.findUnique({
      where: {
        id: phoneNumber,
      },
    });

    if (!session) {
      await prisma.whatsAppSession.create({
        data: {
          id: phoneNumber,
          state: 'START',
        },
      });

      return message.reply(
        'Olá Bem-vindo ao atendimento!\n\nEscolha uma opção:\n1 - Consultar\n2 - Perguntar'
      );
    }

    if (session.state === 'START') {
      if (message.body !== '1') {
        return message.reply(
          'Não entendi sua mensagem.\n Pode escolher uma das opções válidas'
        );
      }
      if (message.body === '1') {
        await prisma.whatsAppSession.update({
          where: {
            id: phoneNumber,
          },
          data: {
            state: 'INITIAL',
          },
        });
        return message.reply('Informe seu problema para a IA');
      }
    }

    if (session.state === 'INITIAL') {
      if (message.hasMedia) {
        const media = await message.downloadMedia();

        const filePath = `./temp/${Date.now()}.ogg`;
        fs.writeFileSync(filePath, Buffer.from(media.data, 'base64'));

        const text = await transcribeAudio(filePath);

        if (!text) {
          return message.reply('Não consegui entender o áudio 😕');
        }

        console.log('📝 Texto reconhecido:', text);

        const result = await executeAgentIa(text);

        return message.reply(result);
      }

      const messageForIa = message.body;
      const statusReturnIa = await executeAgentIa(messageForIa);

      if (statusReturnIa) {
        await prisma.whatsAppSession.update({
          where: {
            id: session.id,
          },
          data: {
            state: 'START',
          },
        });
        return message.reply('Processamos o seu problema!');
      } else {
        return message.reply('Tivemos um problema ao processar!');
      }
    }
    console.log(
      `${new Date().toLocaleString()} - ${phoneNumber} - ${message.body}`
    );
  }
});
