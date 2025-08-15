# blog-writing-website
# 📝 Blog Writing Website

A full-stack blog writing platform built using **JavaScript**, **Node.js**, and **MySQL** where users can register, log in, and create, edit, or delete blog posts.

---

## 🚀 Features
- User Registration & Login (JWT Authentication)
- Create, Edit, Delete Blog Posts (CRUD Operations)
- Responsive Frontend (HTML, CSS, JavaScript)
- REST API using Node.js & Express.js
- MySQL Database for data storage

---

## 🛠 Tech Stack
- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Node.js, Express.js
- **Database:** MySQL

---

## 📦 Installation & Setup

### 1️⃣ Clone the repository
```bash
git clone https://github.com/SAI-VENKAT-PALLAPU/blog-writing-website.git
cd blog-writing-website

2️⃣ Backend Setup
  cd backend
  npm install

 Configure your .env file:
 DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=blog_db
JWT_SECRET=your_secret_key

Import the database schema:
mysql -u root -p
SOURCE backend/sql/schema.sql;

Start the server:
npm start

3️⃣ Frontend Setup
cd ../frontend
npx live-server

