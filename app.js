const {
    default: makeWASocket,
    DisconnectReason,
    useMultiFileAuthState,
} = require("@adiwajshing/baileys");
const ffmpeg = require('fluent-ffmpeg');

const buscadoryt = require('./src/plugins/buscador');
const ytdl = require('ytdl-core');

const pino = require("pino");
const log =  pino;
const {session} = {session: "session_auth_info"};
const {Boom} = require("@hapi/boom");
const fs = require("fs");
const express = require("express");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = require("express")();
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
const {insertSticker} = require("./src/plugins/sticker");
const {buscadorYoutube} = require("./src/plugins/youtube");
const {getRandom} = require("./src/utils/util");
const {juegoSiNo, getMenu, getHola, PingPong, getAdios} = require("./src/plugins/juegosSimples");
const {consultGPT} = require("./src/plugins/chatGpt");

app.use("/assets", express.static(__dirname + "/client/assets"));

app.get("/scan", (req, res) => {
    res.sendFile("./client/index.html", {
        root: __dirname,
    });
});

app.get("/", (req, res) => {
    res.send("server working");
});

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
                await connectToWhatsApp();
            } else if (reason === DisconnectReason.timedOut) {
                console.log("Se agotó el tiempo de conexión, conectando...");
                await connectToWhatsApp();
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
                                await insertSticker(sock,numberWa, 0);

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
                                await insertSticker(sock,numberWa, 1);
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
                                await insertSticker(sock,numberWa, 2);
                            }
                        }

                    }
                    const captureMessage = messages[0]?.message?.conversation;
                    const numberWa = messages[0]?.key?.remoteJid;

                    const compareMessage = captureMessage.toLocaleLowerCase();
                    console.log(compareMessage);
                    //Juego de preguntas si o no

                    if (compareMessage.startsWith("$.")) {
                        await juegoSiNo(sock, numberWa, messages);
                    } else if (compareMessage.startsWith("$!")) {
                        const palabras = compareMessage.replace(/\$\!/, '').split(',');
                        console.log("La nueva palabra : ", palabras);
                        const palabrasSeparadas = palabras.map(palabras => palabras.trim());
                        const indicePalabras = getRandom(palabrasSeparadas);
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
                        await buscadorYoutube(sock, numberWa, messages, compareMessage);
                    } else if (compareMessage.trim() === "yo") {
                        await getHola(sock,numberWa,messages);
                    } else if (compareMessage.trim() === "hola") {
                        await getHola(sock,numberWa,messages);
                    } else if (compareMessage.trim() === "ping") {
                        await PingPong(sock,numberWa,messages);
                    } else if (compareMessage.trim() === "chao") {
                        await getAdios(sock,numberWa,messages);
                    } else if (compareMessage.startsWith("$menu.")) {
                        await getMenu(sock, numberWa, messages);
                    }
                    //Aplicacion de Reacciones:
                    if (compareMessage.startsWith("$happy.")){
                        await insertSticker(sock,numberWa, 3);
                    }
                    if(compareMessage.startsWith("$openai.")){
                        console.log("Empieza el openAI");
                        await consultGPT(sock,numberWa,messages,compareMessage)
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