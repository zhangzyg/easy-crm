# Dockerfile
FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Prisma generate 和 migrate 将由 docker-compose 中的 command 执行
EXPOSE 3000

CMD ["npm", "start"]