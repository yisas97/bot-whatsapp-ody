const {
	default: makeWASocket,
	MessageType,
	MessageOptions,
	Mimetype,
	DisconnectReason,
	BufferJSON,
	AnyMessageContent,
	delay,
	fetchLatestBaileysVersion,
	isJidBroadcast,
	makeCacheableSignalKeyStore,
	makeInMemoryStore,
	MessageRetryMap,
	useMultiFileAuthState,
	msgRetryCounterMap,
} = require("@adiwajshing/baileys");

const buscadoryt = require('./buscador');
const descargar = require('./descargar');
const ytdl = require('ytdl-core');

const log = (pino = require("pino"));
const { session } = { session: "session_auth_info" };
const { Boom } = require("@hapi/boom");
const path = require("path");
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
app.use(bodyParser.urlencoded({ extended: true }));
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const port = process.env.PORT || 8000;
const qrcode = require("qrcode");

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
	const { state, saveCreds } = await useMultiFileAuthState("session_auth_info");

	sock = makeWASocket({
		printQRInTerminal: true,
		auth: state,
		logger: log({ level: "silent" }),
	});

	sock.ev.on("connection.update", async (update) => {
		const { connection, lastDisconnect, qr } = update;
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



	sock.ev.on("messages.upsert", async ({ messages, type }) => {
		try {
			if (type === "notify") {
				if (!messages[0]?.key.fromMe) {
					console.log("El inicio : ", messages);
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
									{ audio: { url: './output.mp3' }, mimetype: 'audio/mp4' },
									{ url: "audio.mp3" } //can send mp3, mp4, & ogg
								)
							}
						)
					} else if (compareMessage.trim() == "yo"){
						await sock.sendMessage(
							numberWa,
							{
								text: "Soy un robot",
							},
							{
								quoted: messages[0],
							}
						);
					} else if (compareMessage.trim() == "hola"){
						await sock.sendMessage(
							numberWa,
							{
								text: "Hola, soy Ody Robot",
							},
							{
								quoted: messages[0],
							}
						);
					} else if (compareMessage.trim() == "ping"){
						await sock.sendMessage(
							numberWa,
							{
								text: "Pong!",
							},
							{
								quoted: messages[0],
							}
						);
					} else if (compareMessage.trim() == "chao"){
						await sock.sendMessage(
							numberWa,
							{
								text: "Nos vemos.",
							},
							{
								quoted: messages[0],
							}
						);
					} else if (compareMessage.startsWith("$kiss.")){
						await sock.sendMessage(
							numberWa,
							{
								text: "Esta en proceso de realizar esa funcionalidad.",
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
			const { id, name } = sock?.user;
			var userinfo = id + " " + name;
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