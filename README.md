DeployX 🚀

DeployX is a Vercel-like platform for developers to build, deploy, and scale apps instantly on Kubernetes. Push your Git repo, watch real-time logs, and scale automatically — all powered by modern cloud-native architecture.

🌟 Features

User signup/signin with JWT authentication.

Create projects with Git repo, subdomain, and optional custom domain.

Trigger deployments on Kubernetes with dynamic Job creation.

Stream real-time deployment logs using Kafka + ClickHouse.

Dashboard to view projects and deployment status.

Dark/light mode frontend built with Next.js + TailwindCSS.

🏗 Architecture

Backend:

Express.js — REST API for auth, projects, deployments.

Prisma + PostgreSQL — Store users, projects, deployments.

ClickHouse — Store high-performance deployment logs.

Kafka — Real-time log streaming.

Kubernetes — Deploy apps via dynamic Jobs.

Mustache + YAML — Generate Kubernetes Job manifests dynamically.

Frontend:

Next.js + React — Modern, SSR-ready frontend.

TailwindCSS — Minimalistic, responsive styling.

Framer Motion — Smooth animations.

Deployment Flow:

User creates a project in the frontend.

Backend validates and stores project in database.

Kubernetes Job YAML is generated using Mustache template.

Job is deployed to Kubernetes cluster.

Kafka streams logs into ClickHouse.

Frontend displays live logs and deployment status.

🛠 Tech Stack
Layer	Technology
Backend	Node.js, Express, Prisma, PostgreSQL
Deployment	Kubernetes, YAML, Mustache
Logging	Kafka, ClickHouse
Frontend	Next.js, React, TailwindCSS, Framer Motion
Authentication	JWT, Bcrypt
DevOps	Docker, Kubernetes Jobs
⚡ Setup & Installation

Clone Repo

git clone https://github.com/<your-username>/deployx.git
cd deployx


Install Dependencies

npm install


Environment Variables

Create .env file:

DATABASE_URL="postgresql://user:password@localhost:5432/deployx"
JWT_SECRET="your_jwt_secret"
CLICKHOUSE_PASSWORD="your_clickhouse_password"
KAFKA_PASSWORD="your_kafka_password"


Run Backend

npm run dev


Frontend

cd frontend
npm install
npm run dev


Kubernetes Cluster

Ensure kubectl is configured.

Jobs template is in kubernetes/jobs.yml.

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

Kafka streams container logs from Kubernetes Jobs.

ClickHouse stores logs for real-time querying.

Backend consumer listens to Kafka topics, stores logs, updates deployment status.

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

Smooth animations using Framer Motion.

Dashboard to manage projects, view deployments, and live logs.

📌 Key Lessons

Real-time log streaming is crucial for developer experience.

Dynamic Kubernetes Job generation simplifies deployments.

Full-stack TypeScript improves type safety across backend and frontend.

Auth middleware ensures route protection.

🔗 Links

GitHub: (https://github.com/Deepanshumishra2004/vercel-clone)

Live Demo: https://deployx-indol.vercel.app/

🤝 Contributing

Feel free to contribute, raise issues, or request features.

📄 License

MIT License © 2026 Deepanshu Mishra
