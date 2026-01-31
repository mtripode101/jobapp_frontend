# Stage 1: build the frontend (Node)
FROM node:18-alpine AS build
WORKDIR /app

# Copiar package files para cachear dependencias
COPY package.json package-lock.json* yarn.lock* ./
RUN if [ -f yarn.lock ]; then yarn --frozen-lockfile --production=false --verbose; else npm ci --verbose; fi

# Copiar el resto del código y compilar
COPY . .
# Asume script "build" en package.json que genera la carpeta build (React)
RUN npm run build --if-present

# Stage 2: servir con nginx
FROM nginx:stable-alpine
# Copia los archivos estáticos generados (React crea /app/build)
COPY --from=build /app/build /usr/share/nginx/html

# Copiar configuración nginx y entrypoint para inyección runtime de variables
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

EXPOSE 80
HEALTHCHECK --interval=15s --timeout=5s --retries=3 CMD wget -qO- http://localhost/ || exit 1

ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]