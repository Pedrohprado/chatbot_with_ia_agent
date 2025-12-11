import { MessagesAnnotation } from '@langchain/langgraph';
import { model } from '../../model/groq-model.js';

export const llmNode = async (state: typeof MessagesAnnotation.State) => {
  const system = {
    role: 'system',
    content: `
      Você deve identificar unidade + cartão.
      Jamais invente dados.
      Se faltar algo, peça.
    `,
  };
  const messages = [system, ...state.messages];

  const resp = await model.invoke(messages);
  return { messages: [resp] };
};
