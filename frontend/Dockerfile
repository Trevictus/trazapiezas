# Etapa 1: Compilación de la aplicación Angular para entorno local
FROM node:20-alpine AS build

WORKDIR /app

# Copiar archivos de dependencias del frontend
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el código fuente
COPY . .

# Compilar el frontend con la configuración de desarrollo para que apunte al backend local (localhost:3000)
RUN npm run build -- --configuration=development

# Etapa 2: Servidor web Nginx para servir los archivos estáticos
FROM nginx:alpine

# Copiar el resultado de la compilación de Angular al servidor Nginx
COPY --from=build /app/dist/frontend/browser /usr/share/nginx/html

# Copiar la configuración personalizada de Nginx para soportar rutas de Angular
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponer el puerto del contenedor
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
