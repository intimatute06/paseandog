FROM php:8.4-cli
RUN apt-get update && apt-get install -y git unzip curl libpq-dev libzip-dev \
    && docker-php-ext-install pdo_pgsql pgsql zip \
    && curl -fsSL https://deb.nodesource.com/setup_22.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer
WORKDIR /app
COPY . .
RUN composer install --no-dev --optimize-autoloader --no-interaction
RUN npm ci && npm run build && rm -rf node_modules
RUN chmod -R 775 storage bootstrap/cache
EXPOSE 8080
CMD php artisan config:cache && php artisan migrate --force && php artisan serve --host=0.0.0.0 --port=${PORT:-8080}
