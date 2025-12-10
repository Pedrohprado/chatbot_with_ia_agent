import { prisma } from '../config/prisma.js';

export class PrismaProblemRepository {
  async create({
    name,
    description,
    user,
  }: {
    name: string;
    description: string;
    user: string;
  }) {
    const created = await prisma.problem.create({
      data: {
        description,
        user,
        name,
      },
    });

    console.log(created);

    return created;
  }
}
