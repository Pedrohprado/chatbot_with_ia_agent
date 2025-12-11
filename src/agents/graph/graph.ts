import {
  END,
  MessagesAnnotation,
  START,
  StateGraph,
} from '@langchain/langgraph';
import { llmNode } from './nodes/node-llm.js';
import { ToolNode } from '@langchain/langgraph/prebuilt';
import { employeeTool } from '../../tools/employee-tools.js';
const toolNode = new ToolNode([employeeTool]);

export const graph = new StateGraph(MessagesAnnotation)
  .addNode('llm', llmNode)
  .addNode('tools', toolNode)
  .addNode('final', llmNode)
  .addEdge(START, 'llm')
  .addEdge('llm', 'tools')
  .addEdge('tools', 'final')
  .addEdge('final', END)
  .compile();
