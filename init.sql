-- Drop tables if they exist to ensure a clean state (optional, use with caution)
DROP TABLE IF EXISTS "Product" CASCADE;
DROP TABLE IF EXISTS "User" CASCADE;

-- Create User table
CREATE TABLE IF NOT EXISTS "User"
(
    id         SERIAL PRIMARY KEY NOT NULL,
    username   VARCHAR(50) CONSTRAINT "User_username_key" UNIQUE NOT NULL,
    password   VARCHAR(255) CONSTRAINT "User_password_nn" NOT NULL,
    createdAt  TIMESTAMP CONSTRAINT "User_createdAt_nn" NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create Product table
CREATE TABLE IF NOT EXISTS "Product"
(
    id          SERIAL PRIMARY KEY NOT NULL,
    name        VARCHAR(100) CONSTRAINT "Product_name_nn" NOT NULL,
    price       NUMERIC(10,2) CONSTRAINT "Product_price_nn" NOT NULL,
    createdAt   TIMESTAMP CONSTRAINT "Product_createdAt_nn" NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt   TIMESTAMP CONSTRAINT "Product_updatedAt_nn" NOT NULL DEFAULT CURRENT_TIMESTAMP,
    userId      INTEGER CONSTRAINT "Product_userId_nn" NOT NULL,
    CONSTRAINT "Product_userId_fkey" FOREIGN KEY (userId) REFERENCES "User"(id) ON DELETE CASCADE
);

-- Create indexes only if they don't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT FROM pg_indexes 
        WHERE indexname = 'User_username_key' 
        AND schemaname = 'public'
    ) THEN
        CREATE UNIQUE INDEX "User_username_key" ON "User"(username);
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT FROM pg_indexes 
        WHERE indexname = 'Product_userId_idx' 
        AND schemaname = 'public'
    ) THEN
        CREATE INDEX "Product_userId_idx" ON "Product"(userId);
    END IF;
END $$;

-- Seed users only if the table is empty
DO $$ 
BEGIN
    IF (SELECT COUNT(*) FROM "User") = 0 THEN
        INSERT INTO "User" (username, password) VALUES
        ('admin', '$2b$12$npTrQqhyOkFI1YtiaGqP6.wrh3Gu2LxMf.4f7lEviSEcrjswwYTtS'),
        ('user1', '$2b$12$LBTgbVgYUCr540oi20lo2exKcZksxEX5VULQAe4YjVtBBWHcQS896'),
        ('test', '$2b$12$cFzo0EDeEFnOXdNWSwzECe3wMxP5r7ISmOuOl2h2mOEO.4g7Q/TeK'),
        ('michaela', '$2b$12$OnB1u.5IMPmNmyLudmouGe.RV8ykC.Ovbcu8le5dvQJVk3Icw8NwW'),
        ('daniel', '$2b$12$85s3GgVsmHK5WG2lPy200e2.OXonnIlDvhgjba58esHu3IcAICKF6');
    END IF;
END $$;

-- Seed products only if the table is empty
DO $$ 
BEGIN
    IF (SELECT COUNT(*) FROM "Product") = 0 THEN
        INSERT INTO "Product" (name, price, userId, updatedAt) VALUES
        ('Laptop Pro', 1299.99, 1, CURRENT_TIMESTAMP),
        ('Wireless Mouse', 29.99, 1, CURRENT_TIMESTAMP),
        ('Office Chair', 199.99, 2, CURRENT_TIMESTAMP),
        ('Monitor 27in', 299.99, 2, CURRENT_TIMESTAMP),
        ('Keyboard Mechanical', 89.99, 3, CURRENT_TIMESTAMP),
        ('Headphones', 149.99, 3, CURRENT_TIMESTAMP),
        ('Smartphone', 799.99, 4, CURRENT_TIMESTAMP),
        ('Tablet', 499.99, 4, CURRENT_TIMESTAMP),
        ('Desk Lamp', 39.99, 5, CURRENT_TIMESTAMP),
        ('External HDD', 79.99, 5, CURRENT_TIMESTAMP),
        ('Coffee Mug', 12.99, 1, CURRENT_TIMESTAMP),
        ('Notebook', 5.99, 2, CURRENT_TIMESTAMP),
        ('Pen Set', 8.99, 3, CURRENT_TIMESTAMP),
        ('Backpack', 45.99, 4, CURRENT_TIMESTAMP),
        ('USB Cable', 9.99, 5, CURRENT_TIMESTAMP),
        ('Webcam', 59.99, 1, CURRENT_TIMESTAMP),
        ('Printer', 149.99, 2, CURRENT_TIMESTAMP),
        ('Scanner', 199.99, 3, CURRENT_TIMESTAMP),
        ('Router', 89.99, 4, CURRENT_TIMESTAMP),
        ('Power Bank', 29.99, 5, CURRENT_TIMESTAMP);
    END IF;
END $$;

-- Log completion
DO $$ 
BEGIN
    RAISE NOTICE 'Initialization script for User and Product tables completed. Seeded 5 users and 20 products.';
END $$;