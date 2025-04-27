const { buscarAulasDisponiveisService } = require("../services/buscarAulasDisponiveisService");
const { confirmarService } = require("../services/confirmarService")
const { menuService } = require("../services/menuService")
const { confirmarEncaixeService } = require("../services/confirmarEncaixeService")

const controladorGeral = async (req, res) => {
  const { queryResult, originalDetectIntentRequest } = req.body;
  const { daysofweek: diaSemana, number: numberMatricula, numeroConfirmacao: numberConfirmar, alternativaChat: numberMenuInicial, encaixe_confirmacao: encaixeConfirmacao } = queryResult.parameters;
  const sessionId = req.body.session
  const chatId = originalDetectIntentRequest.payload.data.chat.id

  try {

    const actionsMap = {
      alternativaChat: async () => res.json({ fulfillmentText: `Informe seu número de matrícula!` }),
      number: async () => await menuService(req, res, sessionId, numberMatricula),
      daysofweek: async () => await buscarAulasDisponiveisService(req, res, sessionId, diaSemana),
      numeroConfirmacao: async () => await confirmarService(req, res, numberConfirmar, sessionId, chatId),
      encaixe_confirmacao: async () => await confirmarEncaixeService(req, res, encaixeConfirmacao, sessionId, chatId)
    };

    for (const [key, action] of Object.entries(actionsMap)) {
      if (queryResult.parameters[key]) {
        return await action();
      }
    }

    return res.status(500).json({
      fulfillmentText: "Não compreendi, tente novamente!",
    });

  }
  catch (e) {
    return res.status(500).json({
      fulfillmentText: "Problema ao se conectar ao chatbot!",
    });
  }
};


module.exports = { controladorGeral };
