# 🚀 Smart Pick & Drop Delivery Management System (Backend API)

![NestJS](https://img.shields.io/badge/NestJS-v11.0-red?style=for-the-badge&logo=nestjs)
![TypeScript](https://img.shields.io/badge/TypeScript-v5.7-blue?style=for-the-badge&logo=typescript)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-v16-navy?style=for-the-badge&logo=postgresql)
![TypeORM](https://img.shields.io/badge/TypeORM-v11.0-orange?style=for-the-badge&logo=typeorm)
![JWT](https://img.shields.io/badge/JWT-Authentication-black?style=for-the-badge&logo=json-web-tokens)

A robust, enterprise-grade **RESTful API Backend** for a modern logistics and consignment delivery platform built with **NestJS**, **TypeScript**, **PostgreSQL**, and **TypeORM**.

---

## 📌 Features & Key Modules

### 👤 1. Authentication & Identity Management (`/auth`)
* **Role-Based Access Control (RBAC)**: Support for `Customer`, `Rider`, and `Admin` roles.
* **Password Hashing**: Secure password encryption using `bcrypt` (Cost Factor: 10).
* **JWT Authentication**: Passport-JWT stateless token-based authorization.
* **Rider NID Upload**: Multipart form-data image upload using `Multer`.

### 📦 2. Customer Consignment Booking (`/orders`)
* **Dynamic Fare Calculation**: Automatic fare computation based on pickup/drop delivery zone, parcel weight, and delivery speed (`regular` vs `express`).
* **Order Lifecycle**: Booking, updating pending details, cancellation within allowable timeframes, and full order history tracking.

### 🏍️ 3. Rider Logistics Operations (`/orders`)
* **Jobs Board**: View available pending orders filtered by zone.
* **Order Acceptance**: Assign rider to consignment after NID verification check (`RiderVerifiedGuard`).
* **Delivery Pipeline**: Step-by-step status transitions: `accepted` ➔ `picked_up` ➔ `in_transit` ➔ `delivered`.

### 🗺️ 4. Delivery Zone & Dynamic Rates (`/zones`)
* **Zone Management**: Custom rate cards storing base regular fare, base express fare, weight limits (kg), and excess weight charges.
* **Automated Seeding**: Default initialization of `'Inside Dhaka'` and `'Outside Dhaka'` zones on application bootstrap (`OnModuleInit`).
* **Notification Integration**: Automated email alerts via `@nestjs-modules/mailer` on zone creation.

### 🛡️ 5. Administration & Dashboard Analytics (`/admin`)
* **System Metrics**: Aggregated user counts by role, order status distribution, and total system revenue (`SUM(fare)` for completed orders).
* **Verification & Security**: Approve or reject rider NID submissions and suspend problematic user accounts (`isActive = false`).

---

## 🛠️ Technology Stack

| Component | Technology Used |
| :--- | :--- |
| **Framework** | NestJS (Node.js) |
| **Language** | TypeScript |
| **Database** | PostgreSQL |
| **ORM** | TypeORM |
| **Authentication** | Passport-JWT, Bcrypt |
| **Validation** | class-validator, class-transformer |
| **File Storage** | Multer |
| **Email Service** | @nestjs-modules/mailer (Nodemailer) |

---

## 🗄️ Database Architecture & Entities

The system utilizes 4 core TypeORM entities:

1. **`User`** (`src/users/entities/user.entity.ts`): Stores user credentials, phone, email, role enum, and active status.
2. **`RiderVerification`** (`src/users/entities/rider-verification.entity.ts`): Stores NID number, document image path, and approval status (`pending`, `approved`, `rejected`).
3. **`DeliveryZone`** (`src/zones/entities/delivery-zone.entity.ts`): Stores pricing rules for geographical zones.
4. **`Order`** (`src/orders/entities/order.entity.ts`): Stores consignment details, pickup/drop locations, weight, fare, status pipeline, and user relations.

---

## ⚙️ Environment Setup

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=3000

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=admin
DB_NAME=smart-pick

# JWT Authentication
JWT_SECRET=smart-pick-secret
JWT_EXPIRES_IN=7d

# Email Notification Configuration (Optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-google-app-password
```

---

## 🚀 Running the Project

### 1. Install Dependencies
```bash
npm install
```

### 2. Run in Development Mode
```bash
npm run start:dev
```

### 3. Build for Production
```bash
npm run build
npm run start:prod
```

---

## 🌐 API Endpoint Reference

| Method | Endpoint | Access / Guard | Description |
| :--- | :--- | :--- | :--- |
| **`POST`** | `/auth/register-customer` | Public | Register a new Customer account |
| **`POST`** | `/auth/register-rider` | Public (Multer) | Register a Rider with NID document upload |
| **`POST`** | `/auth/login` | Public | Authenticate user & receive Access Token |
| **`GET`** | `/zones` | Public | Get all active delivery zones & fare rates |
| **`POST`** | `/zones` | JWT + Admin | Create a new delivery zone rate card |
| **`PATCH`** | `/zones/:id` | JWT + Admin | Update base fares and weight surcharges |
| **`POST`** | `/orders/create` | JWT + Customer | Book a new consignment delivery |
| **`GET`** | `/orders/customer/history` | JWT + Customer | View customer's order history & status |
| **`PATCH`** | `/orders/customer/edit/:id` | JWT + Customer | Edit details of a pending order |
| **`DELETE`** | `/orders/customer/cancel/:id` | JWT + Customer | Cancel a pending or newly accepted order |
| **`GET`** | `/orders/available` | JWT + Verified Rider | View open delivery jobs board |
| **`PATCH`** | `/orders/accept/:id` | JWT + Verified Rider | Accept a pending consignment job |
| **`PATCH`** | `/orders/status/:id` | JWT + Verified Rider | Update status (`picked_up`, `in_transit`, `delivered`) |
| **`GET`** | `/admin/dashboard` | JWT + Admin | View metrics, order counts, and system revenue |
| **`PATCH`** | `/admin/verify-rider/:id` | JWT + Admin | Approve or reject rider NID verification |
| **`PATCH`** | `/admin/users/suspend/:id` | JWT + Admin | Suspend a user account (`isActive = false`) |
| **`GET`** | `/users/profile` | JWT (Logged in) | View user's own profile details |
| **`PATCH`** | `/users/profile` | JWT (Logged in) | Update name, phone, email, or password |

---

## 📄 License
This project is proprietary software developed for AIUB Academic Presentation & Defense.
