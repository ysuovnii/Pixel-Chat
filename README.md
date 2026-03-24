# Pixel-Chat 💬🎮

A **real-time chat application** with a retro **16-bit JRPG pixel art** aesthetic, built with Node.js, Express, Socket.IO, and MongoDB. Features a friend request system so users can only chat with accepted allies.

---

## ✨ Features

- ⚡ **Real-time Messaging** — Instant communication powered by Socket.IO
- 🎨 **Retro Pixel Art UI** — 16-bit JRPG-inspired design with floating anti-gravity animations
- 🔐 **Authentication** — Secure login/signup with JWT and bcrypt
- 👥 **Friend Request System** — Send, accept, or reject friend requests before chatting
- 🔍 **Search Page** — Discover and connect with other users across the galaxy
- 🟢 **Online Friends** — Home page shows only online friends with live status
- 👤 **Profile Settings** — Upload profile pictures via Cloudinary
- ✍️ **Typing Indicators** — Know when someone is casting a spell
- 😀 **Pixel Emoji Engine** — Pixelated emoji rendering in chat
- 📧 **Email Integration** — Nodemailer support for account-related emails
- 🖥️ **Server-Side Rendering** — Fast, dynamic pages with EJS templates

---

## 🛠️ Tech Stack

| Layer        | Technology                              |
|--------------|----------------------------------------|
| **Backend**  | Node.js, Express.js                    |
| **Frontend** | EJS, HTML, CSS, JavaScript             |
| **Database** | MongoDB (Mongoose ODM)                 |
| **Realtime** | Socket.IO                              |
| **Auth**     | JSON Web Tokens (JWT), bcrypt          |
| **Storage**  | Cloudinary (profile picture uploads)   |
| **Email**    | Nodemailer                             |

---

## 📁 Project Structure

```
Pixel-Chat/
├── controller/
│   ├── auth.controller.js       # Login, signup, logout, profile update
│   ├── home.controller.js       # Home page (friends-only) & chat guard
│   ├── message.controller.js    # Send & retrieve messages
│   └── request.controller.js    # Friend request API (send/accept/reject/search)
├── lib/                         # Utility functions (DB, Cloudinary, JWT)
├── middleware/                  # Auth middleware (JWT verification)
├── models/
│   ├── user.model.js            # User schema (with friends array)
│   ├── message.model.js         # Message schema
│   └── request.model.js         # Friend request schema (pending/accepted/rejected)
├── public/css/                  # Stylesheets (JRPG pixel theme)
├── routes/
│   ├── auth.route.js            # Auth routes (login/signup/logout)
│   ├── home.route.js            # Home & chat page routes
│   ├── message.route.js         # Message API routes
│   └── request.route.js         # Friend request & search routes
├── views/
│   ├── layout.ejs               # Shared command menu navigation
│   ├── loginPage.ejs            # Login page
│   ├── signupPage.ejs           # Signup page
│   ├── homePage.ejs             # Home page (online friends list)
│   ├── chatPage.ejs             # Chat page with emoji panel
│   ├── searchPage.ejs           # Search & friend request management
│   └── profileSettingPage.ejs   # Profile settings (avatar upload)
├── index.js                     # Entry point (Express + Socket.IO server)
└── package.json                 # Dependencies and scripts
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18+)
- **MongoDB** (local or Atlas)
- **Cloudinary** account (for image uploads)

### Installation

```bash
# Clone the repository
git clone https://github.com/ysuovnii/Pixel-Chat.git
cd Pixel-Chat

# Install dependencies
npm install

# Create a .env file with the following variables
# PORT=5050
# MONGO_URI=your_mongodb_connection_string
# JWT_KEY=your_jwt_secret
# CLOUDINARY_CLOUD_NAME=your_cloud_name
# CLOUDINARY_CLOUD_API_KEY=your_api_key
# CLOUDINARY_CLOUD_API_SECRET=your_api_secret

# Start the development server
npm run dev
```

The app will be available at `http://localhost:5050`

---

## 📖 How It Works

1. **Sign up** — Create a hero on the signup page
2. **Search** — Use the 🔍 Search page to find other players
3. **Send request** — Click "SEND REQUEST" on a player card
4. **Accept** — The other player sees the incoming request and accepts
5. **Chat** — Both players now appear on each other's home page when online — click to open a private chat

---

## 🤝 Contributing

Contributions are welcome! If you'd like to improve Pixel-Chat:

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the ISC License.
