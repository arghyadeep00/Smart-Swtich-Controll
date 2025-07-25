
# ⚡ SmartWatt – IoT-Based Smart Electricity Monitoring & Control System

SmartWatt is a full-stack IoT-powered web application that enables real-time monitoring and remote control of home electrical devices. It helps users track electricity consumption, estimate energy costs, and operate appliances efficiently through a modern, user-friendly dashboard.

---

## 📸 Demo

> 🔗 Live Frontend: [Render Link](https://smart-switch-controll-1.onrender.com)  
> 🌐 Backend API  
> 📷 Screenshots:
> 
> ![home page](https://github.com/user-attachments/assets/a79391f4-da9b-44b6-b196-aa3c12adc961)


---

## 📚 Features

- ✅ Real-time device control (ON/OFF)
- ⚡ Live monitoring of Voltage, Current, and Power (Watt)
- 📊 Power consumption tracking & billing estimation
- 🔐 Secure login/signup using JWT
- 📈 Usage analytics dashboard
- 🌐 MQTT communication via HiveMQ Cloud
- 🛡️ Protected APIs & token-based authentication

---

## 🛠️ Tech Stack

### 🔹 Frontend
- React.js
- Tailwind CSS
- Axios
- React Toastify

### 🔹 Backend
- Node.js
- Express.js
- MongoDB (MongoDB Atlas)
- JWT Authentication

### 🔹 IoT Hardware
- NodeMCU ESP8266
- 5v Relay Module
- ZMPT101B AC Voltage Sensor Module
- ZMCT103C AC Current Sensor Module
- Arduino IDE

### 🔹 Communication
- MQTT Protocol
- HiveMQ Cloud (Broker)

---

## 🧱 Project Structure

```
smartwatt/
│
|-- backend/                  # Express server & APIs
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   └── config/
│
├── frontend/                 # React dashboard
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── context/
│
├── nodemcu/                  # IoT firmware (Arduino code)
│   └── smartwatt.ino
│
├── README.md
└── .env.example
```

---

## ⚙️ Setup Instructions

### 🔧 1. Clone the Repository

```bash
git clone https://github.com/your-username/smartwatt.git
cd smartwatt
```

### 💻 2. Setup Frontend

```bash
cd frontend
npm install
npm run dev   # for development
```

### 🌐 3. Setup Backend

```bash
cd backend
npm install
# Configure .env file (refer .env.example)
npm run dev
```

### 📡 4. Flash NodeMCU

- Open `smartwatt.ino` in Arduino IDE
- Install required libraries: `ESP8266WiFi`, `PubSubClient`
- copy esp8266 .ino file and paste `Arduino IDE`
- Replace WiFi and MQTT credentials
- Upload code to NodeMCU board

---

## 🔐 Environment Variables

Create a `.env` file in the `backend/` folder:

```env
PORT=5000
MONGO_URI = your_mongo_connection_string
JWT_SECRET = your_jwt_secret
MQTT_BROKER_URL = your_hivemq_url
MQTT_USERNAME = your_username
MQTT_PASSWORD = your_password
```

---

## 🧪 Testing

- Backend API: Postman
- Device Communication: Serial Monitor, MQTT Explorer
- Frontend: Manual testing in browser
 
 ---

## 📜 License

This project is licensed under the MIT License.  
Feel free to modify, use, and share this project with credits.

---

## 🙌 Acknowledgements

- MQTT Broker: [HiveMQ Cloud](https://www.hivemq.com/mqtt-cloud-broker/)
- UI Libraries: [Tailwind CSS](https://tailwindcss.com/)
- Hosting: (Frontend & Backend) [Render](https://render.com/)