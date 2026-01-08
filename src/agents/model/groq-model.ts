import { ChatGroq } from '@langchain/groq';
import { env } from '../../env/index.js';
import { employeeTool } from '../tools/employee-tools.js';

export const model = new ChatGroq({
  apiKey: env.GROQ_API_KEY,
  model: 'llama-3.3-70b-versatile',
  temperature: 0,
}).bindTools([employeeTool]);
