<p align="center">
  <img src="assets/banner.png" alt="MCA Study Hub Banner" width="100%" />
</p>

# 🎓 MCA Study Hub  
### 🚀 Notes & Previous Year Papers Platform  
**Full-Stack Web Application | React • Django REST • Supabase**

<p align="center">
  <b>
    MCA Study Hub is a modern, secure, and responsive academic platform  
    for MCA students to access notes and previous year question papers easily.
  </b>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Frontend-React%20%2B%20Vite-blue?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Backend-Django%20REST-green?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Auth-JWT-orange?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Storage-Supabase-black?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Deployment-Vercel%20%7C%20Render-success?style=for-the-badge" />
</p>

---

## 🌐 Live Demo

- 🔗 **Frontend:** https://mca-study-hub.vercel.app  
- 🛠 **Backend:** Django REST API (Render)

---

## 📌 About MCA Study Hub

**MCA Study Hub** is a **full-stack academic management system** built for **MCA students**.

It allows students to:
- View subject-wise notes  
- Download previous year question papers  
- Save important study materials  

Admins can:
- Manage academic structure  
- Upload and control PDF notes securely  

This project shows **real-world full-stack development**, **secure authentication**, and **cloud storage integration**.

---

## ✨ Features

### 👨‍🎓 Student Features
- 🔐 Secure login & logout (JWT)
- 📚 Notes organized by **Year → Semester → Subject**
- 🔍 Real-time search
- 📄 View PDFs in browser
- ⬇ Download PDFs
- ⭐ Bookmark notes
- 📊 Download count tracking
- 🌙 Dark mode / ☀ Light mode
- 📱 Fully responsive design

---

### 👨‍💼 Admin Features
- 🔐 Admin-only protected dashboard
- ➕ Upload PDF notes
- 🗂 Manage:
  - MCA Years
  - Semesters
  - Subjects
  - Notes
- ✏ Edit notes
- ❌ Delete notes
- 📊 Auto-increment download count
- ☁ Secure PDF storage using Supabase

---

## 🖼 Screenshots (Demo Images)

> ⚠ Replace these with real screenshots later

### 🔐 Login Page
![Login](https://via.placeholder.com/1200x700?text=Login+Page)

### 📘 Notes Page
![Notes](https://via.placeholder.com/1200x700?text=Notes+Page)

### 🛠 Admin Dashboard
![Admin Dashboard](https://via.placeholder.com/1200x700?text=Admin+Dashboard)

### ⬆ Upload Notes Page
![Upload Notes](https://via.placeholder.com/1200x700?text=Upload+Notes)

---

## 🧱 Tech Stack

### 🎨 Frontend
- React (Vite)
- React Router DOM
- Axios
- Custom CSS
- Dark / Light Theme
- Responsive UI

### 🧠 Backend
- Django
- Django REST Framework
- JWT Authentication
- MySQL (Aiven)
- Role-Based Permissions

### ☁ Storage
- Supabase Storage
- Secure PDF Uploads
- Public File URLs

### 🚀 Deployment
- Frontend → **Vercel**
- Backend → **Render**

---

## 🔐 Security & Authentication

- JWT Access & Refresh Tokens
- Protected Routes
- Admin-only APIs
- Secure Logout
- CORS Enabled

---

## 📂 Project Structure

```text
mca-study-hub/
├── frontend/
│   ├── pages/
│   ├── components/
│   ├── routes/
│   ├── api/
│   ├── utils/
│   └── styles/
│
├── backend/
│   ├── accounts/
│   ├── notes/
│   ├── settings.py
│   └── urls.py
⚙ Environment Variables
Frontend (.env)
env
Copy code
VITE_API_BASE_URL=https://your-backend-url/api
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_key
Backend (.env)
env
Copy code
SECRET_KEY=your_secret_key
DEBUG=False
DATABASE_URL=your_database_url
🚀 Installation & Setup
Frontend
bash
Copy code
npm install
npm run dev
Backend
bash
Copy code
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
📈 Future Enhancements
🔍 Full-text PDF search

📊 Admin analytics dashboard

🧾 PDF preview thumbnails

🔔 Notifications

📱 Progressive Web App (PWA)

🎓 College Project Information
Project Title: MCA Study Hub

Domain: Full-Stack Web Development

Frontend: React

Backend: Django REST Framework

Database: MySQL

Storage: Supabase

Authentication: JWT

💼 Resume-Ready Description
MCA Study Hub | Full-Stack Web Application

Developed a role-based academic notes platform using React and Django REST

Implemented secure JWT authentication

Integrated Supabase cloud storage for PDF handling

Designed a responsive UI with dark and light mode

Deployed frontend on Vercel and backend on Render

🔗 LinkedIn Project Description
🚀 MCA Study Hub – Full Stack Project

A secure academic platform for viewing and downloading notes and previous year question papers.

Tech Stack: React, Django REST, MySQL, Supabase, JWT
🌐 Live Demo: https://mca-study-hub.vercel.app

⭐ Contributing
Contributions are welcome!
Feel free to fork the repository, open issues, or submit pull requests.

📄 License
This project is licensed under the MIT License.

<p align="center"> <b>⭐ If you like this project, don’t forget to star the repository!</b> </p> <p align="center"> Built with ❤️ for MCA students </p> ```
