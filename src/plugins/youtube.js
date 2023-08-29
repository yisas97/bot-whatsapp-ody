const buscadoryt = require("./buscador");
const ytdl = require("ytdl-core");
const fs = require("fs");

function mostrarInformacionVideo(video) {
    console.log('Título:', video.title);
    console.log('URL:', video.url);
    console.log('Duración:', video.timestamp);
    console.log('Vistas:', video.views);
    console.log('URL de la miniatura:', video.image);
    console.log('Autor:', video.author.name);
    console.log('URL del autor:', video.author.url);
    console.log('Verificado:', video.author.verified);
    console.log('---');

    return `Se encontre estos valores:
	*│* ┊
	*│* ┊▸ ✦ _Titulo: ${video.title}_
	*│* ┊▸ ✦ _URL: ${video.url}_ 
	*│* ┊▸ ✦ _Duracion: ${video.timestamp}_ 
	*│* ┊▸ ✦ _Autor: ${video.author.name}_ 
	*│* ╰∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙ ∙ ∙ ∙ 
	`.trim();
}

async function buscadorYoutube(sock,numberWa,messages,compareMessage){
    const elementBuscar = await buscadoryt.searchYouTube(compareMessage.replace(/\$\!/, ''));
    console.log(elementBuscar);
    await sock.sendMessage(
        numberWa,
        {
            text: mostrarInformacionVideo(elementBuscar),
        },
        {
            quoted: messages[0],
        }
    );


    const downloadOptions = {
        filter: 'audioonly',
        quality: 'highestaudio',
    };
    const audioStream = ytdl(elementBuscar.url, downloadOptions);
    const outputStream = fs.createWriteStream('output.mp3');
    audioStream.pipe(outputStream);
    outputStream.on(
        'finish',
        () => {
            sock.sendMessage(
                numberWa,
                {audio: {url: '../../output.mp3'}, mimetype: 'audio/mp4'},
                {url: "audio.mp3"} //can send mp3, mp4, & ogg
            )
        }
    )
}

module.exports =  {
    buscadorYoutube
}
