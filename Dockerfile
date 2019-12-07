FROM node:8
WORKDIR /usr/src/app
COPY package*.json ./

RUN npm install

# If you are building your code for production
ARG env=dev
ENV NODE_ENV=${env}
RUN if [ "${env}" = "production" ]; then npm ci --only=production && echo "enabling prod mode..."; else echo "NOT prod mode"; fi

COPY . .
EXPOSE 3000
CMD ["node", "./src/index.js"]
