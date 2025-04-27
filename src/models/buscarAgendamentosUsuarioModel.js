const db = require("../config/db");

const buscarAgendamentosUsuarioModel = async (alunoId) => {
  try {
    const [rows] = await db.execute(
      `SELECT dh.* 
       FROM dias_horarios dh
       JOIN agendamentos ag ON dh.id = ag.dia_horario_id
       WHERE ag.aluno_id = ? AND ag.deleted_at IS NULL AND dh.horario_inicio > NOW()
       ORDER BY dh.horario_inicio;`,
      [Number(alunoId)]
    );
    

    return rows;
  } catch (error) {
    throw new Error("Erro ao consultar banco de dados:", error);
  }
};

module.exports = { buscarAgendamentosUsuarioModel };
