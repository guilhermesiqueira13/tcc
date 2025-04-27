const confirmarEncaixeModel = require("../models/confirmarEncaixeModel");

const confirmarEncaixeService = async (
    req,
    res,
    encaixe_confirmacao,
    sessionId,
    chatId
) => {
    try {

        const { queryResult } = req.body

        const contextEncaixe = queryResult.outputContexts.find(
            (ctx) => ctx.name.endsWith("/encaixe_context")
        );

        if (encaixe_confirmacao === 'sim') {
            const alunoId = contextEncaixe.parameters.idAluno
            const diaHorarioId = contextEncaixe.parameters.idDiaHorario

            const response = await confirmarEncaixeModel.confirmarEncaixeModel(alunoId, diaHorarioId, sessionId, chatId)

            return res.json(response)
        } else {
            return res.json({
                fulfillmentText:
                    `Ok! Obrigado por entrar em contato conosco!`,
            });
        }

    } catch (error) {
        console.error(error)
        throw new Error("Erro ao buscar aulas disponíveis", error);
    }
};

module.exports = { confirmarEncaixeService };
