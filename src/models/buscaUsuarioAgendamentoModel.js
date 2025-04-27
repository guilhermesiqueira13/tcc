const db = require("../config/db");

const buscarUsuarioAgendamentoModel = async (aluno_id, dia_horario_id) => {
    try {
        const [rows] = await db.execute(
            `SELECT * FROM agendamentos WHERE aluno_id = ? AND dia_horario_id = ?;`,
            [aluno_id, dia_horario_id]
        );
        return rows;
    } catch (error) {
        throw new Error("Erro ao consultar banco de dados:", error);
    }
};

module.exports = { buscarUsuarioAgendamentoModel };