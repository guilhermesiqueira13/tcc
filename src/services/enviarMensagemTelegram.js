const axios = require('axios');

const sendTelegramMessageService = async (chatId, message) => {
    const botToken = process.env.BOTTOKEN
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

    try {
        const response = await axios.post(url, {
            chat_id: chatId,
            text: message,
        });
        console.log('Mensagem enviada com sucesso:', response.data);
    } catch (error) {
        console.error('Erro ao enviar mensagem:', error);
    }
}

module.exports = { sendTelegramMessageService };