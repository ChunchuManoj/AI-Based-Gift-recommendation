# Gift Recommendation Platform

Welcome to the **Gift Recommendation Platform**, an AI-powered application designed to provide personalized gift recommendations based on user preferences, interests, and other contextual data. This platform leverages advanced AI models and a user-friendly interface to make gift selection effortless and enjoyable.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Folder Structure](#folder-structure)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- **Personalized Gift Recommendations**: Generate tailored gift suggestions based on user-provided survey data.
- **User Authentication**: Secure login and registration system with role-based access (e.g., admin, user).
- **Admin Dashboard**: Manage users, view statistics, and oversee gift recommendations.
- **Saved Gifts**: Allow users to save and manage their favorite gift ideas.
- **Survey System**: Collect user preferences through a multi-step survey.
- **Responsive Design**: Optimized for both desktop and mobile devices.
- **AI Integration**: Uses the Gemini 2.0-flash API for generating recommendations.

---

## Tech Stack

- **Frontend**: React, Next.js, Tailwind CSS
- **Backend**: Node.js, Next.js API routes
- **Database**: MongoDB (via `mongodb` library)
- **Authentication**: NextAuth.js with JWT
- **AI Integration**: Google Gemini API
- **Styling**: Tailwind CSS
- **State Management**: React Context API

---

## Installation

### Prerequisites

- Node.js (v16 or higher)
- pnpm (preferred package manager)
- MongoDB instance (local or cloud)

### Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/gift-recommendation-platform.git
   cd gift-recommendation-platform
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Set up environment variables (see Environment Variables).

4. Run the development server:
   ```bash
   pnpm dev
   ```

5. Open the application in your browser:
   ```
   http://localhost:3000
   ```

---

## Environment Variables

Create a `.env.local` file in the root directory and add the following variables:

```env
# MongoDB
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/<database>?retryWrites=true&w=majority

# Authentication
NEXTAUTH_SECRET=your-nextauth-secret
JWT_SECRET=your-jwt-secret

# Gemini API
GEMINI_API_KEY=your-gemini-api-key
```

---

## Folder Structure

```
gift-recommendation-platform/
├── app/                     # Next.js app directory
│   ├── api/                 # API routes
│   ├── components/          # Reusable UI components
│   ├── context/             # React Context for global state
│   ├── styles/              # Global CSS and Tailwind configuration
│   ├── pages/               # Static and dynamic pages
├── lib/                     # Utility functions and API integrations
├── public/                  # Static assets
├── types/                   # TypeScript type definitions
├── .env.local               # Environment variables
├── tailwind.config.js       # Tailwind CSS configuration
├── pnpm-lock.yaml           # Dependency lock file
└── README.md                # Project documentation
```

---

## Usage

### User Features

- **Survey**: Users can fill out a survey to provide details about the gift recipient.
- **Recommendations**: View AI-generated gift suggestions based on survey data.
- **Save Gifts**: Save favorite gift ideas for later reference.
- **Profile Management**: Update user profile and preferences.

### Admin Features

- **Dashboard**: View platform statistics and manage users.
- **Gift Management**: Oversee and manage gift recommendations.

---

## API Endpoints

### Authentication

- `POST /api/auth/login`: User login.
- `POST /api/auth/register`: User registration.
- `GET /api/auth/me`: Get current user details.

### Recommendations

- `POST /api/recommendations`: Generate gift recommendations.

### Admin

- `GET /api/admin/users`: Fetch all users (admin only).
- `GET /api/admin/stats`: Fetch platform statistics (admin only).

---

## Contributing

We welcome contributions! To contribute:

1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add your message here"
   ```
4. Push to your branch:
   ```bash
   git push origin feature/your-feature-name
   ```
5. Create a Pull Request.

---

## License

This project is licensed under the MIT License.
