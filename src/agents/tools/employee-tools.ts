import { tool } from 'langchain';
import { PrismaEmployeeRepository } from '../../services/user.js';

export const employeeTool = tool(
  async ({ cardNumber, unit }) => {
    try {
      const repositoryEmployee = new PrismaEmployeeRepository();
      const findEmployee = await repositoryEmployee.find({ cardNumber, unit });

      return findEmployee;
    } catch (error) {
      console.log(error);
      throw new Error('erro interno no servidor');
    }
  },
  {
    name: 'checkEmployee',
    description: 'Encontra um colaborador atráves do cartão e uma unidade',
    schema: {
      type: 'object',
      properties: {
        cardNumber: { type: 'string' },
        unit: { type: 'string' },
      },
      required: ['cardNumber', 'unit'],
    },
  }
);
