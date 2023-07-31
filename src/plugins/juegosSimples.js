const {getRandom} = require("../utils/util");

async function juegoSiNo(sock,numberWa,messages){
    const respuestas = ["Si", "No", "Es muy probable que si", "Estoy seguro que no", "Las señales apuntan a que sí.", "Lo más probable", "Mi respuesta es no.", "Mi respuesta es si."];
    const indiceRespuesta = getRandom(respuestas);
    await sock.sendMessage(
        numberWa,
        {
            text: respuestas[indiceRespuesta],
        },
        {
            quoted: messages[0],
        }
    );
}

async function getMenu(sock,numberWa,messages){
    let menuPrincipal = `*◈ MENU ◈*
*☆═━┈◈ ╰ ODY ╯ ◈┈━═☆*
*│* 
*╰ ▸▸ Comandos de Juegos ◂◂*
*│* ┊
*│* ┊▸ ✦ $. Comando de Juego Si o No.
*│* ┊▸ ✦ $! Comando de Juego quien gana
*│* ┊▸ ✦ $kiss. Comando de Juego de Beso.
*│* ┊▸ ✦ $marry. Comando de Juego de Casado .
*│* ┊▸ ✦ $divorce. Comando de Juego de Divorciado .
*│* ╰∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙ ∙ ∙ ∙ ∙
*╰ ▸▸ Comandos de Youtube ◂◂*
*│* ┊
*│* ┊▸ ✦ $yt. Comando para buscar y descargar musica.
*│* ╰∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙ ∙ ∙ ∙ ∙
`.trim()
    await sock.sendMessage(
        numberWa,
        {
            text: menuPrincipal,
        },
        {
            quoted: messages[0],
        }
    );
}

async function PingPong(sock,numberWa,messages) {
    await sock.sendMessage(
        numberWa,
        {
            text: "Pong!",
        },
        {
            quoted: messages[0],
        }
    );
}

async function getAdios(sock,numberWa,messages) {
    await sock.sendMessage(
        numberWa,
        {
            text: "Nos vemos.",
        },
        {
            quoted: messages[0],
        }
    );
}

async function getHola(sock,numberWa,messages) {
    await sock.sendMessage(
        numberWa,
        {
            text: "Hola, soy Ody Robot",
        },
        {
            quoted: messages[0],
        }
    );
}

module.exports = {
    juegoSiNo,
    getMenu,
    PingPong,
    getAdios,
    getHola
}
