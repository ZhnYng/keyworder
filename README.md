# **Keyworder: AI-Powered Keyword Generator for Stock Images**  
Keyworder streamlines the process of generating optimized keywords, titles, and descriptions for stock images, improving visibility on stock platforms and helping photographers focus on creativity.

## **🌟 Features**

- **AI-Generated Keywords:** Utilizes OpenAI’s models to generate optimized keywords.
- **CSV Export:** Supports export for Adobe Stock uploads.
- **Pay-As-You-Go Pricing:** Accessible for all levels.

## **🚀 Try It Out**  
Try keyworder [here!](https://keyworder-landing.vercel.app/)

## **🛠️ Architecture**

- **OpenAI (O4-mini)** powers the keyword generation, interfacing with **Trigger.dev** for long-running tasks.
- **Trigger.dev** handles long-running functions and writes the results to **PostgreSQL**.
- The **web application** interacts with the database, fetching generated keywords, titles, and descriptions.
- Image assets are stored in **AWS S3**.

![Architecture Diagram](https://github.com/user-attachments/assets/1f1ac9e2-b0b0-464a-9a73-4474017fa094)

## **🔧 Tech Stack**

| **Category**    | **Technology**         |
|-----------------|------------------------|
| **Frontend**    | Next.js, TailwindCSS    |
| **Backend**     | Node.js, Prisma         |
| **Database**    | PostgreSQL              |
| **Deployment**  | Vercel                  |
| **Storage**     | AWS S3                  |
| **AI**          | OpenAI API (O4-mini)    |
| **Job Queue**   | Trigger.dev             |
