const buscarAulasDisponiveisModel = require("../models/buscarAulasDisponiveisModel");
const { formatarData, formatarHora } = require("../services/formater");

const buscarAulasDisponiveisService = async (
  req,
  res,
  sessionId,
  diaSemana
) => {
  try {

    const agendamentos = await buscarAulasDisponiveisModel.buscarAulasModel(
      diaSemana
    );

    if (agendamentos.length > 0) {
      let resposta = `Aqui estão os horários disponíveis para: ${diaSemana}\n\n`;

      agendamentos.forEach((row, index) => {
        resposta += `${index + 1}. ${formatarData(
          row.horario_inicio
        )} - ${formatarHora(row.horario_fim)}\n\n`;
      });

      const escolha = []

      agendamentos.forEach((row, index) => {
        escolha.push({ index: index + 1, id: row.id, dia_da_semana: row.dia_da_semana, horario_inicio: row.horario_inicio, horario_fim: row.horario_fim })
      })

      return res.json({
        fulfillmentText:
          resposta + `Por favor escolha o número do horário desejado`,
        outputContexts: [
          {
            name: `${sessionId}/contexts/horarios_context`,
            lifespanCount: 3,
            parameters: {
              horarioSelecionado: escolha
            }
          }
        ]

      });
    }

    return res.json({
      fulfillmentText:
        `Não tem nenhuma aula disponível para ${diaSemana},\nPor favor escolha outro dia!`,
    });
  } catch (error) {
    console.error(error)
    throw new Error("Erro ao buscar aulas disponíveis", error);
  }
};

module.exports = { buscarAulasDisponiveisService };
