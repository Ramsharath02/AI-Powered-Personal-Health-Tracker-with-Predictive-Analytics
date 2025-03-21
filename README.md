# 🚀 AI-Powered Personal Health Tracker with Predictive Analytics

This AI-powered personal health tracker provides users with insights into their health through predictive analytics. The application tracks user data, analyzes it, and suggests personalized recommendations based on various health parameters.

---

## 📚 Table of Contents
- [Introduction](#introduction)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Folder Structure](#folder-structure)
- [Getting Started](#getting-started)
- [Run Locally](#run-locally)
- [Environment Variables](#environment-variables)
- [Supabase Integration](#supabase-integration)
- [API Endpoints](#api-endpoints)
- [License](#license)

---

## 🎯 Introduction
The **AI-Powered Personal Health Tracker** is built to help users monitor their health by tracking key metrics such as BMI, activity level, and other vital signs. The system analyzes user data and offers suggestions to improve overall well-being. Users can sign up, log in, and track their progress using an intuitive dashboard.

---

## ✨ Features
✅ User Authentication with Supabase  
✅ Secure Login and Registration  
✅ Track Health Data and Activities  
✅ Predictive Analytics for Health Improvement  
✅ User Profile and Settings Management  
✅ Responsive Design for Mobile and Desktop  

---

## 🛠️ Technologies Used
### Frontend
- ⚡️ **React** - UI Framework  
- ⚡️ **Vite** - Build Tool  
- 🎨 **Tailwind CSS** - Styling and Responsiveness  
- 🔥 **TypeScript** - Static Typing  

### Backend
- 🛢️ **Supabase** - Backend as a Service (PostgreSQL)  
- 🔐 **Supabase Authentication** - User Authentication and Security  
- 📊 **PostgreSQL** - Database Management  

---

## 📁 Folder Structure

📦 AI-Powered-Personal-Health-Tracker-with-Predictive-Analytics ├── 📁 node_modules ├── 📁 public │ ├── 📄 favicon.ico │ ├── 📄 logo.webp │ 
└── 📄 index.html ├── 📁 src │ ├── 📁 assets │ ├── 📁 components │ ├── 📁 pages │ ├── 📁 styles │ ├── 📄 App.tsx │ 
├── 📄 main.tsx │ └── 📄 index.css ├── 📄 .gitignore ├── 📄 package.json ├── 📄 tsconfig.json ├── 📄 vite.config.ts 
├── 📄 tailwind.config.js └── 📄 postcss.config.js


---

## 🏗️ Getting Started
To run the application locally, follow these steps:

---

### 📥 Clone the Repository
```bash
git clone https://github.com/Ramsharath02/AI-Powered-Personal-Health-Tracker-with-Predictive-Analytics.git


 

```
---
## 📦 Install Dependencies

### Navigate to the project directory:
```bash
cd AI-Powered-Personal-Health-Tracker-with-Predictive-Analytics
```

### Install all dependencies:
```bash
npm install
   OR
yarn install
```
---

## ⚡ Run the Application
```bash
npm run dev
 OR
yarn dev
```

The app will run on http://localhost:5173/.

## 🔐 Environment Variables
Create a .env file in the root directory and configure the following:
```bash
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

```

## 🛢️ Supabase Integration
This project uses Supabase for backend and authentication.

### ✅ Setup Supabase
- Go to Supabase and create an account.
- Create a new project.
- Get your API URL and Anon Key from the Supabase project settings.
- Add these credentials to your .env file.

## 🎯 API Endpoints
### User Authentication
- POST /auth/signin - Sign in user
- POST /auth/signup - Register user
- POST /auth/logout - Logout user
### Health Data Management
- GET /health-data - Retrieve user health data
- POST /health-data - Add health data
- PUT /health-data/:id - Update health data
- DELETE /health-data/:id - Delete health data

## MIT License

Copyright (c) [2025] [Ramsharath.S]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

