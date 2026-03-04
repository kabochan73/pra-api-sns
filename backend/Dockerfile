FROM php:8.4-cli

WORKDIR /var/www

RUN apt-get update && apt-get install -y \
    git unzip curl libzip-dev libonig-dev \
    && docker-php-ext-install pdo_mysql zip bcmath

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

COPY . .

RUN composer install --ignore-platform-reqs

EXPOSE 8000