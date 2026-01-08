export const finalNode = async (state: any) => {
  const last = state.messages.at(-1);
  // resposta da tool
  if (last?.tool_call_id && last?.content) {
    const result = JSON.parse(last.content);

    if (!result) {
      return {
        messages: [
          {
            role: 'ai',
            content: '❌ Não encontramos um colaborador com esses dados.',
          },
        ],
      };
    }

    return {
      messages: [
        {
          role: 'ai',
          content: `✅ Cadastro encontrado!
Nome: ${result.name}
Unidade: ${result.unit}`,
        },
      ],
    };
  }

  return {
    messages: [last],
  };
};
