# --- Stage 1: Build des assets Node.js (Inertia/React) ---
FROM node:20-alpine AS asset-builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --legacy-peer-deps
COPY . .
RUN npm run build

# --- Stage 2: Production PHP/Nginx ---
FROM php:8.4-fpm-alpine

# Installer les extensions PHP nécessaires pour PostgreSQL et Laravel
# netcat-openbsd fournit 'nc' pour le test de port (readiness check PHP-FPM)
RUN apk add --no-cache nginx curl libpq-dev netcat-openbsd \
    && docker-php-ext-install pdo pdo_pgsql

# Configurer Nginx
COPY docker/nginx.conf /etc/nginx/nginx.conf

# Définir le dossier de travail
WORKDIR /var/www/html

# Copier le code de l'application
COPY . .
# Copier les assets compilés depuis le Stage 1
COPY --from=asset-builder /app/public/build ./public/build

# Installer Composer et les dépendances PHP
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer
RUN composer install --no-dev --optimize-autoloader

# Donner les bons droits d'accès
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

# Créer le répertoire pour le fichier de credentials GCS
# (Cloud Run le montera via Secret Manager volume mount)
RUN mkdir -p /var/secrets/gcs && chown -R www-data:www-data /var/secrets/gcs

# Variable d'environnement par défaut pour le fichier de clé GCS
ENV GOOGLE_CLOUD_KEY_FILE=/var/secrets/gcs/key.json

# Exposer le script de démarrage
COPY docker/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

ENTRYPOINT ["entrypoint.sh"]