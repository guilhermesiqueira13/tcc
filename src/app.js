const express = require("express");
const app = express();
const agendamentoRoutes = require("./routes/agendamentoRoutes");

const PORT = 3000;
app.use(express.json());

app.use("/api", agendamentoRoutes);

app.listen(PORT, () => {
  console.log(`Rodando na porta ${PORT}`);
});
