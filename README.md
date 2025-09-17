# Sathi.care - Your Companion for Mental Wellness

<div align="center">
  <img src="https://res.cloudinary.com/dtvvcfh1e/image/upload/v1758110133/logo_dzmd8l.png" alt="Sathi.care Logo" width="150"/>
</div>

<p align="center">
  <strong>A feature-rich, production-quality, full-stack MERN application for accessible mental healthcare, architected for scalability and a seamless user experience.</strong>
</p>

---

## 🚀 The Vision

Sathi.care (from "Sathi," Hindi for companion) is a comprehensive web platform I designed and built to destigmatize mental health and make professional support more accessible. This is not just a simple CRUD app; it is a standout portfolio project architected to solve a real-world problem with professional-grade features, security, and a modern, real-time technology stack.

The platform serves multiple user roles—standard users, mental health professionals, institutions (like schools or companies), and administrators—each with a dedicated, secure portal and a tailored set of features.

## ✨ Core Features

Sathi.care is built with a multi-role architecture to serve a diverse set of users.

### For Users:

- **Secure Authentication**: Standard email/password registration with bcryptjs hashing and Google OAuth 2.0 via Passport.js
- **Personalized Onboarding**: A "Well-being Check-in" that provides personalized professional recommendations using a scoring algorithm
- **Professional Directory**: A filterable, searchable directory of verified therapists and psychiatrists
- **End-to-End Booking System**: A complete booking flow featuring a calendar UI with real-time slot availability
- **Payment Integration**: Secure payment processing handled by the Razorpay API
- **Video Conferencing**: Automatically generated, unique Jitsi video room links for every confirmed appointment
- **Mood Tracking**: A personal dashboard with a Chart.js graph to visualize mood entries over time
- **AI Companion**: An empathetic AI chat companion, powered by the Google Gemini API, for users to express their feelings in a safe space
- **Real-Time Community Forum**: A forum built with Socket.IO for real-time updates, featuring an "post anonymously" option
- **Resource Library**: A curated, filterable library of PDF resources managed by admins

### For Professionals, Institutions & Admins:

- **Dedicated Role-Based Onboarding**: Separate registration flows for Professionals, Institutions, and Admins
- **Role-Protected Dashboards**: Secure dashboards for professionals to manage their profiles and schedules, for institutions to manage outreach, and for admins to vet and verify professionals

## 🏛️ Architectural Highlights & Design Decisions

This project was built with a focus on professional, scalable, and secure architectural patterns, demonstrating a deep understanding of full-stack development and system design tradeoffs.

### 1. Transactional User Onboarding

**Problem**: A standard "register then redirect" flow for new users creates a race condition, where the questionnaire page might load before the user's authentication token is fully available in the frontend state, leading to API errors.

**Solution**: I implemented a single, transactional backend endpoint (`/api/users/register-and-submit`). The frontend was re-architected into a multi-step component that gathers both registration details and questionnaire answers, sending them in one atomic API call.

**Tradeoff**: This increases the initial complexity of the UserRegisterPage component but provides a vastly more robust and error-free onboarding experience by completely eliminating the race condition.

### 2. Decoupled, Real-Time Forum with Socket.IO

**Problem**: A traditional forum would require users to constantly refresh the page to see new posts or comments.

**Solution**: The application server is a hybrid, handling both standard REST API calls and persistent WebSocket connections via Socket.IO. When a new post or comment is created, the controller logic saves it to the database and then immediately broadcasts the new data to all connected clients.

**Tradeoff**: While more complex than simple REST endpoints, this event-driven architecture provides a superior, real-time user experience and is far more efficient than client-side polling.

### 3. Secure by Design: Backend-Driven Anonymity & Moderation

**Problem**: Features like anonymity and content moderation must be secure and impossible for a malicious user to bypass on the client-side.

**Solution**: These features are handled entirely on the backend as the single source of truth.

- **Anonymity**: The `isAnonymous` flag is saved to the database. When data is fetched, the backend controller checks this flag and overwrites the user's real name with "Anonymous" before sending the data to the frontend.
- **Content Moderation**: New posts and comments are passed to a `moderationService` on the backend that uses a profanity-filtering library. Content that is flagged is saved to the database but is automatically filtered out from all public-facing API responses.

### 4. "Smart" Role-Based Data Fetching

**Problem**: The ProfessionalDirectoryPage needs to serve two different roles with different data requirements.

**Solution**: The page is a "smart" component. It checks the logged-in user's role. If the role is `institution`, it automatically adds a filter to the `getAllProfessionals` API call to fetch only professionals who accept outreach. For standard users, it checks for a `latestSubmissionId` to determine whether to call the `matchProfessionals` API for a personalized list or the standard directory. This keeps the UI component clean while centralizing the data-fetching logic.

## 🛠️ Tech Stack

- **Backend**: Node.js, Express, TypeScript, MongoDB Atlas, Mongoose
- **Frontend**: React, TypeScript, Vite, Tailwind CSS
- **Authentication**: JWT, Google OAuth 2.0, Passport.js, bcryptjs
- **Real-Time**: Socket.IO
- **Payments**: Razorpay
- **AI**: Google Gemini API
- **File Storage**: Cloudinary
- **DevOps**: Docker, GitHub Actions (CI/CD)

## 🚀 Getting Started

### Prerequisites

- Node.js (v18.x or higher)
- npm
- MongoDB Atlas account
- Google Cloud Platform account (for OAuth and Gemini API)
- Cloudinary account
- Razorpay account

### Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Siyavar01/sathi-care.git
   cd sathi-care
   ```

2. **Backend Setup:**
   ```bash
   cd server
   npm install
   ```
   - Create a `.env` file in the `server` directory and add all necessary keys (MONGO_URI, JWT_SECRET, Google OAuth, Cloudinary, Razorpay, Gemini)

3. **Frontend Setup:**
   ```bash
   cd ../client
   npm install
   ```
   - Create a `.env` file in the `client` directory and add `VITE_RAZORPAY_KEY_ID` and `VITE_API_BASE_URL=http://localhost:5000`

4. **Seed the database:**
   - First, register one admin user through the application
   - Then, run the seeder script from the server directory to populate questions, professionals, and resources:
     ```bash
     npm run data:import -- --questions --professionals --resources
     ```

5. **Run the application:**
   - From the server directory: `npm run dev`
   - From the client directory: `npm run dev`

## 🚢 Deployment & CI/CD

This project is configured for a professional, container-based deployment on Render and includes a CI/CD pipeline with GitHub Actions.

### 1. Initial Deployment on Render

#### Backend (Web Service):
1. Connect your GitHub repository to a new Render "Web Service"
2. Set the Environment to "Docker"
3. Set the Root Directory to `server`
4. Add all environment variables from your local `server/.env` file

#### Frontend (Web Service):
1. Connect the same repository to a new Render "Web Service"
2. Set the Environment to "Docker"
3. Set the Root Directory to `client`
4. Add `VITE_RAZORPAY_KEY_ID` and the live URL of your backend server as `VITE_API_BASE_URL`

#### Final Configuration:
Update the `CLIENT_URL` environment variable on your backend service to use your new live frontend URL.

### 2. Automated CI/CD with GitHub Actions

This repository contains a `.github/workflows/deploy.yml` file that sets up a "smart" CI/CD pipeline.

**How it Works**: On any git push to the main branch, the workflow automatically runs. It uses a paths-filter to detect whether changes were made in the `/server` directory, the `/client` directory, or both.

**Intelligent Deploys**: It then triggers a deployment on Render for only the service that was actually changed, using a secure deploy hook stored in GitHub Secrets. This is a professional and efficient setup for a monorepo that avoids unnecessary builds.

---

*Built with passion for mental wellness and technical excellence* 💙