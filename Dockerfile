# Imagen base
FROM node:20-alpine

# Directorio de trabajo
WORKDIR /app

# Copiar package y lock
COPY package*.json ./

# Instalar dependencias
RUN npm install --omit=dev

# Copiar código
COPY . .

# Exponer puerto
EXPOSE 3000

# Comando
CMD ["npm", "start"]