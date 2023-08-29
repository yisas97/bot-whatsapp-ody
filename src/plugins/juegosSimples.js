const {getRandom} = require("../utils/util");

async function juegoSiNo(sock,numberWa,messages){
    const respuestas = ["Si", "No", "Es muy probable que si", "Estoy segura que no", "Las señales apuntan a que sí.", "Lo más probable", "Mi respuesta es no.", "Mi respuesta es si."];
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
*│* ┊▸ ✦ $hug. Comando de Juego de Abrazo .
*│* ┊▸ ✦ $hit. Comando de Juego de Golpe .
*│* ┊▸ ✦ $waifu. Comando que muestra una waifu
*│* ╰∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙ ∙ ∙ ∙ ∙
*╰ ▸▸ Comandos de Youtube ◂◂*
*│* ┊
*│* ┊▸ ✦ $yt. Comando para buscar y descargar musica.
*│* ╰∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙ ∙ ∙ ∙ ∙
*╰ ▸▸ Comandos de OpenAI ◂◂*
*│* ┊
*│* ┊▸ ✦ $openai. Comando para buscar en GPT.
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

async function getEstado(sock,numberWa,messages) {
    await sock.sendMessage(
        numberWa,
        {
            text: "Encerrada, con frío y en cuarentena. :D",
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
            text: "Adios, bendiciones de tu bot favorita. Cherry!.",
        },
        {
            quoted: messages[0],
        }
    );
}

async function getVivir(sock,numberWa,messages) {
    await sock.sendMessage(
        numberWa,
        {
            text: "Practicamente uso un número de Marco, asi que en su casa.",
        },
        {
            quoted: messages[0],
        }
    );
}

async function getEdad(sock,numberWa,messages) {
    await sock.sendMessage(
        numberWa,
        {
            text: "Practicamente me dieron vida el 28 de Agosto, asi que ni un mes he cumplido.",
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
            text: "Hola, soy Cherry, tu bot preferida :3",
        },
        {
            quoted: messages[0],
        }
    );
}

async function getYo(sock,numberWa,messages) {
    await sock.sendMessage(
        numberWa,
        {
            text: "Soy Batman :3",
        },
        {
            quoted: messages[0],
        }
    );
}

async function getDia(sock,numberWa,messages) {
    await sock.sendMessage(
        numberWa,
        {
            text: "Buen día, muchos ánimos el día de hoy. :3",
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
    getHola,
    getYo,
    getVivir,
    getEdad,
    getDia,
    getEstado
}
