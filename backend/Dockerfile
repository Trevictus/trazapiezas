FROM node:20-alpine

# Instalar dependencias necesarias para compilar módulos nativos como bcrypt
RUN apk add --no-cache python3 make g++

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias del proyecto
RUN npm install

# Copiar el código fuente del backend
COPY . .

# Compilar el proyecto TypeScript a JavaScript
RUN npm run build

# Exponer el puerto del backend configurado
EXPOSE 3000

# Arrancar la aplicación en producción
CMD ["npm", "start"]
