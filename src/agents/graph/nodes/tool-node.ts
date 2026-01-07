import { ToolNode } from '@langchain/langgraph/prebuilt';
import { employeeTool } from '../../tools/employee-tools.js';
export const toolNode = new ToolNode([employeeTool]);
