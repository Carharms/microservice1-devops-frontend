## Frontend Service Overview ##
Repository for the React-based web UI for our e-commerce platform. It provides a UI for customers to browse products and place orders.

## Setup ##
To get the project running on your local machine, you'll need to have Node.js and npm installed. Follow these steps:
1. Clone this repository to your local machine:git clone <your-repo-url>
2. Navigate into the project directory:cd frontend-service
3. Install all the required npm packages:npm install

Start the development server. This will compile the code and launch the application in your default browser, typically at http://localhost:3000.npm start

## Project Architecture ##
Technology Stack: The frontend is built using React, a popular JavaScript library for building user interfaces. It uses standard tooling like npm for package management.

API Communication: The application fetches product data from the Product Service and sends order information to the Order Service using REST API calls. This microservices architecture allows for independent development and deployment of the frontend and backend.

User Interface: The UI is designed to be user-friendly and responsive, adapting to different screen sizes for a consistent experience across desktop and mobile devices.

## CI/CD Pipeline ##
This repository is integrated with a Jenkins CI/CD pipeline. The pipeline is configured to automatically:

1. Build: Compile the React application and run linting checks on every pull request to ensure code quality before merging.
2. Test: Run automated unit and integration tests to catch bugs early in the development cycle.
3. Deploy: Trigger deployments to the dev, staging, and prod environments based on our Git Flow branching strategy, ensuring that only validated code reaches production.
