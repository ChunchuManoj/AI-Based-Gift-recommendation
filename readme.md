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

Install dependencies: