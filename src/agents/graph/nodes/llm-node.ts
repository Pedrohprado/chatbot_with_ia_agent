import { model } from '../../model/groq-model.js';
import { MessagesAnnotation } from '@langchain/langgraph';

const systemPrompt = `
Você é um assistente que encontra colaboradores.

Quando o usuário informar:
- número do cartão
- unidade

Você DEVE chamar a tool "checkEmployee".

As informações podem vim simplesmente separadas por espaço.

As informações podem vir uma em sequência da outra.

Transforme a unidade sempre em letra maiúscula.

Se faltar alguma informação, peça ao usuário.

Nunca invente dados.
`;

export const llmNode = async (state: typeof MessagesAnnotation.State) => {
  const response = await model.invoke([
    {
      role: 'system',
      content: systemPrompt,
    },
    ...state.messages,
  ]);

  return {
    messages: [...state.messages, response],
  };
};
