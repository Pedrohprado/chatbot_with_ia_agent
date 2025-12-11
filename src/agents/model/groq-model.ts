import { ChatGroq } from '@langchain/groq';
import { env } from '../../env/index.js';
import { issueTool } from '../../tools/create-tools.js';

export const model = new ChatGroq({
  apiKey: env.GROQ_API_KEY,
  model: 'llama-3.3-70b-versatile',
  temperature: 0.2,
}).bindTools([issueTool]);
