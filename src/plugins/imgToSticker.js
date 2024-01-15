const { Sticker, createSticker } = require('wa-sticker-formatter');
const { downloadMediaMessage } = require("@adiwajshing/baileys");
const { writeFile } = require('fs/promises');

async function ImageToSticker(sock,numberWa, msg) {
      // Descarga la imagen
      try {
        const buffer = await downloadMediaMessage(msg, 'buffer', {}, 
        {
            reuploadRequest: sock.updateMediaMessage
        });

        await writeFile('./src/resources/imageToSticker.jpeg', buffer)

      // Convierte la imagen en un sticker
      const sticker = await createSticker(buffer, {
        pack: 'MiPack', // Nombre del paquete de stickers
        author: 'Bot-ody', // Autor del sticker
        type: 'full', // Tipo de sticker (full o cropped)
      });

      // Envía el sticker al chat
      await sock.sendMessage(
            numberWa,
            {
                sticker
            }
        );
    } catch (error) {
      console.error('Error al convertir la imagen en sticker:', error);
    }
}

module.exports =  {
    ImageToSticker
}