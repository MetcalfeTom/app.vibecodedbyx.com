FROM node:18-alpine

WORKDIR /usr/src/app

# Install dependencies first
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev || npm install --omit=dev

# Copy app code
COPY . .

EXPOSE 3000

CMD ["npm", "start"]

