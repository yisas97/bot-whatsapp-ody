const {
    default: makeWASocket,
    DisconnectReason,
    useMultiFileAuthState,
} = require("@adiwajshing/baileys");
const ffmpeg = require('fluent-ffmpeg');

const buscadoryt = require('./src/plugins/buscador');
const ytdl = require('ytdl-core');

const log = (pino = require("pino"));
const {session} = {session: "session_auth_info"};
const {Boom} = require("@hapi/boom");
const fs = require("fs");
const express = require("express");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = require("express")();
const {Sticker, StickerTypes} = require('wa-sticker-formatter');
// enable files upload
app.use(
    fileUpload({
        createParentPath: true,
    })
);

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const port = process.env.PORT || 8000;
const qrcode = require("qrcode");
const {beso1, beso2, beso3, beso4} = require("./src/stickers/giftBase64");
const {
    besoEstatico1,
    besoEstatico2,
    besoEstatico3,
    besoEstatico4,
    besoEstatico5,
    besoEstatico6,
    besoEstatico8,
    besoEstatico9,
    besoEstatico7,
    besoEstatico10, casadoEstatico1, casadoEstatico2, casadoEstatico3, casadoEstatico4, casadoEstatico5,
    divorciadoEstatico1, divorciadoEstatico2, divorciadoEstatico3, divorciadoEstatico4
} = require("./src/stickers/stickerEstaticos");

app.use("/assets", express.static(__dirname + "/client/assets"));

app.get("/scan", (req, res) => {
    res.sendFile("./client/index.html", {
        root: __dirname,
    });
});

app.get("/", (req, res) => {
    res.send("server working");
});


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

let sock;
let qrDinamic;
let soket;

async function connectToWhatsApp() {
    const {state, saveCreds} = await useMultiFileAuthState("session_auth_info");

    sock = makeWASocket({
        printQRInTerminal: true,
        auth: state,
        logger: log({level: "silent"}),
    });

    sock.ev.on("connection.update", async (update) => {
        const {connection, lastDisconnect, qr} = update;
        qrDinamic = qr;
        if (connection === "close") {
            let reason = new Boom(lastDisconnect.error).output.statusCode;
            if (reason === DisconnectReason.badSession) {
                console.log(
                    `Bad Session File, Please Delete ${session} and Scan Again`
                );
                sock.logout();
            } else if (reason === DisconnectReason.connectionClosed) {
                console.log("Conexión cerrada, reconectando....");
                connectToWhatsApp();
            } else if (reason === DisconnectReason.connectionLost) {
                console.log("Conexión perdida del servidor, reconectando...");
                connectToWhatsApp();
            } else if (reason === DisconnectReason.connectionReplaced) {
                console.log(
                    "Conexión reemplazada, otra nueva sesión abierta, cierre la sesión actual primero"
                );
                sock.logout();
            } else if (reason === DisconnectReason.loggedOut) {
                console.log(
                    `Dispositivo cerrado, elimínelo ${session} y escanear de nuevo.`
                );
                sock.logout();
            } else if (reason === DisconnectReason.restartRequired) {
                console.log("Se requiere reinicio, reiniciando...");
                connectToWhatsApp();
            } else if (reason === DisconnectReason.timedOut) {
                console.log("Se agotó el tiempo de conexión, conectando...");
                connectToWhatsApp();
            } else {
                sock.end(
                    `Motivo de desconexión desconocido: ${reason}|${lastDisconnect.error}`
                );
            }
        } else if (connection === "open") {
            console.log("conexión abierta");
            return;
        }
    });


    async function insertSticker(numberWa, type) {
        let imagePath;
        let sticker;
        let arrayEstatico;
        let randomElement;
        let gitBuffer;
        switch (type) {
            case 0:
                arrayEstatico = [besoEstatico1, besoEstatico2, besoEstatico3, besoEstatico4, besoEstatico5, besoEstatico6, besoEstatico7, besoEstatico8, besoEstatico9, besoEstatico10];
                randomElement = getRandomElement(arrayEstatico);
                gitBuffer = Buffer.from(randomElement, 'base64');

                sticker = await new Sticker(gitBuffer, {
                    pack: `Besos estaticos`,
                    author: 'Jesus',
                    type: StickerTypes.DEFAULT,
                    categories: ['🤩', '🎉'],
                    quality: 100,
                }).build()

                return await sock.sendMessage(
                    numberWa,
                    {
                        sticker
                    }
                );
            case 1:
                arrayEstatico = [casadoEstatico1,casadoEstatico2,casadoEstatico3,casadoEstatico4,casadoEstatico5];
                randomElement = getRandomElement(arrayEstatico);
                gitBuffer = Buffer.from(randomElement, 'base64');
                sticker = await new Sticker(gitBuffer, {
                    pack: 'Casados ODY',
                    author: 'Jesus',
                    type: StickerTypes.DEFAULT,
                    categories: ['🤩', '🎉'],
                    quality: 100,
                }).build()

                return await sock.sendMessage(
                    numberWa,
                    {
                        sticker
                    }
                );
            case 2:
                arrayEstatico = [divorciadoEstatico1,divorciadoEstatico2,divorciadoEstatico3,divorciadoEstatico4];
                randomElement = getRandomElement(arrayEstatico);
                gitBuffer = Buffer.from(randomElement, 'base64');

                sticker = await new Sticker(gitBuffer, {
                    pack: 'My Sticker',
                    author: 'Jesus',
                    type: StickerTypes.DEFAULT,
                    categories: ['🤩', '🎉'],
                    quality: 100,
                }).build()

                return await sock.sendMessage(
                    numberWa,
                    {
                        sticker
                    }
                );

        }

    }

    function getRandomElement(arr) {
        const randomIndex = Math.floor(Math.random() * arr.length);
        console.log("El numero de indice es : ", randomIndex);
        return arr[randomIndex];
    }


    async function insertGift(numberWa, type) {
        let imagePath;
        let sticker
        switch (type) {
            case 0:
                const arrayBesos = [beso1, beso2, beso3, beso4];
                fs.writeFileSync('output.gif', getRandomElement(arrayBesos), 'base64', function (err) {
                    console.log(err);
                })

                ffmpeg('output.gif')
                    .output('output.mp4')
                    .on('end', function () {
                        console.log('La conservision de completo');
                    })
                    .run();
                const videoGift = fs.readFileSync('./output.mp4')

                return await sock.sendMessage(
                    numberWa,
                    {
                        video: videoGift,
                        caption: "Beso |-.-|",
                        gifPlayback: false
                    }
                );
            case 1:
                imagePath = './marry.png';

                sticker = await new Sticker(imagePath, {
                    pack: 'Casados ODY',
                    author: 'Jesus',
                    type: StickerTypes.DEFAULT,
                    categories: ['🤩', '🎉'],
                    quality: 100,
                }).build()

                return await sock.sendMessage(
                    numberWa,
                    {
                        sticker
                    }
                );
            case 2:
                imagePath = './marry.png';

                sticker = await new Sticker(imagePath, {
                    pack: 'My Sticker',
                    author: 'Jesus',
                    type: StickerTypes.DEFAULT,
                    categories: ['🤩', '🎉'],
                    quality: 100,
                }).build()

                return await sock.sendMessage(
                    numberWa,
                    {
                        sticker
                    }
                );

        }

    }

    sock.ev.on("messages.upsert", async ({messages, type}) => {
        try {
            if (type === "notify") {
                if (!messages[0]?.key.fromMe) {
                    console.log("El mensaje : ", messages);
                    console.log("El tipo : ", type);
                    if (messages[0]?.message.extendedTextMessage) {
                        const extendedTextMessage = messages[0]?.message.extendedTextMessage;
                        const numberWa = messages[0]?.key?.remoteJid;
                        console.log("NumberWA: ", numberWa);
                        console.log("Extend: ", extendedTextMessage);
                        const text = extendedTextMessage.text;
                        console.log("Texto del mensaje en extension: ", text);
                        //Verificar la mencion

                        //Quien lo manda
                        const participant = messages[0]?.key.participant;
                        console.log("Participant: ", participant);
                        if (extendedTextMessage.contextInfo.mentionedJid) {
                            const mentionedJid = extendedTextMessage.contextInfo.mentionedJid;
                            const mentioned = mentionedJid[0].split('@')[0];
                            console.log("Mencionado: ", mentioned);
                            console.log("Menciones: ", mentionedJid);

                            if (text.startsWith("$kiss.")) {
                                console.log(messages[0]);
                                await sock.sendMessage(
                                    numberWa,
                                    {
                                        text: `@${mentionedJid[0].split('@')[0]} ha recibido un beso de @${participant.split('@')[0]}`,
                                        mentions: [mentionedJid[0], participant]
                                    }
                                    ,
                                    {
                                        quoted: null
                                    }
                                );
                                await insertSticker(numberWa, 0);

                            }
                            if (text.startsWith("$marry.")) {
                                console.log(messages[0]);
                                await sock.sendMessage(
                                    numberWa,
                                    {
                                        text: `@${mentionedJid[0].split('@')[0]} se caso con @${participant.split('@')[0]}`,
                                        mentions: [mentionedJid[0], participant]
                                    }
                                    ,
                                    {
                                        quoted: null
                                    }
                                );
                                await insertSticker(numberWa, 1);
                            }
                            if (text.startsWith("$divorce.")) {
                                console.log(messages[0]);
                                await sock.sendMessage(
                                    numberWa,
                                    {
                                        text: `@${mentionedJid[0].split('@')[0]} se divorcio de @${participant.split('@')[0]}`,
                                        mentions: [mentionedJid[0], participant]
                                    }
                                    ,
                                    {
                                        quoted: null
                                    }
                                );
                                await insertSticker(numberWa, 2);
                            }
                        }

                    }
                    const captureMessage = messages[0]?.message?.conversation;
                    const numberWa = messages[0]?.key?.remoteJid;

                    const compareMessage = captureMessage.toLocaleLowerCase();
                    console.log(compareMessage);
                    //Juego de preguntas si o no
                    const respuestas = ["Si", "No", "Es muy probable que si", "Estoy seguro que no", "Las señales apuntan a que sí.", "Lo más probable", "Mi respuesta es no.", "Mi respuesta es si."];
                    if (compareMessage.startsWith("$.")) {
                        const indiceRespuesta = Math.floor(Math.random() * respuestas.length);
                        await sock.sendMessage(
                            numberWa,
                            {
                                text: respuestas[indiceRespuesta],
                            },
                            {
                                quoted: messages[0],
                            }
                        );
                    } else if (compareMessage.startsWith("$!")) {
                        const palabras = compareMessage.replace(/\$\!/, '').split(',');
                        console.log("La nueva palabra : ", palabras);
                        const palabrasSeparadas = palabras.map(palabras => palabras.trim());
                        const indicePalabras = Math.floor(Math.random() * palabrasSeparadas.length);
                        const palabrasSeleccionada = palabrasSeparadas[indicePalabras];
                        console.log("Palabra seleccionada: ", palabrasSeleccionada);

                        await sock.sendMessage(
                            numberWa,
                            {
                                text: palabrasSeleccionada,
                            },
                            {
                                quoted: messages[0],
                            }
                        );

                    } else if (compareMessage.startsWith("$yt.")) {
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
                                    {audio: {url: './output.mp3'}, mimetype: 'audio/mp4'},
                                    {url: "audio.mp3"} //can send mp3, mp4, & ogg
                                )
                            }
                        )
                    } else if (compareMessage.trim() === "yo") {
                        await sock.sendMessage(
                            numberWa,
                            {
                                text: "Soy un robot",
                            },
                            {
                                quoted: messages[0],
                            }
                        );
                    } else if (compareMessage.trim() === "hola") {
                        await sock.sendMessage(
                            numberWa,
                            {
                                text: "Hola, soy Ody Robot",
                            },
                            {
                                quoted: messages[0],
                            }
                        );
                    } else if (compareMessage.trim() === "ping") {
                        await sock.sendMessage(
                            numberWa,
                            {
                                text: "Pong!",
                            },
                            {
                                quoted: messages[0],
                            }
                        );
                    } else if (compareMessage.trim() === "chao") {
                        await sock.sendMessage(
                            numberWa,
                            {
                                text: "Nos vemos.",
                            },
                            {
                                quoted: messages[0],
                            }
                        );
                    } else if (compareMessage.startsWith("$kiss.")) {
                        await sock.sendMessage(
                            numberWa,
                            {
                                text: "Esta en proceso de realizar esa funcionalidad.",
                            },
                            {
                                quoted: messages[0],
                            }
                        );
                    } else if (compareMessage.startsWith("$menu.")) {
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

                }
            }
        } catch (error) {
            console.log("error ", error);
        }
    });

    sock.ev.on("creds.update", saveCreds);
}

const isConnected = () => {
    return sock?.user ? true : false;
};

app.get("/send-message", async (req, res) => {
    const tempMessage = req.query.message;
    const number = req.query.number;

    let numberWA;
    try {
        if (!number) {
            res.status(500).json({
                status: false,
                response: "El numero no existe",
            });
        } else {
            numberWA = "591" + number + "@s.whatsapp.net";

            if (isConnected()) {


                const exist = await sock.onWhatsApp(numberWA);

                if (exist?.jid || (exist && exist[0]?.jid)) {
                    sock
                        .sendMessage(exist.jid || exist[0].jid, {
                            text: tempMessage,
                        })
                        .then((result) => {
                            res.status(200).json({
                                status: true,
                                response: result,
                            });
                        })
                        .catch((err) => {
                            res.status(500).json({
                                status: false,
                                response: err,
                            });
                        });
                }
            } else {
                res.status(500).json({
                    status: false,
                    response: "Aun no estas conectado",
                });
            }
        }
    } catch (err) {
        res.status(500).send(err);
    }
});

io.on("connection", async (socket) => {
    soket = socket;
    if (isConnected()) {
        updateQR("connected");
    } else if (qrDinamic) {
        updateQR("qr");
    }
});

const updateQR = (data) => {
    switch (data) {
        case "qr":
            qrcode.toDataURL(qrDinamic, (err, url) => {
                soket?.emit("qr", url);
                soket?.emit("log", "QR recibido , scan");
            });
            break;
        case "connected":
            soket?.emit("qrstatus", "./assets/check.svg");
            soket?.emit("log", " usaario conectado");
            const {id, name} = sock?.user;
            const userinfo = id + " " + name;
            soket?.emit("user", userinfo);

            break;
        case "loading":
            soket?.emit("qrstatus", "./assets/loader.gif");
            soket?.emit("log", "Cargando ....");

            break;
        default:
            break;
    }
};

connectToWhatsApp().catch((err) => console.log("unexpected error: " + err)); // catch any errors
server.listen(port, () => {
    console.log("Server Run Port : " + port);
});