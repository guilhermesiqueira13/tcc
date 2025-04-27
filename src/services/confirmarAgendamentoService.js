const confirmarAgendamentoModel = require('../models/confirmarAgendamentoModel')
const buscarUsuarioAgendamentoModel = require('../models/buscaUsuarioAgendamentoModel')

const confirmarAgendamentoService = async (req, res, numberConfirmarAgendamento) => {
  const { queryResult } = req.body

  const contextHorario = queryResult.outputContexts.find(
    (ctx) => ctx.name.endsWith("/horarios_context")
  );

  const contextUsuario = queryResult.outputContexts.find(
    (ctx) => ctx.name.endsWith("/usuario_context")
  );

  const horarioSelecionado = contextHorario.parameters.agendamentos.find((item) => { return Number(item.index) === Number(numberConfirmarAgendamento) })
  const usuarioSelecionado = contextUsuario.parameters.usuarioNumber

  const agendamento = await buscarUsuarioAgendamentoModel.buscarUsuarioAgendamentoModel(usuarioSelecionado, horarioSelecionado.id)

  if (agendamento.length > 0) {
    return res.json(
      {
        fulfillmentText:
          `Já existe um horário marcardo para este usuário. \nPor favor, informe outro horário.`,
      })
  }

  const response = await confirmarAgendamentoModel.confirmarAgendamentoModel(usuarioSelecionado, horarioSelecionado.id)

  return res.json(response)

}

module.exports = { confirmarAgendamentoService };
