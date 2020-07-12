FROM node:8 as build
WORKDIR /usr/src/app
COPY package*.json ./

# If you are building your code for production
ARG env=dev
ENV NODE_ENV=${env}
RUN if [ "${env}" = "prod" ]; then echo "enabling prod mode..."  && npm ci --only=production; else echo "NOT prod mode" && npm install; fi

COPY . .

FROM node:8-alpine as prod
WORKDIR /usr/src/app
COPY --from=build /usr/src/app .
ARG env=dev
ENV NODE_ENV=${env}
EXPOSE 3000
CMD ["node", "./src/index.js"]
