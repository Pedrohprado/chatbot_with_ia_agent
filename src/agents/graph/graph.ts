import {
  END,
  MessagesAnnotation,
  START,
  StateGraph,
} from '@langchain/langgraph';
import { llmNode } from './nodes/node-llm.js';
import { ToolNode } from '@langchain/langgraph/prebuilt';
import { issueTool } from '../../tools/create-tools.js';
const toolNode = new ToolNode([issueTool]);

export const graph = new StateGraph(MessagesAnnotation)
  .addNode('llm', llmNode)
  .addNode('tools', toolNode)
  .addEdge(START, 'llm')
  .addEdge('llm', 'tools')
  .addEdge('tools', END)
  .compile();
