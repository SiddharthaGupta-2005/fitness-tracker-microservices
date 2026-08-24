# 🚀 FitPulse AI - Production Deployment Guide

This guide details how to deploy the entire FitPulse AI microservices platform (Frontend + 5 Spring Boot Microservices + PostgreSQL + MongoDB + RabbitMQ + OpenRouter AI) to any cloud server (AWS, DigitalOcean, Hetzner, GCP, Azure, or local Docker).

---

## 🏗️ Architecture Stack

| Service | Technology | Port (Host) |
| :--- | :--- | :--- |
| **Frontend** | React 19 + Vite + Nginx Alpine | `80` / `5173` |
| **API Gateway** | Spring Cloud Gateway | `8080` |
| **User Service** | Spring Boot + PostgreSQL | `8081` |
| **Activity Service** | Spring Boot + MongoDB + RabbitMQ | `8082` |
| **AI Service** | Spring Boot + OpenRouter LLM | `8083` |
| **Eureka Server** | Netflix Eureka Discovery | `8761` |
| **Config Server** | Spring Cloud Config | `8888` |
| **PostgreSQL** | PostgreSQL 17 Alpine | `5432` |
| **MongoDB** | MongoDB 7.0 | `27017` |
| **RabbitMQ** | RabbitMQ 3.13 Management | `5672` / `15672` |

---

## ⚡ 1-Click Quickstart (Docker Compose)

### 1. Clone the repository on your Cloud VPS / Server
```bash
git clone https://github.com/SiddharthaGupta-2005/fitness-tracker-microservices.git
cd fitness-tracker-microservices
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env` and set your **OpenRouter API Key**:
```bash
cp .env.example .env
nano .env
```
Set:
```env
OPENROUTER_API_KEY=sk-or-v1-your-real-openrouter-key
```

### 3. Build & Run All Containers
```bash
docker compose up -d --build
```

---

## 🔍 Monitoring & Health Checks

### Check Status of all 10 Containers
```bash
docker compose ps
```

### View Live Logs for any Service
```bash
# View all logs
docker compose logs -f

# View AI Coaching service logs
docker compose logs -f aiservice

# View Gateway logs
docker compose logs -f gateway
```

---

## 🛑 Stopping & Teardown
```bash
# Stop all services
docker compose down

# Stop and purge database volumes
docker compose down -v
```
