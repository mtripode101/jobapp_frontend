# Stage 1: build React app
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build

# Stage 2: serve with nginx
FROM nginx:stable-alpine

RUN apk add --no-cache gettext

COPY --from=build /app/build /usr/share/nginx/html
COPY env.template /usr/share/nginx/html/env.template
COPY nginx.conf.template /etc/nginx/conf.d/default.conf.template
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

EXPOSE 80
HEALTHCHECK --interval=15s --timeout=5s --retries=3 CMD wget -qO- http://localhost/ || exit 1

ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]