FROM node:18.19-alpine AS base
WORKDIR /usr/src/app

COPY package.json package-lock.json* ./
RUN npm install --omit=dev --ignore-scripts || npm install --omit=dev

COPY . .

EXPOSE 5000
ENV PORT=5000
CMD ["npm", "start"]

