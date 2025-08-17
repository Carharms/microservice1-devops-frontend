Need the following file structure

public
    index.html
src
    app.js
    index.js
    App.css
    index.css

ENDPOINTS FOR APIS
(http://localhost:3001 for products, http://localhost:3002 for orders)

ADD ENVIRONMENT VARIABLES FOR API ENDPOINTS AND BASIC ERROR HANDLIND??


TO SETUP REPO
In microservice1-devops-frontend directory
npm install
npm start  # Test locally
docker build -t your-username/subscription-frontend .
docker-compose up -d

# Frontend Service

This is the React-based frontend service for the e-commerce microservices application.

## Features

- Modern React 18 application
- Responsive product catalog interface
- Order creation functionality
- Health checks and monitoring
- Production-ready Docker configuration

## Prerequisites

- Node.js 18+
- Docker and Docker Compose
- Git

## Getting Started

### Local Development

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### Docker Development

1. Build and run with Docker Compose:
```bash
docker-compose up --build
```

2. Access the application at [http://localhost:3000](http://localhost:3000)

### Testing

Run tests:
```bash
npm test
```

Run tests with coverage:
```bash
npm test -- --coverage
```

### Linting

Check code style:
```bash
npm run lint
```

Fix linting issues:
```bash
npm run lint:fix
```

## Docker

### Build Docker Image

```bash
docker build -t frontend-service:latest .
```

### Run Docker Container

```bash
docker run -p 3000:80 -e REACT_APP_API_URL=http://localhost:3001 frontend-service:latest
```

## Environment Variables

- `REACT_APP_API_URL`: Backend API URL (default: http://localhost:3001)
- `NODE_ENV`: Environment mode (development/production)

## CI/CD Pipeline

This service uses Jenkins for CI/CD with the following stages:

1. **Build Stage**: Install dependencies and build the application
2. **Test Stage**: Run unit tests and linting
3. **Security Scan**: SonarQube static analysis
4. **Container Build**: Build Docker image
5. **Container Push**: Push to Docker Hub registry
6. **Deploy**: Deploy to appropriate environment

### Pipeline Triggers

- **Build Environment**: Triggered on pull requests
- **Dev Environment**: Triggered on pushes to `develop` branch
- **Staging Environment**: Triggered on `release/*` branches
- **Production Environment**: Manual trigger from `main` branch

## Git Flow Branches

- `main`: Production-ready code
- `develop`: Integration branch for features
- `feature/*`: Feature development branches
- `release/*`: Release preparation branches  
- `hotfix/*`: Production hotfix branches

## Health Checks

The application includes health check endpoints:

- Container health check via wget on port 80
- Application responds with React app content

## Security

- Container runs as non-root user
- Security headers configured in nginx
- Vulnerability scanning with Trivy
- Code quality gates with SonarQube

## Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend      │───▶│  Product Service │    │  Order Service  │
│   (React/Nginx) │    │     (API)        │◄───│     (API)       │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## Contributing

1. Create a feature branch from `develop`
2. Make your changes
3. Run tests and linting
4. Submit a pull request to `develop`

## Issues

Configure Global Tools in Jenkins:

Go to Manage Jenkins > Global Tool Configuration
Add NodeJS installation: Name it "NodeJS-18", install automatically
Add SonarQube Scanner installation

Configure SonarQube:

Install SonarQube locally or use SonarCloud
In Jenkins: Manage Jenkins > Configure System > SonarQube servers
Add server: Name "SonarQube", URL: http://localhost:9000 (or your SonarQube URL)
Add authentication token in Jenkins credentials


Configure Docker Hub Credentials:

In Jenkins: Manage Jenkins > Manage Credentials
Add Docker Hub credentials with ID: "docker-hub-credentials"


