import {
  END,
  MessagesAnnotation,
  START,
  StateGraph,
} from '@langchain/langgraph';
import { finalNode } from './nodes/final-node.js';
import { llmNode } from './nodes/llm-node.js';
import { toolNode } from './nodes/tool-node.js';

export const graph = new StateGraph(MessagesAnnotation)
  .addNode('llm', llmNode)
  .addNode('tools', toolNode)
  .addNode('final', finalNode)
  .addEdge(START, 'llm')
  .addEdge('llm', 'tools')
  .addEdge('tools', 'final')
  .addEdge('final', END)
  .compile();
