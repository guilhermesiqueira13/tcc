const enviarMensagem = require("../../notificacao");
const confirmarAgendamentoModel = require("../models/confirmarAgendamentoModel");
const cancelarAgendamentoUsuarioModel = require("../models/cancelarAgendamentoUsuarioModel");

const confirmarService = async (
  req,
  res,
  numberConfirmar,
  sessionId,
  chatId
) => {
  const { queryResult } = req.body;

  const contextHorario = queryResult.outputContexts.find((ctx) =>
    ctx.name.endsWith("/horarios_context")
  );

  const contextCancelarAgendamento = queryResult.outputContexts.find((ctx) =>
    ctx.name.endsWith("/cancelar_agendamento")
  );

  const contextUsuario = queryResult.outputContexts.find((ctx) =>
    ctx.name.endsWith("/usuario_context")
  );

  const usuarioSelecionado = contextUsuario.parameters.usuarioNumber;

  if (contextHorario) {
    const horarioSelecionado =
      contextHorario.parameters.horarioSelecionado.find((item) => {
        return Number(item.index) === Number(numberConfirmar);
      });
    const response = await confirmarAgendamentoModel.confirmarAgendamentoModel(
      usuarioSelecionado,
      horarioSelecionado.id,
      sessionId,
      chatId
    );
    return res.json(response);
  } else if (contextCancelarAgendamento) {
    const horarioSelecionado =
      contextCancelarAgendamento.parameters.horarioSelecionado.find((item) => {
        return Number(item.index) === Number(numberConfirmar);
      });
    const response =
      await cancelarAgendamentoUsuarioModel.cancelarAgendamentoUsuarioModel(
        usuarioSelecionado,
        horarioSelecionado.id
      );
    return res.json(response);
  }
};

module.exports = { confirmarService };
