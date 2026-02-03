<p align="center">
  <img src="assets/banner.png" alt="MCA Study Hub Banner" />
</p>

# 🎓 MCA Study Hub  
### 🚀 Notes & Previous Year Papers Platform  
**Full-Stack Web Application | React • Django REST • Supabase**

<p align="center">
  <b>
    A modern, secure, and responsive academic platform for MCA students to view,
    download, and manage study materials with ease.
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

**MCA Study Hub** is a **full-stack academic management system** designed for **MCA students** to easily access:

- 📘 Subject-wise notes  
- 📄 Previous year question papers (PDF)  
- ⭐ Saved / bookmarked study materials  

Admins can securely manage academic structure and upload PDFs through a dedicated admin dashboard.

This project demonstrates **real-world full-stack development**, **secure authentication**, and **cloud-based file storage**.

---

## ✨ Features

### 👨‍🎓 Student / User Features
- 🔐 Secure JWT login & logout  
- 📚 Notes organized by **Year → Semester → Subject**  
- 🔍 Real-time search  
- 📄 View PDFs directly in browser  
- ⬇ Download PDFs  
- ⭐ Bookmark important notes  
- 📊 Automatic download count tracking  
- 🌙 Dark / ☀ Light mode  
- 📱 Fully responsive (mobile & desktop)  

---

### 👨‍💼 Admin Features
- 🔐 Admin-only protected routes  
- ➕ Upload PDF notes  
- 🗂 Manage:
  - MCA Years  
  - Semesters  
  - Subjects  
  - Notes  
- ✏ Edit / ❌ Delete notes  
- 📊 Auto-increment download counter  
- ☁ Secure PDF storage using **Supabase**

---

## 🖼 Screenshots

> 📸 Replace these with your real screenshots (recommended)

### 🔐 Authentication
![Login](screenshots/login.png)

### 📘 Notes Page
![Notes](screenshots/notes.png)

### 🛠 Admin Dashboard
![Admin Dashboard](screenshots/admin-dashboard.png)

### ⬆ Upload Notes
![Upload Notes](screenshots/upload-notes.png)

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
- Role-based permissions

### ☁ Storage
- Supabase Storage
- Public PDF URLs
- Secure uploads

### 🚀 Deployment
- Frontend → **Vercel**
- Backend → **Render**

---

## 🔐 Security & Authentication

- JWT Access & Refresh Tokens  
- Protected Routes  
- Admin-only APIs  
- Secure Logout (no redirect loops)  
- CORS enabled  

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
DATABASE_URL=...
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

Developed a role-based academic notes platform using React & Django REST

Implemented secure JWT authentication

Integrated Supabase cloud storage for PDF handling

Designed a responsive UI with dark/light mode

Deployed on Vercel & Render

🔗 LinkedIn Project Description
🚀 MCA Study Hub – Full Stack Project

A secure academic platform for viewing and downloading notes & previous year question papers.

Tech Stack: React, Django REST, MySQL, Supabase, JWT
🌐 Live Demo: https://mca-study-hub.vercel.app

⭐ Contributing
Contributions are welcome!
Feel free to fork, open issues, or submit pull requests.

📄 License
This project is licensed under the MIT License.

<p align="center"> <b>⭐ If you like this project, don’t forget to star the repository!</b> </p> <p align="center"> Built with ❤️ for MCA students </p> ```