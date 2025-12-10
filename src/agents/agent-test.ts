import { ChatGroq } from '@langchain/groq';
import { ToolNode } from '@langchain/langgraph/prebuilt';
import {
  MessagesAnnotation,
  StateGraph,
  START,
  END,
} from '@langchain/langgraph';
import { HumanMessage } from '@langchain/core/messages';
import { env } from '../env/index.js';
import { issueTool } from '../tools/create-tools.js';

const model = new ChatGroq({
  apiKey: env.GROQ_API_KEY,
  model: 'llama-3.3-70b-versatile',
  temperature: 0.2,
}).bindTools([issueTool]);

const llmNode = async (state: typeof MessagesAnnotation.State) => {
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

const toolNode = new ToolNode([issueTool]);

const graph = new StateGraph(MessagesAnnotation)
  .addNode('llm', llmNode)
  .addNode('tools', toolNode)
  .addEdge(START, 'llm')
  .addEdge('llm', 'tools') // <-- executa ferramentas
  .addEdge('tools', END) // <-- termina
  .compile();

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
