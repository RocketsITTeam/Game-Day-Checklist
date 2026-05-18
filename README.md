# Game Day Checklist

Houston Rockets IT Team — Game Day Setup & Breakdown Web Application

A role-based web application used by the Rockets IT team to coordinate, track, and verify all technical setup and breakdown tasks on game day. Built with a JavaScript frontend and a structured backend, the app ensures every step — from pre-game equipment checks to post-game teardown — is logged, assigned, and completed on time.

📋 Table of Contents

Overview
Features
Tech Stack
Project Structure
Getting Started
User Roles
Contributing
Team


Overview
The Game Day Checklist app streamlines the coordination of IT operations before, during, and after Houston Rockets home games. Rather than relying on paper checklists or scattered communication, this platform gives every team member a single source of truth for what needs to be done and who is responsible.
Each game day creates a fresh checklist instance, and users across three roles — Tech, Manager, and Admin — interact with it at different levels of access and responsibility.

Features

✅ Role-based access (Tech, Manager, Admin)
📋 Structured game day checklists for setup and breakdown
🔄 Real-time task status updates
📝 Task completion logging and history
🔐 Secure login and user management
📱 Responsive web interface accessible from any device on-site


Tech Stack
LayerTechnologyFrontendJavaScript, HTML, CSSBackendJavaScript (Node.js)HostingInternal / Local Server

Project Structure
Game-Day-Checklist/
├── Frontend/         # UI components, pages, and styles
├── Backend/          # API routes, server logic, and data handling
└── README.md

Getting Started
Prerequisites

Node.js (v16 or higher)
A modern web browser

Installation
bash# Clone the repository
git clone https://github.com/RocketsITTeam/Game-Day-Checklist.git

# Navigate into the project
cd Game-Day-Checklist

# Install backend dependencies
cd Backend
npm install

# Install frontend dependencies (if applicable)
cd ../Frontend
npm install
Running the App
bash# From the Backend directory
npm start
Then open your browser and navigate to the local server address provided in the terminal (e.g., http://localhost:3000).

User Roles
RoleDescriptionTechField staff who complete and check off assigned tasks during game dayManagerOversees progress, reviews completions, and ensures all tasks are on trackAdminManages users, configures checklists, and has full system access
For a full breakdown of each role's responsibilities and how to use the app, see the User Instruction Guide.

Contributing
This is an internal project maintained by the Rockets IT Team. To contribute:

Create a feature branch: git checkout -b feature/your-feature-name
Commit your changes: git commit -m "Add: description of change"
Push to the branch: git push origin feature/your-feature-name
Open a Pull Request for review

Please keep commits descriptive and test all changes before submitting a PR.

Team
Maintained by the Houston Rockets IT Team — RocketsITTeam

For questions or issues, open a GitHub Issue or reach out directly to the team.
