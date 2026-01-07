import fastify from 'fastify';
import { prisma } from './config/prisma.js';
import { client } from './whatsapp/handlers/main-handler.js';

const app = fastify();

app.post('/teste', async () => {
  const teste = await prisma.problem.create({
    data: {
      name: 'insetos',
      description: 'teste',
      user: 'pedro',
    },
  });

  console.log(teste);
  return { test: 'test' };
});

client.initialize();

app.listen({ host: '0.0.0.0', port: 3333 }).then(() => {
  console.log(`Server running!`, '0.0.0.0', 3333);
});
