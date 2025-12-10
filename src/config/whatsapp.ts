import qrcode from 'qrcode-terminal';
import { Client, LocalAuth } from 'whatsapp-web.js';
import { prisma } from './prisma.js';
import { executeAgentIa } from '../agents/agent-test.js';

const client = new Client({
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
        return message.reply('Faça uma pergunta para a IA');
      }
    }

    if (session.state === 'INITIAL') {
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
        await prisma.whatsAppSession.update({
          where: {
            id: session.id,
          },
          data: {
            state: 'START',
          },
        });
        return message.reply('Tivemos um problema ao processar!');
      }
    }
    console.log(
      `${new Date().toLocaleString()} - ${phoneNumber} - ${message.body}`
    );
  }
});

export default client;
