FROM node:18-alpine

WORKDIR /app

COPY package.json .
RUN npm install

COPY . .

EXPOSE 3000

# Configuração para evitar travamento do react-scripts no Docker
ENV CI=true

CMD ["npm", "start"]
