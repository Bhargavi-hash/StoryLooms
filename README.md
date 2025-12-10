# 📚 StoryLooms

A collaborative fiction platform where imagination takes the driver’s seat.

StoryLooms is a full-stack web application that lets users craft, collect, and share stories. It blends clean UI, seamless authentication, and a flexible content model into a platform designed for creative exploration.

## ✨ Features

### 📝 User-Centric Story Experience

* Create and publish stories
* Edit and manage your personal story library
* Collect stories in Library to revisit later
* Like your favorite stories
* Review a story to help others decide whether they want to go with the book or not.
* Commenting feature on chapters.

### 🔐 Authentication & Access Control

* Secure user registration and login
* JWT-based authentication (backend)
* Protected routes in frontend

### 💫 Smooth & Responsive UI

* Built with React + Tailwind
* SPA routing with React Router
* Deployed on **Vercel** with clean URL rewrites

### ⚙️ API-Driven Backend

* Node.js + Express-based REST API
* MongoDB for persistent data storage
* Secure CRUD operations for stories and users

## 🏗️ Tech Stack
#### Frontend
* React
* Vite
* React Router
* TailwindCSS
* Axios
* Deployment → Hosted on Vercel
* Uses vercel.json rewrites for SPA routing
* Automatically picks up build from dist/

#### Backend
* Node.js
* Express
* MongoDB (Mongoose)
* Deployment → Hosted on Render
* Auto-deploys from main branch
* API exposed publicly for frontend

## 🚀 Deployment URLs

**Frontend (Vercel):**
(https://story-looms.vercel.app/)[https://story-looms.vercel.app/]

**Backend (Render):**
[https://storylooms.onrender.com/](https://storylooms.onrender.com/)
Since I am using the Free Tier on Render, the backend will cold start everytime you open it. So please be patient till the application loads completely.

## 📂 Project Structure
```
StoryLooms/
│
├── api/                # Backend source (Express)
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   ├── config/
│   └── index.js
│
├── web/                # Frontend source (React + Vite)
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── config.js   # API_BASE URL lives here
│   ├── public/
│   ├── index.html
│   ├── vite.config.js
│   └── vercel.json     # Route rewrite config
│
└── README.md
```

## 🔧 Local Development Setup
1. Clone the repo

`git clone https://github.com/Bhargavi-hash/StoryLooms.git`

2. Backend Setup (Render-style local run)
```
cd api
npm install
npm start
```

Make sure you have a .env with it if you are trying to setup your own backend and DB:
```
MONGO_URI=your-mongo-uri
JWT_SECRET=your-secret
PORT=5000
```

Backend will run at:
`http://localhost:4000`

3. Frontend Setup
```
cd web
npm install
npm run dev
```

Frontend will run at:
`http://localhost:5173`

Ensure src/config.js contains:

`export const API_BASE = "http://localhost:4000";`
Note: The above is only when you are running it locally. If you are using it in production, the API_BASE should be set to your render link of your repo, i.e., https://<your-repo-name>.onrender.com.

## 🌐 Production Config
### Frontend (Vercel)

* Uses BrowserRouter

* Needs vercel.json:
```
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ]
}
```
### Backend (Render)

* Standard Node web service (Login to Render using Github and select New web service)

* Auto-deploy from GitHub

"Build Command": npm install

"Start Command": npm start

## 🧩 Challenges Faced
1. GitHub Pages Routing (404 Issues)

React Router does not play nicely with GitHub Pages.
Solution: Replaced BrowserRouter with HashRouter — but ultimately moved off GH Pages to Vercel for cleaner routing.

2. Vercel 404s on Direct Routes

SPA paths like /login were failing since Vercel expected real files.
Solution: Added vercel.json rewrites to send all routes to index.html.

3. API_BASE not defined

React couldn’t find backend URL.
Solution: Introduced a dedicated config.js and imported everywhere needed.

4. Mixed Deployment Architecture

Frontend on Vercel + Backend on Render required careful CORS & endpoint management.

## 🌱 Future Enhancements

✨ Richer editor (Markdown or WYSIWYG)

🤝 Collaborative story writing

💬 Comments & community interactions

🔍 Advanced search and filtering

📖 Story recommendations powered by ML

🪄 AI-assisted writing tools

🌙 Dark mode

## 💖 Acknowledgements

Built with patience, caffeine, and the unshakeable belief that stories deserve beautiful homes.

## About Author

Hii guys. I am **Bhargavi**, a Masters student at University of California, Santa Barbara. I am an avid reader of novels and always wanted to build a digital publishing platform like wattpad. This is a small project inspired from it.

This project is not completely done and I will keep revising it based on my ideas and user feedback from other writing sites. But please feel free to fork and clone the repo as a base of your project. 

If you have any creative ideas for this project, feel free to reach out to me at bhargavi_kurukunda@ucsb.edu.
