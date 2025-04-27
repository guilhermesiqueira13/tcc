const validarAlunoModel = require('../models/validarAlunoModel')
const buscarAgendamentosUsuarioModel = require('../models/buscarAgendamentosUsuarioModel');
const { formatarData, formatarHora } = require('./formater')

const menuService = async (req, res, sessionId, usuarioNumber) => {

  const { queryResult } = req.body

  const contextMenu = queryResult.outputContexts.find(
    (ctx) => ctx.name.endsWith("/menu_inicial")
  );

  const numberMenuInicial = contextMenu.parameters.alternativaChat

  const response = await validarAlunoModel.validarAlunoModel(usuarioNumber)

  if (response.length > 0) {
    const nome = response[0].nome
    const resultadoMenu = await menu(numberMenuInicial, sessionId, nome, usuarioNumber)
    return res.json(resultadoMenu)
  }
  else {
    return res.json(response)
  }
}


const menu = async (numberMenuInicial, sessionId, nome, usuarioNumber) => {
  let resposta = '';
  let escolha = []
  switch (Number(numberMenuInicial)) {
    case 1:
      return {
        fulfillmentText: `Ok ${nome}, informe qual dia deseja marcar um horário`,
        outputContexts: [
          {
            name: `${sessionId}/contexts/usuario_context`,
            lifespanCount: 5,
            parameters: {
              usuarioNumber: usuarioNumber
            }
          },
          {
            name: `${sessionId}/contexts/criar_agendamento`,
            lifespanCount: 5,
            parameters: {
              status: true
            }
          }
        ]
      };

    case 2:
      const horariosCancelamentoUsuario = await buscarAgendamentosUsuarioModel.buscarAgendamentosUsuarioModel(usuarioNumber)
      resposta = '';

      horariosCancelamentoUsuario.forEach((row, index) => {
        resposta += `${index + 1}. ${formatarData(
          row.horario_inicio
        )} - ${formatarHora(row.horario_fim)}\n\n`;
      });

      escolha = []

      horariosCancelamentoUsuario.forEach((row, index) => {
        escolha.push({ index: index + 1, id: row.id, dia_da_semana: row.dia_da_semana, horario_inicio: row.horario_inicio, horario_fim: row.horario_fim })
      })

      if (horariosCancelamentoUsuario.length > 0) {
        return {
          fulfillmentText: `Selecione qual horário deseja cancelar:\n\n${resposta}`,
          outputContexts: [
            {
              name: `${sessionId}/contexts/usuario_context`,
              lifespanCount: 5,
              parameters: {
                usuarioNumber: usuarioNumber
              }
            },
            {
              name: `${sessionId}/contexts/cancelar_agendamento`,
              lifespanCount: 5,
              parameters: {
                horarioSelecionado: escolha
              }
            }
          ]
        };
      } else {
        return {
          fulfillmentText: `Não há agendamentos marcados!`,
        }
      }
      
    case 3:
      const horariosUsuario = await buscarAgendamentosUsuarioModel.buscarAgendamentosUsuarioModel(usuarioNumber)
      resposta = '';

      horariosUsuario.forEach((row, index) => {
        resposta += `${index + 1}. ${formatarData(
          row.horario_inicio
        )} - ${formatarHora(row.horario_fim)}\n\n`;
      });

      escolha = []

      horariosUsuario.forEach((row, index) => {
        escolha.push({ index: index + 1, id: row.id, dia_da_semana: row.dia_da_semana, horario_inicio: row.horario_inicio, horario_fim: row.horario_fim })
      })

      if (horariosUsuario.length > 0) {
        return {
          fulfillmentText: `Aqui estão suas aulas agendadas:\n\n${resposta}`,
        };
      } else {
        return {
          fulfillmentText: `Não há agendamentos marcados!`,
        }
      }

    default:
      return {
        fulfillmentText: `Não compreendi, tente novamente`,
      }
  }
}

module.exports = { menuService };
