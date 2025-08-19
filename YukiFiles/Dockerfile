FROM php:8.3-apache
RUN a2enmod rewrite && docker-php-ext-install pdo pdo_sqlite
ENV APACHE_DOCUMENT_ROOT=/var/www/html/public
RUN sed -ri -e 's!/var/www/html!/var/www/html/public!g' /etc/apache2/sites-available/*.conf /etc/apache2/apache2.conf
WORKDIR /var/www/html
COPY . .
