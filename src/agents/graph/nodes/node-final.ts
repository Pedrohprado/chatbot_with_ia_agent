import { model } from '../../model/groq-model.js';

export const finalNode = async (state: any) => {
  const system = {
    role: 'system',
    content: `
      Responda de forma curta, educada e amigável para WhatsApp.
      Se a ferramenta devolveu dados do colaborador:
        - Confirme e mostre o nome e a unidade.
      Se veio vazio:
        - Diga que não encontramos.
    `,
  };

  const resp = await model.invoke([system, ...state.messages]);

  return { messages: [resp] };
};
