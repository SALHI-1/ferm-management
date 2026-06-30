#!/bin/sh
set -e

# Remplacer le port dans la configuration Nginx par la variable environnement $PORT de Cloud Run
sed -i "s/\${PORT}/${PORT:-8080}/g" /etc/nginx/nginx.conf

# Optimiser la configuration Laravel pour la prod
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan storage:link --force 2>/dev/null || true

# ──────────────────────────────────────────────────────────────
# CORRECTION RACE CONDITION :
# PHP-FPM met ~27s à démarrer. Nginx se lie instantanément au port
# Cloud Run → le health check passe → les premières requêtes arrivent
# avant que PHP-FPM soit prêt → 502.
#
# Solution : démarrer PHP-FPM seul, attendre qu'il écoute sur :9000,
# puis démarrer Nginx. Nginx ne reçoit des requêtes que quand FPM est prêt.
# ──────────────────────────────────────────────────────────────

echo "[entrypoint] Démarrage de PHP-FPM..."
php-fpm --daemonize

echo "[entrypoint] Attente que PHP-FPM soit prêt sur le port 9000..."
for i in $(seq 1 60); do
    if nc -z 127.0.0.1 9000 2>/dev/null; then
        echo "[entrypoint] PHP-FPM est prêt après ${i}s."
        break
    fi
    sleep 1
done

if ! nc -z 127.0.0.1 9000 2>/dev/null; then
    echo "[entrypoint] ERREUR: PHP-FPM n'a pas démarré après 60s. Abandon."
    exit 1
fi

echo "[entrypoint] Démarrage de Nginx..."
exec nginx -g "daemon off;"