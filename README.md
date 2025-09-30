# 🐈 Elysia-Boilerplate API

Elysia-Boilerplate API เป็น Starter Template สำหรับการพัฒนา REST API
ด้วย [Elysia](https://elysiajs.com/) และ [Bun](https://bun.sh/)\
โดยมี library เสริมเป็น [Prisma]([https://elysiajs.com/](https://www.prisma.io/)) เพื่อการทำ ORM เเละ jwt เพื่อทำ Authentication
รองรับการใช้งานทั้ง **local development** และ **Docker Compose**

------------------------------------------------------------------------

## 🚀 Development

เริ่มต้นเซิร์ฟเวอร์สำหรับการพัฒนา:

``` bash
bun run dev
```

จากนั้นเปิดเบราว์เซอร์ที่:

    http://localhost:8080

------------------------------------------------------------------------

## 🐳 Run with Docker / Docker Compose

คุณสามารถรันด้วย Docker Compose ได้ง่าย ๆ:

``` bash
docker-compose up --build
```

หรือใช้ Docker ปกติ:

``` bash
docker build -t elysia-api .
docker run -p 8080:8080 elysia-api
```

------------------------------------------------------------------------

## 📡 API Endpoints

เมื่อรันเซิร์ฟเวอร์แล้ว คุณสามารถเข้าถึงได้ตามนี้:

-   🦊 **Base URL**:

        http://localhost:8080

-   🏥 **Health Check**:

        http://localhost:8080/health-check

-   📚 **API Documentation (OpenAPI)**:

        http://localhost:8080/openapi

------------------------------------------------------------------------

## 📝 Console Logs

เมื่อเริ่มรันแอป คุณจะเห็นข้อความใน console แบบนี้:

    🦊 Elysia is running at localhost:8080
    🏥 You can check the service is working at localhost:8080/health-check
    📚 API Docs: localhost:8080/openapi
