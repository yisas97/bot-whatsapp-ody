FROM node:20.10.0-alpine3.18
# Crear un directorio de trabajo en el contenedor
WORKDIR /usr/src/app

# Copiar el archivo package.json y package-lock.json (si existe)
COPY package*.json ./

# Instalar las dependencias del proyecto
RUN npm install

# Copiar todos los archivos del proyecto al contenedor
COPY . .

# Exponer el puerto que utiliza tu aplicación
EXPOSE 3000

# Comando para ejecutar la aplicación
CMD [ "npm", "start" ]