const db = require("../config/db");

const buscarAulasModel = async (data) => {
  try {
    const [rows] = await db.execute(
      ` SELECT dh.*
    FROM dias_horarios dh
    LEFT JOIN (
      SELECT dia_horario_id
      FROM agendamentos
      WHERE deleted_at IS NULL
      GROUP BY dia_horario_id
    ) ag ON dh.id = ag.dia_horario_id
    WHERE dh.dia_da_semana = ?
      AND dh.horario_inicio > NOW()
    ORDER BY dh.horario_inicio;`,
      [data]
    );
    return rows;
  } catch (error) {
    console.error(error)
    throw new Error("Erro ao consultar banco de dados:", error);
  }
};

module.exports = { buscarAulasModel };
