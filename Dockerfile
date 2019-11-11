FROM node:8
WORKDIR /usr/src/app
COPY package*.json ./

# RUN npm install

# If you are building your code for production
RUN npm ci --only=production

ENV NODE_ENV production

COPY . .
EXPOSE 3000
CMD ["node", "./src/index.js"]
