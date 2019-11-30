FROM node:10.17.0 AS dependencies
WORKDIR /app
COPY package*.json ./
RUN npm install --only=production

FROM dependencies AS build  
WORKDIR /app
COPY public ./public/
COPY routes ./routes/
COPY app.js ./
COPY models ./models/

FROM node:10.17.0 AS release  

WORKDIR /app
COPY --from=build /app ./
CMD ["node", "app"]