# Architecture Decision Records (ADR) for Nebula Exchange

This document records the architectural decisions made for the Nebula Exchange project, a cryptocurrency exchange platform with AI-driven price forecasting.

## ADR 1: Technology Stack Selection

**Date:** 08.10.2024

**Status:** Proposed

**Context:**
We needed a modern, scalable, and performant frontend framework that supports server-side rendering (SSR) and static site generation (SSG) to ensure a fast and responsive user experience.

**Decision:**
We chose Next.js as our frontend framework due to its robust support for SSR and SSG, seamless integration with React, and built-in API routes that simplify backend communication.
For the backend, we chose .NET – for its reliability, performance, and ability to handle high-concurrency scenarios.

**Consequences:**
- Improved performance and SEO due to SSR and SSG.
- Simplified development with built-in routing and API routes.
- Potential complexity in managing server-side state and caching.

## ADR 2: AI-Driven Price Forecasting with PyTorch

**Date:** 15.10.2024

**Status:** Accepted

**Context:**
We needed a machine learning framework capable of handling complex models and large datasets to provide users with accurate and timely price predictions.

**Decision:**
We selected PyTorch for its flexibility and ease of use.

**Consequences:**
- Enhanced user experience with AI-driven price forecasts.
- Expertise in machine learning and PyTorch is required.
- Increased computational resources needed for training and inference.


## ADR 3: Scalable Architecture with Redis for Real-Time Data Processing

**Date:** 05.11.2024

**Status:** Accepted

**Context:**
To handle real-time data processing and avoid redundant external API calls (CoinGecko), we needed a solution that could scale with increasing user demand.

**Decision:**
We implemented Redis as an in-memory data store to cache real-time data and facilitate quick access. Redis also supports pub/sub messaging, which is crucial for real-time updates.

**Consequences:**
- Avoided unnecessary API calls for CoinGecko, if data is requested in short intervals.
- Improved performance and reduced latency for real-time data.
- Additional complexity in managing Redis instances and ensuring data consistency.

## ADR 4: User Data Storage with Firebase

**Date:** 12.11.2024

**Status:** Accepted

**Context:**
We needed a secure and scalable solution for storing user data, including authentication information, preferences, and transaction history.

**Decision:**
We chose Firebase for its real-time database capabilities, seamless authentication integration, and scalability. Firebase also provides robust security features to protect user data.

**Consequences:**
- Simplified user authentication and data storage.
- Real-time synchronization of user data across devices.
- Potential vendor lock-in and reliance on Firebase's pricing model.

## ADR 5: Containerization with Docker and Docker Compose

**Date:** 03.12.2024

**Status:** Accepted

**Context:**
To ensure consistency across development, testing, and production environments, we needed a solution that could package our application and its dependencies into isolated containers.

**Decision:**
We adopted Docker for containerization and Docker Compose for managing multi-container applications. This allows us to define and run complex environments with a single command.

**Consequences:**
- Consistent environments across different stages of development.
- Simplified deployment and scaling of services.
- Increased complexity in managing Docker configurations and networking.

---

This document will be updated as new architectural decisions are made or existing ones are revised.
