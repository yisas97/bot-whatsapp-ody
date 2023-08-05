const axios = require('axios');
const fs = require('fs');
const path = require('path');

async function descargarWaifus(sock, numberWa) {
    axios.get('https://api.waifu.pics/sfw/waifu')
        .then(response => {
            const url = response.data.url;
            axios({
                url: url,
                responseType: 'stream',
            })
                .then(response => {
                    const output = path.join(__dirname, "..", "images", "waifu.jpg");
                    const writer = fs.createWriteStream(output);
                    response.data.pipe(writer);

                    writer.on('finish', () => {
                        console.log(`Image downloaded to ${output}`);
                    });

                    writer.on('error', (err) => {
                        console.error('Error occurred while downloading image:', err);
                    });
                });
        })
        .catch(console.error);

    const imageBuffer = fs.readFileSync('./src/images/waifu.jpg');

    return await sock.sendMessage(
        numberWa,
        {
            image: imageBuffer
        }
    );
}

module.exports = {
    descargarWaifus
}
