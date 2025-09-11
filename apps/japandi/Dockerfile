FROM node:18-alpine

WORKDIR /usr/src/app

# Copy only needed files
COPY package.json ./
COPY server.js ./
COPY public ./public

ENV NODE_ENV=production
EXPOSE 3000

CMD ["node", "server.js"]

