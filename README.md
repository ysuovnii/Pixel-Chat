# 🌐 IETSphere

**IETSphere** is a real-time campus communication platform built for students of IET DAVV. It enables seamless interaction through instant messaging, online user tracking, and a clean social interface designed specifically for college communities.

---

## 🚀 Features

* 💬 **Real-time Chat** – Instantly send and receive messages
* 👥 **Friends System** – Connect with classmates
* ⚡ **Fast & Responsive UI** – Smooth user experience
* 🔒 **Secure Authentication** – User login and session management

---

## 🛠️ Tech Stack

- Frontend: EJS, CSS, JavaScript
- Backend: Node.js, Express.js
- Database: MongoDB
- Real-time: Socket.IO

---

## 📁 Project Structure

```
IETSphere/
│── src/
│   ├── controller/
│   ├── lib/
│   ├── middleware/
│   ├── models/
│   ├── public/       # Static files
│   ├── routes/
│   ├── views/        # EJS templates
│   └── index.js
│
│── package-lock.json
│── package.json
│── README.md
```

---

## ⚙️ Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/your-username/IETSphere.git
cd IETSphere
```

### 2. Install dependencies

```bash
npm install
```

### 3. Setup environment variables

Create a `.env` file in the root directory:

```
PORT 
JWT_KEY 
MONGO_URI 
CLOUDINARY_CLOUD_NAME 
CLOUDINARY_CLOUD_API_KEY 
CLOUDINARY_CLOUD_API_SECRET 
SECRET_KEY
EMAIL_USER   
EMAIL_PASS 
```

### 4. Run the application

```bash
npm run dev
```

---

## 🧠 How It Works

* Users sign up and log in securely
* Socket.IO establishes a real-time connection
* Online users are tracked dynamically
* Messages are delivered instantly without requiring page reloads

---

## 📌 Future Improvements

* 📱 Mobile responsiveness improvements
* 🔔 Notifications system
* 📁 File sharing support
* 🧑‍🤝‍🧑 Group chats
* 🧠 AI-based smart replies (future idea)

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 🙌 Acknowledgements

* Built for IET DAVV students
* Inspired by modern chat applications

---

## 💡 Author

Developed by **[ysuovnii]**

---
