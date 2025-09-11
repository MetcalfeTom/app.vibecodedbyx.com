FROM node:18-alpine
WORKDIR /app

# Copy package and install (no deps, but keeps pattern consistent)
COPY package.json ./
RUN npm install --omit=dev || true

# Copy app
COPY . .

EXPOSE 3000
CMD ["npm", "start"]

