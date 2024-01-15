const {Configuration, OpenAIApi} = require("openai");
const dotenv = require('dotenv');
dotenv.config();

const configuration = new Configuration({
    organization: process.env.ORGANIZATION,
    apiKey: process.env.API_KEY,
});

async function consultGPT(sock, numberWa, messages, compareMessage) {
    const openai = new OpenAIApi(configuration);
    const response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
            {
                role: "user",
                content: compareMessage
            }],
    });
    const content = response.data.choices[0].message.content;
    await sock.sendMessage(
        numberWa,
        {
            text: content,
        },
        {
            quoted: messages[0],
        }
    );

}

module.exports = {
    consultGPT
}