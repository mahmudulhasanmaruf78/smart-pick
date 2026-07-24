# Detailed File-By-File Project Split (For 4 Members)

Since your team is new to NestJS, this list provides the **exact folder paths, file names, and descriptions** of what goes where. This will make it easy to create the files and keep track of who does what.

---

## Complete Project File Structure

Here is how your project's `src/` folder will look at the end of this sprint:

```text
src/
├── app.module.ts                 (Edited by: All, connects database & modules)
├── main.ts                       (Completed, sets up global validation & uploads)
│
├── users/                        (Shared: Users, profiles, and DB structures)
│   ├── users.module.ts
│   ├── users.service.ts
│   ├── users.controller.ts
│   ├── dto/
│   │   └── update-user.dto.ts
│   └── entities/
│       ├── user.entity.ts
│       └── rider-verification.entity.ts
│
├── auth/                         (Assigned to: Member 1 - Login & Security)
│   ├── auth.module.ts
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── jwt.strategy.ts
│   ├── jwt-auth.guard.ts
│   ├── roles.decorator.ts
│   ├── roles.guard.ts
│   └── dto/
│       ├── register-customer.dto.ts
│       ├── register-rider.dto.ts
│       └── login.dto.ts
│
├── orders/                       (Assigned to: Member 2 & Member 3 - Deliveries)
│   ├── orders.module.ts
│   ├── orders.controller.ts      (Handles both customer & rider requests)
│   ├── orders.service.ts         (Fare calculations, state transitions)
│   ├── dto/
│   │   ├── create-order.dto.ts          (Member 2)
│   │   ├── update-order.dto.ts          (Member 2)
│   │   ├── filter-order.dto.ts          (Member 3)
│   │   └── update-order-status.dto.ts   (Member 3)
│   └── entities/
│       └── order.entity.ts       (Member 2)
│
├── zones/                        (Assigned to: Member 4 - Delivery Zones & Rates)
│   ├── zones.module.ts
│   ├── zones.controller.ts       (Admins update rates; Customers query them)
│   ├── zones.service.ts          (Seeds default Inside/Outside Dhaka rates)
│   ├── dto/
│   │   ├── create-zone.dto.ts
│   │   └── update-zone.dto.ts
│   └── entities/
│       └── delivery-zone.entity.ts  (4th Entity: Stores price & weight rules)
│
└── admin/                        (Assigned to: Member 4 - Controls & Stats)
    ├── admin.module.ts
    ├── admin.controller.ts
    ├── admin.service.ts
    └── dto/
        └── verify-rider.dto.ts
```

---

## Individual Assignments & File Details

### Member 1: Database Setup & Authentication (The Architect)

*Your focus is creating the User entities and building the register/login endpoints.*

#### Module: `src/auth/` & `src/users/` (Base Entities)

1. **`src/users/entities/user.entity.ts`**
   - *Role*: Mapped user table (ID, name, email, phone, password, role enum, active status).

2. **`src/users/entities/rider-verification.entity.ts`**
   - *Role*: Mapped NID storage table (ID, NID number, NID image path, status enum, links 1-to-1 to User).

3. **`src/auth/dto/register-customer.dto.ts`**
   - *Role*: Validates inputs for customer sign-up (checks name, phone, valid email, matching passwords).

4. **`src/auth/dto/register-rider.dto.ts`**
   - *Role*: Validates inputs for rider sign-up (includes NID number field).

5. **`src/auth/dto/login.dto.ts`**
   - *Role*: Validates inputs for log in (email or phone, password).

6. **`src/auth/auth.service.ts`**
   - *Role*: Hashes passwords on signup, validates credentials on login, generates JWT tokens.

7. **`src/auth/auth.controller.ts`**
   - *Role*: Exposes `/auth/register-customer`, `/auth/register-rider` (uses Multer to save NID files to local `./uploads` directory), and `/auth/login`.

8. **`src/auth/jwt.strategy.ts`**
   - *Role*: Extracts JWT token from client header, decodes user payload.

9. **`src/auth/jwt-auth.guard.ts`**
   - *Role*: Secures endpoints. Rejects requests that do not have a valid JWT token.

10. **`src/auth/roles.decorator.ts`**
    - *Role*: Utility to label endpoints (e.g. `@roles('admin')`).

11. **`src/auth/roles.guard.ts`**
    - *Role*: Checks if request's user role matches the required roles.

---

### Member 2: Customer Order Management (Customer Lead)

*Your focus is letting customers create orders, edit details before acceptance, calculate fares, and view order history.*

#### Module: `src/orders/` (Customer Features)

1. **`src/orders/entities/order.entity.ts`**
   - *Role*: Mapped order table (Pickup/Drop address & zone, parcel type, weight, fare, delivery type, status enum, customer/rider foreign keys).

2. **`src/orders/dto/create-order.dto.ts`**
   - *Role*: Validates order inputs (pickup_zone, pickup_area, drop_zone, drop_area, parcel_type, weight, delivery_type).

3. **`src/orders/dto/update-order.dto.ts`**
   - *Role*: Validates changes when customer wants to edit weight or addresses.

4. **`src/orders/orders.service.ts`** (Part 1 - Customer Logic)
   - *Role*: Calculates delivery fare by querying the active `DeliveryZone` entity (Member 4's module), saves new orders with `'pending'` status, edits pending orders, cancels orders (within 1 hour if rider accepted, or anytime if still pending).

5. **`src/orders/orders.controller.ts`** (Part 1 - Customer Endpoints)
   - *Role*: Exposes customer routes: `POST /orders/create`, `PATCH /orders/customer/edit/:id`, `DELETE /orders/customer/cancel/:id`, `GET /orders/customer/history`.

---

### Member 3: Rider Order Management (Rider Lead)

*Your focus is letting verified riders search for orders, filter by zone, accept orders, and change delivery status.*

#### Module: `src/orders/` (Rider Features)

1. **`src/orders/dto/filter-order.dto.ts`**
   - *Role*: Validates query filters (e.g., optional `pickupZone`, `dropZone` filters).

2. **`src/orders/dto/update-order-status.dto.ts`**
   - *Role*: Validates updates when rider changes order status (e.g., `'picked_up'`, `'in_transit'`, `'delivered'`).

3. **`src/orders/orders.service.ts`** (Part 2 - Rider Logic)
   - *Role*: Queries orders with status `'pending'` (with zone filtering), handles order acceptance (assigning rider ID, setting status to `'accepted'`, setting `acceptedAt` timestamp), handles status changes.

4. **`src/orders/orders.controller.ts`** (Part 2 - Rider Endpoints)
   - *Role*: Exposes rider routes: `GET /orders/available` (uses query params), `PATCH /orders/accept/:id`, `PATCH /orders/status/:id`.

---

### Member 4: Admin Controls & Delivery Zones (Admin Lead)

*Your focus is creating default admin account seeding, verified status operations, suspends, dashboard statistics, and managing location-based rates.*

#### Module: `src/zones/` (4th Module: Delivery Zones & Pricing Rates)

1. **`src/zones/entities/delivery-zone.entity.ts`**
   - *Role*: The **4th Entity**. Mapped pricing table storing zone names, base regular fares, base express fares, weight limits, and extra weight rates.

2. **`src/zones/dto/create-zone.dto.ts`**
   - *Role*: Validates inputs when creating a zone.

3. **`src/zones/dto/update-zone.dto.ts`**
   - *Role*: Validates adjustments to fares and weight surcharges.

4. **`src/zones/zones.service.ts`**
   - *Role*: Seeds two default zones on startup (`'Inside Dhaka'` and `'Outside Dhaka'`), retrieves lists, updates pricing.

5. **`src/zones/zones.controller.ts`**
   - *Role*: Exposes routes for fetching zones (publicly available to customers) and routes to create/update rates (protected by `@roles('admin')`).

#### Module: `src/admin/` & `src/users/` (Admin & User Profiles)

1. **`src/admin/dto/verify-rider.dto.ts`**
   - *Role*: Validates admin action on rider NID (`status` is either `'approved'` or `'rejected'`).

2. **`src/admin/admin.service.ts`**
   - *Role*: Aggregates counts (total users, total orders by status) and sums completed order fares for revenue stats.

3. **`src/admin/admin.controller.ts`**
   - *Role*: Exposes admin dashboard: `GET /admin/dashboard`, `PATCH /admin/verify-rider/:id` (approves or rejects rider), `PATCH /admin/users/suspend/:id` (suspends users).

4. **`src/users/users.service.ts`**
   - *Role*: Checks and seeds default admin on app bootstrap; handles profile editing, suspending, and deleting.

5. **`src/users/users.controller.ts`**
   - *Role*: Exposes endpoints for users to view/edit their own profile information (`GET /users/profile`, `PATCH /users/profile`).

6. **`src/users/dto/update-user.dto.ts`**
   - *Role*: Validates incoming profile updates (name, phone, password).
