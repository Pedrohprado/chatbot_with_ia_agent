import readline from 'readline';
import { executeAgentIa } from '../agents/execute-agent.js';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function ask() {
  rl.question('Você: ', async (input) => {
    if (input.toLowerCase() === 'exit') {
      rl.close();
      return;
    }

    const response = await executeAgentIa(input);
    console.log('\n🤖 IA:', response, '\n');

    ask();
  });
}

ask();
