# 🚀 DeployX

**DeployX** is a Vercel-like platform that allows developers to **build, deploy, and scale apps instantly** on Kubernetes. Push your Git repo, watch **real-time logs**, and scale automatically — all powered by modern cloud-native architecture.  

![DeployX Banner](https://user-images.githubusercontent.com/your-user-id/deployx-banner.png)  


## 🌟 Features

- **Authentication:** User signup/signin with JWT and Bcrypt.
- **Project Management:** Create projects with Git repo, subdomain, and optional custom domain.
- **Dynamic Deployments:** Trigger deployments on Kubernetes via dynamic Jobs.
- **Real-time Logs:** Stream logs using Kafka + ClickHouse.
- **Dashboard:** View projects, deployment status, and logs in real-time.
- **Frontend:** Dark/light mode with responsive Next.js + TailwindCSS.
- **Smooth Animations:** Framer Motion for seamless UI interactions.

---

## 🏗 Architecture

### Backend
- **Node.js + Express.js** — REST API for authentication, projects, and deployments.
- **Prisma + PostgreSQL** — Store users, projects, and deployments.
- **ClickHouse** — High-performance storage for deployment logs.
- **Kafka** — Real-time log streaming.
- **Kubernetes** — Deploy apps via dynamic Jobs.
- **Mustache + YAML** — Generate Kubernetes Job manifests dynamically.

### Frontend
- **Next.js + React** — Modern SSR-ready frontend.
- **TailwindCSS** — Minimalistic, responsive styling.
- **Framer Motion** — Smooth animations for better UX.

---

## ⚡ Deployment Flow

1. User creates a project in the frontend.
2. Backend validates and stores the project in the database.
3. Kubernetes Job YAML is generated using Mustache template.
4. Job is deployed to the Kubernetes cluster.
5. Kafka streams logs into ClickHouse.
6. Frontend displays live logs and deployment status.

---

## 🛠 Tech Stack

| Layer         | Technology                                      |
|---------------|------------------------------------------------|
| Backend       | Node.js, Express, Prisma, PostgreSQL           |
| Deployment    | Kubernetes, YAML, Mustache                     |
| Logging       | Kafka, ClickHouse                              |
| Frontend      | Next.js, React, TailwindCSS, Framer Motion    |
| Authentication| JWT, Bcrypt                                    |
| DevOps        | Docker, Kubernetes Jobs                        |

---

## ⚡ Setup & Installation

### Clone Repository
```bash
git clone https://github.com/Deepanshumishra2004/vercel-clone.git
cd vercel-clone
Install Backend Dependencies
bash
Copy code
npm install
Environment Variables
Create a .env file:

env
Copy code
DATABASE_URL="postgresql://user:password@localhost:5432/deployx"
JWT_SECRET="your_jwt_secret"
CLICKHOUSE_PASSWORD="your_clickhouse_password"
KAFKA_PASSWORD="your_kafka_password"
Run Backend
bash
Copy code
npm run dev
Frontend
bash
Copy code
cd frontend
npm install
npm run dev
Kubernetes Cluster
Ensure kubectl is configured.

Job template is in kubernetes/jobs.yml.

📚 API Endpoints
Method	Endpoint	Description
POST	/signup	Create a new user
POST	/signin	User login
POST	/project	Create new project
GET	/projects	Get all projects for user
GET	/project/:id	Get project details
POST	/deploy	Trigger deployment
GET	/deploy/:id	Get deployment logs
GET	/deployment/:id	Get logs from ClickHouse

📝 Deployment Logs Flow
Kafka streams container logs from Kubernetes Jobs → ClickHouse stores logs → Backend consumer listens to Kafka → Updates deployment status.

ts
Copy code
const consumer = kafka.consumer({ groupId: 'api-server-logs-consumer' });

await consumer.run({
  eachBatch: async ({ batch, resolveOffset }) => {
    for (const message of batch.messages) {
      const { DEPLOYMENT_ID, log } = JSON.parse(message.value!.toString());
      await client.insert({ table: "log_events", values: [{ deployment_id: DEPLOYMENT_ID, log }] });
    }
  }
});
🎨 Frontend
Built with Next.js.

Responsive design with TailwindCSS.

Smooth animations with Framer Motion.

Dashboard for managing projects, viewing deployments, and live logs.

📌 Key Lessons Learned
Real-time log streaming improves developer experience.

Dynamic Kubernetes Job generation simplifies deployments.

Full-stack TypeScript ensures type safety across backend and frontend.

Authentication middleware secures protected routes.

🔗 Links
GitHub Repository: https://github.com/Deepanshumishra2004/vercel-clone

Live Demo: https://deployx-indol.vercel.app/

🤝 Contributing
Contributions are welcome! Feel free to:

Raise issues

Request features

Submit pull requests

📄 License
MIT License © 2026 Deepanshu Mishra










