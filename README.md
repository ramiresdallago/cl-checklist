
# Project Description: Volunteer Task Manager for Sunday Services

## Pitch
Transforming Team Collaboration and Task Management in Your Church

This project is a dynamic task management tool built with Next.js and Google Sheets API, designed to streamline volunteer coordination for Sunday services at local churches.

### 🚀 Why This Project?
Managing a team of volunteers can be challenging, especially when tasks need to be tracked and updated for each Sunday service. This app eliminates guesswork, enabling your team to stay on top of their responsibilities, track progress, and focus on what matters most—serving your congregation.

### 🌟 Features
#### Centralized Checklist
Integrate seamlessly with Google Sheets to maintain an up-to-date checklist. Volunteers can see what tasks are done and what needs attention.

#### Interactive To-Do List
Create, assign, and update tasks effortlessly, ensuring no detail is overlooked.

#### Personalized Dashboards
Volunteers get tailored views of tasks relevant to their roles, reducing confusion and maximizing efficiency.

#### Sunday Service Focused
Designed with the unique dynamics of church services in mind, ensuring every aspect is covered—before, during, and after each service.

### 🎯 Benefits
- Enhanced Communication: No more missed tasks or last-minute surprises.
- Improved Accountability: Everyone knows their role and progress at a glance.
- Increased Efficiency: Spend less time coordinating and more time focusing on your mission.

### 📖 How It Works
Setup Google Sheet Integration: Connect the app to a Google Sheet containing your master checklist.
Add Tasks: Use the intuitive interface to add and assign tasks.
Track Progress: Volunteers mark tasks as complete, providing a real-time view of service readiness.
Review & Improve: After each service, analyze what was done and plan for the next one.

# ⚙️ Technical Specifications
## Front-End

### Framework: Next.js
Server-side rendering for fast initial load times and improved SEO.
API routes to handle server-side logic for data synchronization.

### Styling: Tailwind CSS
Utility-first CSS framework for responsive and modern UI design.
Ensures a clean and scalable styling structure.

## Back-End Integration
### Google Sheets API
Reads and writes data to a Google Sheet for real-time updates.

### API Routes
Custom endpoints in Next.js to fetch, process, and push data to Google Sheets.
Optimized with caching strategies for performance.

## Data Management
Data Source: Google Sheets
Serves as the dynamic database for checklist and task data.
Editable via both the app interface and directly in Google Sheets.
Key Functionalities
Task Synchronization

Two-way data binding between the Google Sheet and the app.
Real-time updates using API calls to reflect changes instantly.
Role-Based Views

Customized task visibility based on volunteer roles.
Filtered views for better focus and productivity.
Progress Tracking

Real-time status updates for each task in the checklist.
Easy distinction between completed and pending tasks.

## Development Stack
Languages: TypeScript, JavaScript
Version Control: Git and GitHub
Testing: Jest and React Testing Library
Linting & Formatting: ESLint and Prettier

--- 

# Setting up

## Environments variables
1. Create a secrets.json
2. Fill secrets.json based on KEYS in GCP: https://console.cloud.google.com/iam-admin/serviceaccounts/details/112709413228905289582;edit=true/keys?project=cidade-luz
## Projects goals
- [x] List items based on google spreadsheet
- [x] Update items based on click on checklist
- [ ] Get range dynamically
- [ ] Split items based on sections
- [ ] Split items based on team position
- [ ] Add reset checklist button

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```