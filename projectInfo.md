# Comprehensive Project Documentation: Easy Shop and Customer Service

A professional-grade, high-performance e-commerce ecosystem designed for premium brands. This document provides a deep dive into the technical architecture, technology stack, and exhaustive API landscape.

## 🛠️ Complete Technology Stack

### Frontend Architecture (React 19 + TypeScript)
- **Core Library**: [React 19.0.0](https://reactjs.org/) (Utilizing modern hooks and concurrent rendering).
- **Type Safety**: [TypeScript 5.8](https://www.typescriptlang.org/) for robust compile-time checking.
- **Bundling**: [Vite 6.2](https://vitejs.dev/) for ultra-fast HMR and optimized production builds.
- **Routing**: [React Router 7](https://reactrouter.com/) for hybrid SPA/SSR navigation.
- **Data Fetching**: [Axios](https://axios-http.com/) with interceptors for global error handling and token management.
- **UI & Animations**:
  - [Tailwind CSS](https://tailwindcss.com/) for utility-first responsive design.
  - [Lucide React](https://lucide.dev/) for a consistent, premium icon sets.
  - [React Hot Toast](https://react-hot-toast.com/) for real-time interaction feedback.
- **Payment Suite**: [Stripe React SDK](https://stripe.com/docs/stripe-js/react) for secure, PCI-compliant checkouts.

### Backend Infrastructure (Node.js + Express)
- **Runtime**: [Node.js](https://nodejs.org/) utilizing an Express.js framework.
- **Data Persistence**: [MongoDB](https://www.mongodb.com/) (NoSQL) managed via the [Mongoose 9.1](https://mongoosejs.com/) ODM.
- **Security & Middleware**:
  - [JWT](https://jwt.io/) for cross-domain stateless authentication.
  - [Helmet.js](https://helmetjs.github.io/) for hardened HTTP headers.
  - [Cors](https://www.npmjs.com/package/cors) configured for secure cross-origin resource sharing.
  - [Express Rate Limit](https://www.npmjs.com/package/express-rate-limit) for API protection.
  - [Multer](https://github.com/expressjs/multer) for multi-part file processing.
- **Cloud Assets**: [Cloudinary](https://cloudinary.com/) for dynamic image transformation and storage.
- **Mailing**: [Nodemailer](https://nodemailer.com/) for transactional/automated SMTP communication.

---

## 📡 Exhaustive API Index (54 Endpoints)

### 👤 Authentication & Identity (7)
- `POST /api/auth/register`: Initialize new patron account.
- `POST /api/auth/login`: Authenticate and issue secure access tokens.
- `POST /api/auth/logout`: Terminate session and clear state.
- `POST /api/auth/refresh-token`: Renew identity tokens.
- `POST /api/auth/forgot-password`: Initiate recovery protocol.
- `POST /api/auth/reset-password`: Update credentials via recovery.
- `POST /api/auth/verify-email`: Validate account authenticity.

### 🍱 Product Catalog & Discovery (9)
- `GET /api/products/`: Global search and browse with advanced filtering.
- `GET /api/products/:id`: Fetch single artifact (Supports human-readable **Slugs** or IDs).
- `GET /api/products/categories`: Fetch complete hierarchical category index.
- `POST /api/products/`: [Admin] Catalog entry creation (Multipart).
- `PUT /api/products/:id`: [Admin] Artifact refinement and asset updates.
- `DELETE /api/products/:id`: [Admin] Permanent removal from catalog.
- `POST /api/products/categories`: [Admin] Append new category to hierarchy.
- `PUT /api/products/categories/:id`: [Admin] Modify category traits.
- `DELETE /api/products/categories/:id`: [Admin] De-list category.

### 📝 User Management (8)
- `GET /api/users/profile`: Private profile data access.
- `PUT /api/users/profile`: Update personal identifiers and avatars.
- `GET /api/users/addresses`: List registered acquisition coordinates.
- `POST /api/users/address`: Register new shipping destination.
- `PUT /api/users/address/:id`: Modify existing coordinates.
- `DELETE /api/users/address/:id`: Remove destination from ledger.
- `PUT /api/users/change-password`: Credential rotation.
- `GET /api/users/`: [Admin] Master user directory.

### 🛒 Cart & Logistics (13)
- `GET /api/cart/`: Fetch current user's active inventory.
- `POST /api/cart/add`: Stage artifact for acquisition.
- `PUT /api/cart/:itemId`: Quantization adjustments.
- `DELETE /api/cart/:itemId`: Remove staged artifact.
- `POST /api/orders/`: Finalize acquisition and create order.
- `GET /api/orders/my-orders`: List user's order history.
- `GET /api/orders/:id`: Detail view of specific logistics track.
- `POST /api/orders/track`: Public visibility for anonymous tracking.
- `PUT /api/orders/:id/pay`: Mark transaction as settled.
- `PUT /api/orders/:id/cancel`: Terminate acquisition flow.
- `GET /api/orders/`: [Admin] Master logistics ledger.
- `PUT /api/orders/:id/deliver`: [Admin] Confirm artifact handover.
- `PUT /api/orders/:id/status`: [Admin] Manual status modulation.

### 💳 Financials & Payments (7)
- `POST /api/payment/create-intent`: Initialize Stripe payment handshake.
- `POST /api/payment/confirm`: Verify payment settlement.
- `POST /api/payment/create-paypal-order`: Initialize PayPal order creation.
- `POST /api/payment/capture-paypal-order`: Capture PayPal payment and finalize order.
- `GET /api/payment/settings`: [Admin] Fetch master gateway configuration.
- `POST /api/payment/settings`: [Admin] Update gateway traits and credentials.
- `POST /api/payment/refund`: [Admin] Process financial return (Stripe/PayPal).

### 💬 Social Feedback (5)
- `GET /api/reviews/product/:productId`: Public feedback stream for an artifact.
- `POST /api/reviews/`: Submit new user-verified review (with photo assets).
- `PUT /api/reviews/:id`: Refinement of existing feedback.
- `DELETE /api/reviews/:id`: Remove feedback from stream.
- `GET /api/reviews/`: [Admin] Global moderation center.

### 📣 Marketing & Banners (5)
- `GET /api/ads/active`: Fetch public-facing active campaigns.
- `GET /api/ads/`: [Admin] Campaign dashboard.
- `POST /api/ads/`: [Admin] Deploy new marketing transmission.
- `PUT /api/ads/:id`: [Admin] Adjust campaign parameters.
- `DELETE /api/ads/:id`: [Admin] Terminate active campaign.

### ⚙️ Content & Analytics (3)
- `GET /api/content/:identifier`: Fetch dynamic CMS content (Home, SEO metadata).
- `PUT /api/content/:identifier`: [Admin] Update site aesthetics and global settings.
- `GET /api/admin/stats`: [Admin] Executive summary of platform metrics.

---

## 📈 Platform Metrics
- **Total API Routes Managed**: 54
- **Security Layers**: 4 (Rate-limiting, Helmet, Input validation, Protected authorization)
- **External Integrations**: Stripe (Fintech), Cloudinary (Cloud Media), GMail (Communication)
