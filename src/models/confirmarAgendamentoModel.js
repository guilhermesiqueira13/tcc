const db = require("../config/db");
const { formatarData, formatarHora } = require('../services/formater')

const confirmarAgendamentoModel = async (idAluno, idDiaHorario, sessionId, chatId) => {
    try {


        const [total_agendamentos] = await db.execute(
            `SELECT count(*) as total_agendamentos FROM agendamentos WHERE dia_horario_id = ? AND deleted_at IS NULL;`,
            [idDiaHorario]
        )


        if (total_agendamentos && total_agendamentos[0].total_agendamentos < 2) {
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

            const [rows] = await db.execute(
                `SELECT id FROM agendamentos WHERE aluno_id = ? AND dia_horario_id = ? AND deleted_at IS NULL`,
                [idAluno, idDiaHorario]
            )

            if (rows.length === 0) {

                console.log(idAluno)
                console.log(idDiaHorario)
                console.log(chatId)

                const [insertResult] = await db.execute(
                    `INSERT INTO agendamentos (aluno_id, dia_horario_id, data_agendamento, chat_id) VALUES (?, ?, NOW(), ?)`,
                    [Number(idAluno), Number(idDiaHorario), Number(chatId)]
                )

                console.log()

                if (insertResult.affectedRows > 0) {
                    return ({
                        fulfillmentText:
                            `Agendamento confirmado para ${diaHorarioRows[0].dia_da_semana} com início ${formatarHora(diaHorarioRows[0].horario_inicio)} e término ${formatarHora(diaHorarioRows[0].horario_fim)}!`,
                    });
                } else {
                    return ({
                        fulfillmentText:
                            `Erro ao confirmar agendamento!`,
                    });
                }
            } else {
                return ({
                    fulfillmentText:
                        `Já tem um agendamento marcado para este número de matrícula!`,
                });
            }

        } else {
            return ({
                fulfillmentText:
                    `Este horário já está cheio! Gostaria de entrar na fila caso libere uma vaga?`,
                outputContexts: [
                    {
                        name: `${sessionId}/contexts/encaixe_context`,
                        lifespanCount: 3,
                        parameters: {
                            idDiaHorario: idDiaHorario,
                            idAluno: idAluno
                        }
                    }
                ]
            });
        }

    } catch (error) {
        console.log(error)
        throw new Error("Erro ao consultar banco de dados:", error);
    }
};

module.exports = { confirmarAgendamentoModel };
