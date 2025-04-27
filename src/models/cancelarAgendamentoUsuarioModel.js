const db = require("../config/db");
const { sendTelegramMessageService } = require("../services/enviarMensagemTelegram")
const { formatarData, formatarDataDia, formatarHora } = require('../services/formater')


const cancelarAgendamentoUsuarioModel = async (alunoId, dia_horario_id) => {
    try {
        const [updateResult] = await db.execute(
            `UPDATE agendamentos
            SET deleted_at = NOW()
            WHERE aluno_id = ? AND dia_horario_id = ?;`,
            [alunoId, dia_horario_id]
        );

        if (updateResult.affectedRows > 0) {

            const [getEncaixe] = await db.execute(
                `SELECT * FROM encaixes WHERE dia_horario_id = ? AND deleted_at IS NULL
                ORDER BY data_encaixe ASC
                LIMIT 1`,
                [dia_horario_id]
            )

            if (getEncaixe.length > 0) {

                const [criarAgendamentoEncaixe] = await db.execute(
                    `INSERT INTO agendamentos (aluno_id, dia_horario_id, data_agendamento, chat_id) VALUES (?, ?, NOW(), ?)`,
                    [getEncaixe[0].aluno_id, getEncaixe[0].dia_horario_id, getEncaixe[0].chat_id]
                );

                if (criarAgendamentoEncaixe.affectedRows > 0) {

                    const [updateEncaixe] = await db.execute(
                        `UPDATE encaixes
                        SET deleted_at = NOW()
                        WHERE aluno_id = ? AND dia_horario_id = ?;`,
                        [getEncaixe[0].aluno_id, getEncaixe[0].dia_horario_id]
                    );

                    if (updateEncaixe.affectedRows > 0) {


                        const [diaHorarioRows] = await db.execute(
                            `SELECT * FROM dias_horarios WHERE id = ?`,
                            [dia_horario_id]
                        )

                        if (diaHorarioRows.length === 0) {
                            return ({
                                fulfillmentText:
                                    `Horario não encontrado ou não disponível`,
                            });
                        }

                        const response = await sendTelegramMessageService(getEncaixe[0].chat_id, `
                            Olá, sou a assistente virtual Jane da KNN, vim aqui para te avisar que devido a desistência de outro aluno, seu agendamento foi marcado para ${diaHorarioRows[0].dia_da_semana}, ${formatarDataDia(diaHorarioRows[0].horario_inicio)} com início ${formatarHora(diaHorarioRows[0].horario_inicio)} e término ${formatarHora(diaHorarioRows[0].horario_fim)}!`)

                    } else {
                        console.log('não deu certo')
                    }


                }

            }

            if (updateResult.affectedRows > 0) {
                return ({
                    fulfillmentText:
                        `Agendamento cancelado com sucesso!`,
                });
            }

        }

        else {
            return ({
                fulfillmentText:
                    `Erro ao cancelar agendamento!`,
            });
        }
    } catch (error) {
        throw new Error("Erro ao consultar banco de dados:", error);
    }
};

module.exports = { cancelarAgendamentoUsuarioModel };
