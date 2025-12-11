import { prisma } from '../config/prisma.js';

export class PrismaEmployeeRepository {
  async find({ cardNumber, unit }: { cardNumber: string; unit: string }) {
    const employee = await prisma.employee.findFirst({
      where: {
        cardNumber,
        unit,
      },
    });

    return employee;
  }
}
