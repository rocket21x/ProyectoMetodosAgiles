-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS localify;
USE localify;

-- Tabla USER
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('customer', 'provider', 'admin') NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    avatar_url VARCHAR(500)
);

-- Tabla PROVIDER
CREATE TABLE providers (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    business_name VARCHAR(255) NOT NULL,
    description TEXT,
    bank_clabe VARCHAR(18),
    logo_image JSON,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Tabla CUSTOMER
CREATE TABLE customers (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    date_of_birth DATE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Tabla EXPERIENCE
CREATE TABLE experiences (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    provider_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    price_per_person DECIMAL(10,2) NOT NULL,
    location VARCHAR(500) NOT NULL,
    meeting_point VARCHAR(500),
    images JSON,
    FOREIGN KEY (provider_id) REFERENCES providers(id) ON DELETE CASCADE
);

-- Tabla BOOKING
CREATE TABLE bookings (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    experience_id BIGINT NOT NULL,
    customer_id BIGINT NOT NULL,
    experience_date DATE NOT NULL,
    experience_time TIME NOT NULL,
    number_of_people INT NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    status ENUM('pending', 'confirmed', 'cancelled', 'completed') NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (experience_id) REFERENCES experiences(id),
    FOREIGN KEY (customer_id) REFERENCES customers(id)
);

-- Tabla REVIEW
CREATE TABLE reviews (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    booking_id BIGINT NOT NULL,
    experience_id BIGINT NOT NULL,
    customer_id BIGINT NOT NULL,
    rating INT NOT NULL,
    comment TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(id),
    FOREIGN KEY (experience_id) REFERENCES experiences(id),
    FOREIGN KEY (customer_id) REFERENCES customers(id)
);

-- Tabla PAYMENTS
CREATE TABLE payments (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    booking_id BIGINT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    status ENUM('pending', 'completed', 'failed', 'refunded') NOT NULL,
    payment_date DATETIME,
    FOREIGN KEY (booking_id) REFERENCES bookings(id)
);