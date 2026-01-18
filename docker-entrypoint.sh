#!/bin/sh
# Reemplaza variables en tiempo de ejecución usando envsubst
# Si no existe env.template, simplemente arranca nginx
TEMPLATE="/usr/share/nginx/html/env.template"
OUT="/usr/share/nginx/html/env.js"

if [ -f "$TEMPLATE" ]; then
  # Genera env.js con las variables de entorno disponibles
  /bin/sh -c "envsubst '\$API_URL' < $TEMPLATE > $OUT"
fi

exec "$@"