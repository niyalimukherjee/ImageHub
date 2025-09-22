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

src/
├── assets/                # Static assets (images, icons, etc.)
├── components/            # Reusable UI components
│   ├── Header.jsx         # Navigation header
│   ├── ImageCard.jsx      # Image card display component
│   └── LightBox.jsx       # Lightbox/modal for viewing images
├── lib/                   # Custom libraries or helper functions
├── pages/                 # Main route pages
│   ├── Gallery.jsx        # Public/private image gallery
│   ├── Login.jsx          # User login page
│   ├── Register.jsx       # User registration page
│   └── Upload.jsx         # Image upload page
├── utils/                 # Utility functions and styles
│   ├── App.css            # Main App styling
│   ├── App.jsx            # Root App component
│   └── index.css          # Global styles
├── main.jsx               # Entry point (renders App)

.gitignore                 # Git ignore rules
index.html                 # Main HTML template
package.json               # Project metadata & dependencies
package-lock.json          # Dependency lock file
README.md                  # Project documentation


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

