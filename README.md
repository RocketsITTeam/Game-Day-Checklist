## 🏀 Game Day Checklist

*Houston Rockets IT Team — Game Day Setup & Breakdown Web Application*

A role-based web application used by the Rockets IT team to coordinate, track, and verify all technical setup and breakdown tasks on game day. Built with a JavaScript frontend and a structured backend, the app ensures every step, from pre-game equipment checks to post-game teardown, is logged, assigned, and completed on time.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [User Roles](#user-roles)
- [Contributing](#contributing)
- [Team](#team)

## Overview
The Game Day Checklist app streamlines the coordination of IT operations before, during, and after Houston Rockets home games. Rather than relying on paper checklists or scattered communication, this platform gives every team member a single source of truth for what needs to be done and who is responsible.
Each game day creates a fresh checklist instance, and users across three roles - Tech, Manager, and Admin — interact with it at different levels of access and responsibility.

## Features

- Role-based access (Tech, Manager, Admin)
- Structured game day checklists for setup and breakdown
- Real-time task status updates
- Task completion logging and history
- Secure login and user management
- Responsive web interface accessible from any device on-site  


## Tech Stack
|Layer  |Technology  |
|-------|------------|
|Frontend | JavaScript, HTML, CSS |
|Backend  | JavaScript (Node.js) |
|Hosting  | Render.com |

## Project Structure
```
Game-Day-Checklist/  
├── Frontend/         # UI components, pages, and styles  
├── Backend/          # API routes, server logic, and data handling  
└── README.md  
```

## Getting Started

The Game Day Checklist is hosted on [Render](https://render.com) and accessible 
from any device with a browser — no installation required.

### Accessing the App

Navigate to the app URL in your browser:

🔗 **[https://game-day-checklist-app.onrender.com](https://game-day-checklist-app.onrender.com)**

### For Developers (Local Setup)

If you need to run the app locally for development or testing:

### Prerequisites

- Node.js (v16 or higher)
- A modern web browser

### Installation

```bash
# Clone the repository
git clone https://github.com/RocketsITTeam/Game-Day-Checklist.git

cd Game-Day-Checklist

# Install backend dependencies
cd Backend
npm install
```

## User Roles
| Role |Description |
|------|------------|
|Tech |Field staff who complete and check off assigned tasks during game day |
|Manager | Oversees progress, reviews completions, and ensures all tasks are on track | 
|Admin | Manages users, configures checklists, and has full system access |  

>[!NOTE]
>*For a full breakdown of each role's responsibilities and how to use the app, see the [User Instruction Guide](#user-interaction-guide).*

## Contributing
This is an internal project maintained by the Rockets IT Team. To contribute:

1. Create a feature branch: git checkout -b feature/your-feature-name  
2. Commit your changes: git commit -m "Add: description of change"  
3. Push to the branch: git push origin feature/your-feature-name  
4. Open a Pull Request for review  
>[!TIP]
>Please keep commits descriptive and test all changes before submitting a PR.

## Team
Maintained by the Houston Rockets IT Team — RocketsITTeam
>[!NOTE]
>*For questions or issues, open a GitHub Issue or reach out directly to the team.*
