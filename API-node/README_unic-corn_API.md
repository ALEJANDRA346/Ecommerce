# Unic-corn API — E‑commerce (Servicios & Productos Digitales)

API REST construida con **Express + MongoDB/Mongoose** para vender servicios y productos digitales. Soporta navegación pública, compra autenticada y gestión con rol **admin**. Incluye JWT, validaciones, paginación y semillado (seed) de datos.

---

## 🚀 Quickstart

### 1) Requisitos
- Node.js 18+ (recomendado 20+)
- MongoDB en local o en Atlas
- `npm i` para instalar dependencias

### 2) Variables de entorno (`.env`)
```env
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017
MONGODB_DB=ecommerce-db
JWT_SECRET=supersecret_unic_corn
JWT_EXPIRES_IN=1h
```

> Ajusta `MONGODB_URI` y `MONGODB_DB` según tu entorno.

### 3) Ejecutar en local
```bash
npm start         # o node server.js
# opcional en desarrollo:
npm run dev       # si tienes nodemon configurado
```

### 4) Datos de prueba (seed)
```bash
# Usuarios (10, incluye 1 admin) – password de todos: Passw0rd!
node scripts/seedUsers.js

# Categorías (10) + Productos (30)
node scripts/seedProducts.js
```

**Cuentas de prueba:**
- Admin → `admin1@demo.com` / `Passw0rd!`
- Usuario → p. ej. `alice@demo.com` / `Passw0rd!`

---

## 🧱 Arquitectura (capas)

```
unic-corn-api/
├── scripts/
│ ├── seedProducts.js
│ └── seedUsers.js
├── src/
│ ├── config/
│ │ └── database.js
│ ├── models/
│ │ ├── cart.js
│ │ ├── category.js
│ │ ├── notification.js
│ │ ├── order.js
│ │ ├── paymentMethod.js
│ │ ├── product.js
│ │ ├── review.js
│ │ ├── shippingAddress.js
│ │ ├── user.js
│ │ └── wishList.js
│ ├── middlewares/
│ │ ├── authMiddleware.js
│ │ ├── errorHandler.js
│ │ ├── globalErrorHandler.js
│ │ ├── isAdminMiddleware.js
│ │ ├── logger.js
│ │ └── validation.js
│ ├── controllers/
│ │ ├── authController.js
│ │ ├── cartController.js
│ │ ├── categoryController.js
│ │ ├── notificationController.js
│ │ ├── orderController.js
│ │ ├── paymentMethodController.js
│ │ ├── productController.js
│ │ ├── reviewController.js
│ │ ├── shippingAddressController.js
│ │ ├── userController.js
│ │ └── wishListController.js 
│ ├── routes/
│ │ ├── authRoutes.js
│ │ ├── cartRoutes.js 
│ │ ├── categoryRoutes.js
│ │ ├── notificationRoutes.js 
│ │ ├── orderRoutes.js
│ │ ├── paymentMethodRoutes.js
│ │ ├── productRoutes.js
│ │ ├── reviewRoutes.js
│ │ ├── shippingAddressRoutes.js
│ │ └── index.js
│ │ └── userRoutes.js
│ │ └── wishListRoutes.js
├── .env
├── package.json
├── README_unic-corn_API.md
└── server.js


```

---

## 🔐 Seguridad
- **JWT** en `Authorization: Bearer <token>`
- **Roles**: `guest` (implícito sin token), `customer`, `admin`
- **Validaciones** con `express-validator`
- **Errores centralizados** en `middlewares/errorHandler.js` + logs

---

## 🔗 Endpoints (resumen)

> Prefijo base: `http://localhost:3000`

### Auth
- `POST /api/auth/register` — Registro
- `POST /api/auth/login` — Login (devuelve **token**)

### Público (sin token)
- `GET /api/categories`
- `GET /api/categories/:id`
- `GET /api/products?limit=&page=`
- `GET /api/products/:id`
- `GET /api/products/category/:idCategory`
- `GET /api/products/search?q=&sort=&order=`

### Users (cliente con token)
- `GET /api/users/profile`
- `PUT /api/users/profile`
- `PUT /api/users/change-password`

### Addresses (cliente)
- `POST /api/addresses`
- `GET /api/addresses`
- `GET /api/addresses/default`
- `GET /api/addresses/:addressId`
- `PUT /api/addresses/:addressId`
- `PATCH /api/addresses/:addressId/default`
- `DELETE /api/addresses/:addressId`

### Payment Methods (cliente)
- `POST /api/payment-methods`
- `GET /api/payment-methods/user/:userId`
- `GET /api/payment-methods/default/:userId`
- `PATCH /api/payment-methods/:id/set-default`
- `PATCH /api/payment-methods/:id/deactivate`
- `PUT /api/payment-methods/:id`
- `DELETE /api/payment-methods/:id`

### Cart (cliente)
- `POST /api/cart/add-product`
- `GET /api/cart/user/:id`

### Orders
- **Cliente**: `POST /api/orders`, `GET /api/orders/user/:userId`
- **Admin**: `GET /api/orders`, `PATCH /api/orders/:id/status`, `PATCH /api/orders/:id/payment-status`

### Reviews (cliente)
- `POST /api/reviews`
- `GET /api/reviews/product/:productId`
- `GET /api/reviews/my-reviews`
- `PUT /api/reviews/:reviewId`
- `DELETE /api/reviews/:reviewId`

### Wishlist (cliente)
- `GET /api/wishlist`
- `POST /api/wishlist/add`
- `GET /api/wishlist/check/:productId`
- `POST /api/wishlist/move-to-cart`
- `DELETE /api/wishlist/remove/:productId`
- `DELETE /api/wishlist/clear`

### Admin (con token admin)
- `GET /api/users?page=&limit=&role=&isActive=`
- `GET /api/users/:userId`
- `PUT /api/users/:userId`
- `PATCH /api/users/:userId/toggle-status`
- `DELETE /api/users/:userId`
- CRUD de categorías y productos: `POST/PUT/DELETE /api/categories` y `/api/products`

---

## 🧪 Postman (colección sugerida)

Estructura propuesta de carpetas:
```
Unic-corn_API/
├── 0-Auth
│   ├── POST Iniciar sesión (User)
│   └── POST Iniciar sesión (Admin)
├── 1-Público (No Auth)
│   ├── GET /api/categories
│   ├── GET /api/categories/:id
│   ├── GET /api/products?limit=...
│   └── GET /api/products/:id
├── 2-Cliente (Bearer {{token_user}})
│   ├── Users:    GET/PUT profile, PUT change-password
│   ├── Address:  POST/GET/PUT/PATCH/DELETE
│   ├── Payments: POST/GET/PATCH/PUT/DELETE
│   ├── Cart:     POST add-product, GET /cart/user/{{userId_user}}
│   ├── Orders:   POST /orders, GET /orders/user/{{userId_user}}
│   ├── Reviews:  POST /reviews, GET /reviews/product/{{productId}}
│   └── Wishlist: POST/GET/DELETE /wishlist...
└── 3-Admin (Bearer {{token_admin}})
    ├── Orders: PATCH estado/pago
    ├── Products: POST/PUT/DELETE
    ├── Categories: POST/PUT/DELETE
    └── Users: GET paginado, GET/PUT/DELETE by id
```

### Variables de *Environment* recomendadas
```
baseUrl=http://localhost:3000
token_user=      # se llena en Tests del login user
token_admin=     # se llena en Tests del login admin
userId_user=     # se llena al consultar profile
userId_admin=    # opcional
categoryId=
productId=
productPrice=
addressId=
paymentMethodId=
cartId=
orderId=
reviewId=
```

### ¿Por qué usar “Tests” en Postman?
Cada request puede guardar automáticamente en el Environment el token o IDs que necesiten los siguientes pasos, para evitar copias manuales. Ejemplo de Test para guardar token:
```js
pm.test("200 OK", () => pm.response.to.have.status(200));
const j = pm.response.json();
if (j?.token) pm.environment.set("token_user", j.token);
```

---

## 📦 Paginación y filtros (ejemplos)
- `GET /api/products?limit=12&page=2`
- `GET /api/users?page=1&limit=20&role=customer&isActive=true`

---

## 🧰 Troubleshooting
- **401/403**: revisa el header `Authorization: Bearer <token>` y que el token no haya expirado. Haz login otra vez.
- **500**: revisa logs en `logs/error.log`. Verifica `.env`, conexión a Mongo y que los IDs existan.
- **Semillas no insertan**: ejecuta `seedUsers.js` y `seedProducts.js` con la misma DB que usa el servidor.

---


## 📄 Licencia
Uso académico/educativo.
