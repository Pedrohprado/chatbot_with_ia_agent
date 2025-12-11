import { HumanMessage } from '@langchain/core/messages';
import { graph } from './graph/graph.js';

export async function executeAgentIa(message: string) {
  try {
    const response = await graph.invoke({
      messages: [new HumanMessage(message)],
    });
    console.log(response);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}
