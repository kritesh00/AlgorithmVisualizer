<div align="center">
<img  src="https://user-images.githubusercontent.com/74038190/226190894-18e959ba-d458-4a94-ac44-790190f2a947.gif" width="400">
</div>

# 🎯 Algorithm Visualizer

An interactive web application for visualizing algorithms in real-time. Built with a modern tech stack featuring React on the frontend and Django on the backend.

![GitHub Pages](https://img.shields.io/badge/deployed-GitHub%20Pages-blue)
![React](https://img.shields.io/badge/React-19.1.0-61DAFB?logo=react)
![Django](https://img.shields.io/badge/Django-5.2.4-092E20?logo=django)
![Vite](https://img.shields.io/badge/Vite-7.0.4-646CFF?logo=vite)

## 🌐 Live Demo

Visit the live application: [https://kritesh00.github.io/AlgorithmVisualizer](https://kritesh00.github.io/AlgorithmVisualizer)

## ✨ Features

- 🎨 **Interactive Visualizations** - Watch algorithms execute step-by-step
- 🌙 **Dark Mode Support** - Toggle between light and dark themes
- 📱 **Responsive Design** - Works seamlessly across all devices
- ⚡ **Real-time Updates** - See algorithm execution in real-time
- 🎭 **Smooth Animations** - Powered by Framer Motion for fluid transitions

## 🛠️ Tech Stack

### Frontend
- **React 19.1.0** - Modern UI library
- **Vite 7.0.4** - Lightning-fast build tool
- **Tailwind CSS 4.1** - Utility-first CSS framework
- **Framer Motion 12.23** - Animation library
- **Axios** - HTTP client for API calls

### Backend
- **Django 5.2.4** - High-level Python web framework
- **Django REST Framework 3.16** - Powerful toolkit for building APIs
- **Django CORS Headers** - Cross-origin resource sharing support
- **Gunicorn** - Production WSGI server
- **WhiteNoise** - Static file serving

## 📋 Prerequisites

- **Node.js** (v16 or higher)
- **Python** (v3.8 or higher)
- **npm** or **yarn**
- **pip** (Python package manager)

## 🚀 Getting Started

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Run migrations:
```bash
python manage.py migrate
```

5. Start the development server:
```bash
python manage.py runserver
```

The backend API will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

## 📦 Building for Production

### Frontend

```bash
cd frontend
npm run build
```

The optimized production build will be in the `frontend/dist` directory.

### Backend

Use the provided build script:
```bash
cd backend
chmod +x build.sh
./build.sh
```

## 🌍 Deployment

### GitHub Pages (Frontend)

The frontend is automatically deployed to GitHub Pages:

```bash
cd frontend
npm run deploy
```

### Backend Deployment

The backend is configured for deployment with:
- **Gunicorn** as the WSGI server
- **WhiteNoise** for serving static files
- Django's production settings

## 📁 Project Structure

```
AlgorithmVisualizer/
├── frontend/                # React frontend
│   ├── src/                # Source files
│   ├── public/             # Static assets
│   ├── index.html          # Entry HTML file
│   ├── vite.config.js      # Vite configuration
│   ├── tailwind.config.js  # Tailwind CSS configuration
│   └── package.json        # Frontend dependencies
│
├── backend/                # Django backend
│   ├── manage.py          # Django management script
│   ├── requirements.txt   # Python dependencies
│   └── build.sh          # Production build script
│
└── README.md             # Project documentation
```

## 🎨 Available Scripts

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run deploy` - Deploy to GitHub Pages

### Backend
- `python manage.py runserver` - Start development server
- `python manage.py migrate` - Run database migrations
- `python manage.py collectstatic` - Collect static files



## 👤 Author

**Kritesh** - [@kritesh00](https://github.com/kritesh00)

