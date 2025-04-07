# CSCI201FinalProject
USC Study Spot Finder

## Setup
Clone and enter repository:
```
git clone https://github.com/HounigBiene/CSCI201FinalProject.git
cd CSCI201FinalProject
```

Install frontend dependencies (install npm if you don't have it):
```
cd react-frontend
npm install
```

Install backend dependencies (install npm if you don't have it):
```
cd spring-boot-backend/uscstudyspotfinder
./mvnw clean install
```

Add your local MySQL password to `spring-boot-backend/uscstudyspotfinder/src/main/resources/application.properties`
where it says `YOUR_PASSWORD`.

## Running

Make sure your local MySQL service is active.

Run frontend:
```
cd react-frontend
npm start
```
Go to `http://localhost:3000` to see React frontend.

Run backend (with another terminal):
```
cd spring-boot-backend/uscstudyspotfinder
./mvnw spring-boot:run
```
Go to `http://localhost:8080` to see Spring backend welcome page.

## Miscellaneous
For future reference, here's what the backend is configured with:

![image](https://github.com/user-attachments/assets/3d596e2a-11e0-48a0-b7f5-23538e5bf6e2)



