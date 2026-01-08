import { HumanMessage } from '@langchain/core/messages';
import { graph } from './graph/graph.js';

export async function executeAgentIa(message: string) {
  try {
    const response = await graph.invoke({
      messages: [new HumanMessage(message)],
    });

    console.log(response);
    const lastMessage = response.messages.at(-1)?.content;
    let text: string;

    if (typeof lastMessage === 'string') {
      text = lastMessage;
    } else if (Array.isArray(lastMessage)) {
      text = lastMessage
        .map((block) => {
          if (typeof block === 'string') return block;
          if (block.text) return block.text;
          return '';
        })
        .join(' ')
        .trim();
    } else {
      text = 'Tudo certo!';
    }

    return text;
  } catch (error) {
    console.error(error);
    return 'Tivemos um problema ao processar sua solicitação.';
  }
}
