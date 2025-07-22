# 🛡️ COVID-19 India Portal API

A secure RESTful API built with **Node.js**, **Express**, and **SQLite** to manage and track COVID-19 cases across Indian states and districts.

This backend system enables authenticated users to perform CRUD operations on states and districts, ensuring reliable and structured pandemic data management.

---

## 🔍 Project Overview

This project simulates a real-world health monitoring API where user authentication, data security, and structured access to health statistics are critical.

The API performs:

- **Authentication** using JWT and bcrypt
- **CRUD operations** on state and district data
- **Statistical aggregation** of COVID cases for each state

It follows a **modular and REST-compliant architecture**, ideal for integration with dashboards or frontend systems.

---

## 🚀 Features

- ✅ Secure login with hashed passwords
- 🔐 JWT-based authentication middleware
- 📄 RESTful APIs for all state & district operations
- 📊 Aggregated COVID statistics by state
- 🧪 Follows best practices for backend API development

---

## 🛠️ Technologies Used

| Technology   | Purpose                         |
|--------------|----------------------------------|
| Node.js      | Runtime environment              |
| Express.js   | Web framework                    |
| SQLite       | Lightweight relational database  |
| bcrypt       | Password hashing                 |
| JSON Web Token (JWT) | Token-based authentication |
| Postman/ThunderClient | API testing & debugging  |

---

## 🔒 Security & Auth Flow

- Passwords are **hashed using bcrypt**
- JWT is used for **stateless session management**
- All routes (except `/login`) are **protected using middleware**
- Unauthorized access returns `401 Invalid JWT Token`

---

## 🧱 Database Schema

### **State Table**

| Columns    | Type    |
| ---------- | ------- |
| state_id   | INTEGER |
| state_name | TEXT    |
| population | INTEGER |

### **District Table**

| Columns       | Type    |
| ------------- | ------- |
| district_id   | INTEGER |
| district_name | TEXT    |
| state_id      | INTEGER |
| cases         | INTEGER |
| cured         | INTEGER |
| active        | INTEGER |
| deaths        | INTEGER |

---

## 📲 Sample User Credentials

```json
{
  "username": "christopher_phillips",
  "password": "christy@123"
}
```

---

## 🔐 Authentication with Token

**Request header format:**

```
Authorization: Bearer <jwt_token>
```

**Invalid token or no token:**

- Status: `401`
- Response: `"Invalid JWT Token"`

---

## 📡 API Endpoints

### API 1 - Login

- **POST** `/login/`

Request:
```json
{
  "username": "christopher_phillips",
  "password": "christy@123"
}
```

Response (success):
```json
{
  "jwtToken": "eyJhbGciOiJIUzI1NiIsIn..."
}
```

---

### API 2 - Get all States

- **GET** `/states/`

Response:
```json
[
  {
    "stateId": 1,
    "stateName": "Andaman and Nicobar Islands",
    "population": 380581
  },
  ...
]
```

---

### API 3 - Get State by ID

- **GET** `/states/:stateId/`

---

### API 4 - Add District

- **POST** `/districts/`

Request:
```json
{
  "districtName": "Bagalkot",
  "stateId": 3,
  "cases": 2323,
  "cured": 2000,
  "active": 315,
  "deaths": 8
}
```

Response: `District Successfully Added`

---

### API 5 - Get District by ID

- **GET** `/districts/:districtId/`

---

### API 6 - Delete District

- **DELETE** `/districts/:districtId/`

---

### API 7 - Update District

- **PUT** `/districts/:districtId/`

Request:
```json
{
  "districtName": "Nadia",
  "stateId": 3,
  "cases": 9628,
  "cured": 6524,
  "active": 3000,
  "deaths": 104
}
```

Response: `District Details Updated`

---

### API 8 - Get State Statistics

- **GET** `/states/:stateId/stats/`

Response:
```json
{
  "totalCases": 724355,
  "totalCured": 615324,
  "totalActive": 99254,
  "totalDeaths": 9777
}
```

---

## 🧪 How to Run Locally

```bash
git clone https://github.com/Srivardhan005/covidportal.git
cd covidportal
npm install
node app.js
```

---

## 🧩 Real-World Use Case

This project mimics real healthcare backend systems, such as:

- COVID dashboards
- State-wise health management portals
- Admin panels for district-level reporting

---

## 📎 Future Enhancements

- ✅ Add role-based access (Admin vs. User)
- ✅ Deploy using Render or Railway
- ✅ Add Swagger API documentation
- ✅ Write unit tests for route handlers

---

## 🧑‍💻 Author

**Srivardhan**  
[GitHub](https://github.com/Srivardhan005)

---

> ✨ *“A good backend protects data and enforces rules — this project does both.”*
