FROM node:alpine  as builder


WORKDIR /app

COPY package*.json ./
RUN apk add terminus-font

RUN apk add --no-cache chromium nss freetype harfbuzz ca-certificates ttf-freefont nodejs yarn

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

RUN npm install
RUN npm install -g puppeteer@10.0.0 --unsafe-perm=true --allow-root
RUN npm install -g pm2
RUN npm install dotenv
COPY . /app

EXPOSE 3000


FROM alpine:latest
WORKDIR /app
COPY --from=build /app .

COPY --from=build /app ./.
COPY . .


ENTRYPOINT [ "pm2-runtime" ]
CMD ["src/app.js" ]