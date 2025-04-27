const db = require("../config/db");
const { formatarData, formatarHora } = require('../services/formater')

const confirmarEncaixeModel = async (idAluno, idDiaHorario, sessionId, chatId) => {
    try {

        const [encaixes_aluno] = await db.execute(
            `SELECT id FROM encaixes WHERE aluno_id = ? AND dia_horario_id = ?`,
            [idAluno, idDiaHorario]
        )


        if (encaixes_aluno.length > 0)
            return ({ fulfillmentText: `Você já tem um encaixe para este dia!` });


        const [diaHorarioRows] = await db.execute(
            `SELECT * FROM dias_horarios WHERE id = ?`,
            [idDiaHorario]
        )

        if (diaHorarioRows.length === 0) {
            return ({
                fulfillmentText:
                    `Horario não encontrado ou não disponível`,
            });
        }

        const dataAtual = new Date()

        const [fila] = await db.execute(
            `SELECT COUNT(id)+1 as numeroFila FROM encaixes WHERE data_encaixe <= ? AND dia_horario_id = ? AND deleted_at IS NULL`,
            [dataAtual, idDiaHorario]
        )

        const [insertResult] = await db.execute(
            `INSERT INTO encaixes (aluno_id, dia_horario_id, data_encaixe, chat_id) VALUES (?, ?, ?, ?)`,
            [idAluno, idDiaHorario, dataAtual, chatId]
        )

        if (insertResult.affectedRows > 0) {


            return ({
                fulfillmentText:
                    `Ok, você entrou na fila de encaixe para ${diaHorarioRows[0].dia_da_semana} com início ${formatarHora(diaHorarioRows[0].horario_inicio)} e término ${formatarHora(diaHorarioRows[0].horario_fim)}! \n\nSeu número na fila atualmente é ${fila[0].numeroFila}\n\nAssim que surgir uma vaga você será notificado pelo seu número de celular vinculado a matrícula!`,
            });
        } else {
            return ({
                fulfillmentText:
                    `Erro ao confirmar agendamento!`,
            });
        }


    } catch (error) {
        throw new Error("Erro ao consultar banco de dados:", error);
    }
};

module.exports = { confirmarEncaixeModel };
