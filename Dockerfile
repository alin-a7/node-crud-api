FROM node:23-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Устанавливаем dev tools, если нужно
RUN npm install -g nodemon tsx

EXPOSE 3000

CMD ["npm", "run", "start:dev"]
