# 💸 100% Free Cloud Deployment Guide ($0/Month)

Deploy every component of the FitPulse AI platform completely free of charge ($0/month) using trusted free-tier cloud providers.

---

## 🏗️ 100% Free Cloud Architecture

| Layer | Component | Free Cloud Provider | Free Tier Specs |
| :--- | :--- | :--- | :--- |
| **Frontend** | React 19 + Vite | **[Vercel](https://vercel.com)** or **[Netlify](https://netlify.com)** | Unlimited deployments, 100GB bandwidth, Free SSL |
| **NoSQL DB** | Activity & AI Data | **[MongoDB Atlas](https://www.mongodb.com/atlas)** | 512MB M0 Cluster, Free forever |
| **SQL DB** | User Identity State | **[Neon.tech](https://neon.tech)** or **[Supabase](https://supabase.com)** | 500MB Free PostgreSQL, Serverless |
| **Message Broker** | RabbitMQ | **[CloudAMQP](https://www.cloudamqp.com/)** | "Little Lemur" Free Plan (1M msgs/month) |
| **AI LLM Engine** | Workout Analysis | **[OpenRouter](https://openrouter.ai)** | Free-tier models (`openrouter/free`, `llama-3.3-70b-instruct:free`) |
| **Backend Services** | Gateway & Microservices | **[Oracle Cloud Free Tier](https://www.oracle.com/cloud/free/)** / **[Render.com](https://render.com)** | Free Web Services or 24GB RAM Always-Free VPS |

---

## 🚀 Step 1: Deploy Free Managed Cloud Databases

### 1. Free MongoDB (MongoDB Atlas)
1. Go to [mongodb.com/atlas](https://www.mongodb.com/atlas) and create a free account.
2. Create a **Shared (M0 Free)** cluster.
3. In **Network Access**, add `0.0.0.0/0` (Allow access from anywhere).
4. In **Database Access**, create a user `admin` with a password.
5. Click **Connect ➔ Drivers ➔ Java** and copy your URI:
   ```
   mongodb+srv://admin:<password>@cluster0.abcde.mongodb.net/?retryWrites=true&w=majority
   ```

### 2. Free PostgreSQL (Neon.tech)
1. Go to [neon.tech](https://neon.tech) and sign up with GitHub.
2. Create a project named `fitness_user_db`.
3. Copy your JDBC Connection String:
   ```
   jdbc:postgresql://ep-xyz.us-east-2.aws.neon.tech/fitness_user_db?sslmode=require
   ```

### 3. Free RabbitMQ (CloudAMQP)
1. Go to [cloudamqp.com](https://www.cloudamqp.com/) and sign up for the **Little Lemur** plan ($0).
2. Copy your AMQP URL and host details.

---

## 🚀 Step 2: Deploy Frontend on Vercel (1-Click & 30 Seconds)

1. Go to [vercel.com](https://vercel.com) and log in with your GitHub account.
2. Click **"Add New..." ➔ "Project"**.
3. Import your repository: **`SiddharthaGupta-2005/fitness-tracker-microservices`**.
4. In the configuration:
   - **Root Directory**: Click Edit and select **`fitness-tracker-frontend`**.
   - **Framework Preset**: Vite.
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Click **Deploy**!
   - Your frontend will be live on a public URL like `https://fitness-tracker-frontend.vercel.app` with instant global CDN and HTTPS!

---

## 🚀 Step 3: Deploy Backend Microservices for Free

### Option A: Oracle Cloud "Always Free" VPS (Run all 10 containers simultaneously)
1. Sign up for [Oracle Cloud Free Tier](https://www.oracle.com/cloud/free/).
2. Launch an **Ampere A1 Compute Instance** (Select 4 OCPU, 24GB RAM — **100% Free Forever**).
3. Install Docker on the instance:
   ```bash
   sudo apt update && sudo apt install -y docker.io docker-compose
   ```
4. Clone and run:
   ```bash
   git clone https://github.com/SiddharthaGupta-2005/fitness-tracker-microservices.git
   cd fitness-tracker-microservices
   cp .env.example .env
   # Add your OPENROUTER_API_KEY to .env
   docker compose up -d --build
   ```
5. Your entire platform runs 24/7 with 0 cost!

### Option B: Render.com (Free Web Services)
1. Sign up at [render.com](https://render.com).
2. Click **New ➔ Web Service** and connect your GitHub repo.
3. Select Dockerfile builds or Maven builds for your microservices.
4. Supply your MongoDB Atlas, Neon PostgreSQL, and CloudAMQP credentials in the Environment Variables tab.
