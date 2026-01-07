import { tool } from '@langchain/core/tools';
import { PrismaProblemRepository } from '../../services/problem.js';

export const issueTool = tool(
  async ({ name, user, description }) => {
    const repositoryProblem = new PrismaProblemRepository();
    const created = await repositoryProblem.create({
      name,
      user,
      description,
    });

    return {
      status: 'created',
      id: created.id,
      name: created.name,
      description: created.description,
    };
  },
  {
    name: 'createIssue',
    description: 'Cria um registro de problema no banco de dados.',
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        description: { type: 'string' },
        user: { type: 'string' },
      },
      required: ['name', 'description', 'user'],
    },
  }
);
