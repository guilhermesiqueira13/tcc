const db = require("../config/db");

const validarAlunoModel = async (idAluno) => {
  try {
    const [alunoRows] = await db.execute(
      `SELECT id,nome FROM alunos WHERE id = ?`,
      [idAluno]
    );

    if (alunoRows.length === 0) {
      return {
        fulfillmentText: `Não tem nenhum aluno cadastrado com esta matrícula.`,
      };
    } else {
      return alunoRows;
    }
  } catch (error) {
    throw new Error("Erro ao consultar banco de dados:", error);
  }
};

module.exports = { validarAlunoModel };
