#!/bin/sh
set -eu

# Sustituye variables en runtime
envsubst '${API_URL} ${API_UPSTREAM}' < /usr/share/nginx/html/env.template > /usr/share/nginx/html/env.js
envsubst '${API_UPSTREAM}' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf

exec "$@"