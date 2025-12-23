FROM node:23-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

RUN npm install -g nodemon tsx

EXPOSE 3000

CMD ["npm", "run", "start:dev"]
