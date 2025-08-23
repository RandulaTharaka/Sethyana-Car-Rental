![Sethyana Logo with title 12](https://github.com/RandulaTharaka/Car-Rental-Management-System/assets/60685092/cd5eb713-acec-4c34-8c5c-05695dd37bd8)
---

[![Repo Size](https://img.shields.io/github/repo-size/RandulaTharaka/Sethyana-Car-Rental)](https://github.com/RandulaTharaka/Sethyana-Car-Rental)
[![Top Language](https://img.shields.io/github/languages/top/RandulaTharaka/Sethyana-Car-Rental)](https://github.com/RandulaTharaka/Sethyana-Car-Rental)
[![Last Commit](https://img.shields.io/github/last-commit/RandulaTharaka/Sethyana-Car-Rental)](https://github.com/RandulaTharaka/Sethyana-Car-Rental)
![License](https://img.shields.io/badge/license-Custom-blue)

# 🚗 Sethyana Car Rental Management System
> A Full-Stack Java Spring Boot Web Application

🌐 Visit Site: [www.sethyana.rental](https://sethyana-car-rental-1047985755351.us-central1.run.app)

![Screens](docs/screenshots/screens.jpg)

## 🚀 Project Overview

This is a Java Spring Boot web application that digitizes car rental operations for Sethyana Rent a Car & Cab Service. Includes secure auth, role‑based access, reservations, payments, reporting, and a mobile‑friendly driver portal.

[//]: # (### ✅ Quick Glance)

[//]: # ()
[//]: # (| Area       | Highlights                                                                                                                            |)

[//]: # (| ---------- |---------------------------------------------------------------------------------------------------------------------------------------|)

[//]: # (| Frontend   | HTML, CSS, Bootstrap, JavaScript, jQuery with responsive UI                                                                           |)

[//]: # (| Backend    | Java 11 / Spring Boot REST controllers, Spring Web Security, Hibernate/JPA, Gradle build, MySQL integration                           |)

[//]: # (| Data Layer | Hibernate/JPA entities and repositories for relational data &#40;Users, Vehicles, Reservations, Drivers, Payments&#41; with MySQL integration |)

## 🎯 Why I Built This

As my final year project for the Bachelor in IT at the University of Colombo, I chose to tackle a complex, real-world problem to deepen my software engineering skills. My goal was to design and implement a robust solution that delivers genuine value and addresses actual business needs.

## 🛠️ Tech Stack

| Layer      | Tools & Technologies                                                                                                                |
| ---------- |-------------------------------------------------------------------------------------------------------------------------------------|
| Frontend   | HTML, CSS, Bootstrap (SASS customized), JavaScript, jQuery, Adobe XD (wireframes & mockups)                                         |                                                                        |
| Backend    | Java, Spring Boot, Spring Security, Hibernate (JPA), REST controllers, Gradle, JavaMailSender (Email service), Twilio (SMS service) |
| Auth       | Spring Security (role-based access), BCrypt password encryption                                                                     |
| Database   | MySQL, Google Cloud SQL Instance                                                                                                    |
| Deployment | Docker, Google Cloud Run, Heroku (containerized deployment, CI/CD ready)                                                            |
| Tooling    | IntelliJ IDEA, MySQL Workbench, Google Cloud Run                                                                                    |
| Other      | Server/client-side validation (regex, annotations)                                                                                  |

## ✨ Core Features

- Secure user authentication & role-based access (manager, receptionist, driver)
- Self-drive & Chauffeur-drive reservation management
- Checkout flow: Time&Location → Package → Vehicle → Driver → Customer → Confirm → Payment
- Vehicle listing, detail view & availability search
- Rental package management 
- Customer management & blacklist checks
- Driver job assignments & ratings
- Payment processing & printable receipts & agreements
- Email and SMS notifications for booking confirmations 
- Driver portal for mobile-friendly job management
- Admin dashboard for fleet, users, and revenue reporting
- Search & filtering with pagination
- Daily & monthly revenue reports
- Notifications for expirations (driving license, insurance, revenue license) 
- Server & client-side form validation (regex, annotations)
- Error handling with custom error pages
- Responsive UI with Bootstrap


## 🎬 Feature Demos

### 🛒 Cart & Checkout

![Checkout Flow](docs/screenshots/checkout_flow.gif)

### 🛠 Admin Panel

![Admin Panel](docs/screenshots/admin_panel.gif)



## 🧩 Architecture Overview
```
 src/
    main/
      java/
        com/
          sethyanacarrental/
            config/         # Spring web security configuration
            controller/     # REST controllers
            model/          # JPA entities (User, Vehicle, etc.)
            repository/     # Data access layer
            service/        # Email & SMS services
            util/           # Helpers & validation
      resources/
        static/             # Frontend assets (HTML, CSS, JS, images)
        application.properties   # Spring Boot app settings (DB, server port, credentials)
    test/
      java/
        com/
          sethyanacarrental/  # Unit & integration tests
  build.gradle                # Build config
  Dockerfile                  # Containerization
  system.properties           # JVM settings
```


## 🧠 Developer Notes

Personal study notes included (React, Redux, architectural reasoning):

📄 [Developer Notes PDF](docs/TechMartX_DeveloperNotes.pdf)

> These are raw learning artifacts, intentionally left to show thought process & growth.



## 🔐 Security & Best Practices

- Passwords hashed with bcrypt.
- JWT stored client‑side; protected routes validate token server‑side.
- Environment variables for secrets & external service keys.
- Data validation at model + route level (extensible).
- Avoids exposing admin-only operations to non‑privileged users.
- MIT licensed (see LICENSE).

---

## ⚙️ Performance Considerations

- RTK Query caching reduces duplicate API calls.
- Pagination limits payload for product lists.
- Lean Mongoose queries where applicable (extendable).
- Image dimensions constrained for consistent layout.

---

## 🚧 Future Enhancements (Roadmap)

| Category      | Planned                                               |
| ------------- | ----------------------------------------------------- |
| UX            | Wishlist / favorites, recently viewed items           |
| Performance   | Image optimization & CDN usage                        |
| Security      | Refresh token rotation, rate limiting                 |
| Admin         | Bulk product import / CSV export                      |
| Testing       | Jest + React Testing Library + Supertest API coverage |
| Observability | Basic request logging & metrics dashboard             |
| Payments      | Stripe alternative integration                        |

---

## 📦 Installation

1. Clone repository

   ```sh
   git clone https://github.com/RandulaTharaka/TechMartX.git
   cd TechMartX
   ```

2. Install root & frontend dependencies

   ```sh
   npm install
   cd frontend && npm install && cd ..
   ```

3. Configure environment  
   Duplicate `.env.example` → `.env` and fill:

   ```
   NODE_ENV=development
   PORT=5000
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   PAYPAL_CLIENT_ID=your_paypal_client_id
   PAYPAL_APP_SECRET=your_paypal_app_secret
   PAYPAL_API_URL=https://api-m.sandbox.paypal.com
   PAGINATION_LIMIT=8
   ```

4. Run development (concurrent)

   ```sh
   npm run dev
   ```

5. Backend only / Frontend only

   ```sh
   npm run server   # backend on :5000
   cd frontend && npm start   # frontend on :3000
   ```

6. Production build
   ```sh
   cd frontend
   npm run build
   ```

---

## 📚 Selected API Endpoints

| Method | Endpoint                | Description                               |
| ------ | ----------------------- | ----------------------------------------- |
| GET    | /api/products           | List products (with pagination & keyword) |
| GET    | /api/products/:id       | Product details                           |
| POST   | /api/users/login        | Authenticate user                         |
| POST   | /api/users              | Register user                             |
| POST   | /api/orders             | Create order                              |
| GET    | /api/orders/:id         | Get order details                         |
| PUT    | /api/orders/:id/pay     | Mark order paid (PayPal)                  |
| PUT    | /api/orders/:id/deliver | Mark delivered (admin)                    |

> Additional endpoints include reviews, admin CRUD, and profile updates.

---

## 🧪 Testing (Planned)

Upcoming:

- Unit tests for utils (price/date formatting)
- API tests with Supertest
- Component tests with React Testing Library
- Integration snapshots for critical flows

---

## 📄 License

Released under the [MIT License](LICENSE).

---

## 🤝 Connect

I’m actively seeking opportunities in full‑stack / frontend engineering.  
Feedback, collaboration, or discussion welcome.

- LinkedIn: (add your profile link)
- Email: (add contact email)

---

### ⭐ If this project interests you, a star on the repo is appreciated!

> Thanks for reviewing TechMartX — built with a focus on clarity, scalability,
