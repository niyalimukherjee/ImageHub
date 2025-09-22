**📸 ImageHub_Entertainment**

ImageHub is a secure, flexible image management platform where users can upload, categorize, and share images with advanced privacy and personalization features. Designed to foster a visual content community, it also recommends public images based on user interests.

Live Link: https://image-hub-swart.vercel.app

**🚀 Project Goals**

Secure image storage and categorization

Advanced privacy controls and sharing features

Personalized public image recommendations

Scalable backend using MongoDB & JWT authentication

🧩 Core Features
🔐 User Authentication

JWT-based secure registration & login

Role-based access where applicable

📤 Image Upload API

Upload images with metadata: title, description, categories

Mark images as public or private

🗂️ Categorization System

Organize images into user-defined categories

Filter images by category in public gallery

🛡️ Privacy Control API

Toggle image visibility: Public / Private



👤 User Profile API

Manage profile info and interests (e.g. art, travel, nature)



🌐 Public Gallery API

Browse public images filtered by categories & user interests



**Folder Structure**

├── middleware/              # Authentication middleware
│   └── auth.js              # JWT auth logic
│
├── models/                  # Mongoose models
│   ├── Image.js             # Image schema
│   └── User.js              # User schema
│
├── routes/                  # Express route handlers
│   ├── auth.js              # User login/register routes
│   └── images.js            # Image upload, fetch, and share routes
│
├── utils/                   # Utility functions and integrations
│   └── cloudinary.js        # Cloudinary image upload config
│
├── .env                     # Environment variables
├── server.js                # Main Express server file
├── package.json             # Project metadata & dependencies
├── package-lock.json        # Dependency lock file
└── readme.md                # Project documentation


## ⚙️ Tech Stack

- **React**
- **Vite** (build tool)
- **Tailwind CSS**
-**MaterialUI**
- **React Router** (for page navigation)
- **Node JS**
- **MulterJS**
- **JWT**
-  **Bcrypt**
-  **Cloudinary**

  ## To Clone the repo
  git clone https://github.com/niyalimukherjee/ImageHub.git

##  For backend visit the repository:
https://github.com/niyalimukherjee/ImageHub-backend

