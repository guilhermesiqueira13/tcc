const express = require("express");
const router = express.Router();
const agendamentoController = require("../controllers/agendamentoController");

router.post("/webhook", agendamentoController.controladorGeral);

module.exports = router;
