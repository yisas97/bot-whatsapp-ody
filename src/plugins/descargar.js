const ytdl = require('ytdl-core');
const fs = require('fs');

// Opciones para la descarga
const options = {
    quality: 'highest',
};

// Nombre del archivo de salida
const nombreArchivo = 'video_descargado.mp4';

// Función para descargar el video
async function descargarVideo(video) {
    console.log("Iniciar la descarga");
    console.log(video);
    console.log("--------------------");
    console.log(video.url);
    console.log("--------------------");
    ytdl(video.url, options)
        .pipe(fs.createWriteStream(nombreArchivo))
        .on('finish', () => {
            console.log(`El video se ha descargado correctamente y se ha guardado como "${nombreArchivo}".`);
        })
        .on('error', (error) => {
            console.error('Error al descargar el video:', error);
        });
}

module.exports = {
    descargarVideo,
}