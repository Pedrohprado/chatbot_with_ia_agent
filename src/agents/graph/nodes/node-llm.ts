import { MessagesAnnotation } from '@langchain/langgraph';
import { model } from '../../model/groq-model.js';

export const llmNode = async (state: typeof MessagesAnnotation.State) => {
  const system = {
    role: 'system',
    content: `
      Você entende sobre registrar problemas, você vai identificar e extrair, a descrição do problema, o nome do problema e o usuário que fez a solicitação.
      - Se houver dúvida, pergunte.
      - Não invente nada.
      - Se não tiver informação suficiente, peça.
      - Extrai apenas fatos explícitos.
      - Nunca suponha endereço, nome ou telefone.
      - Se houver dúvida, pergunte.
    `,
  };
  const messages = [system, ...state.messages];

  const resp = await model.invoke(messages);
  return { messages: [resp] };
};
