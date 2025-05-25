# Patient Registration App

A frontend-only patient registration application that allows healthcare professionals to register new patients, manage records, and perform queries. The app works entirely in the browser with local data storage and synchronization across tabs.

## Technologies Used

- **React**: Frontend UI library  
- **IndexedDB**: Via `idb` package for structured data storage  
- **localStorage**: For cross-tab synchronization  
- **Webpack**: For bundling and development server  

## Features

### Patient Registration
Add new patients with comprehensive information including:
- Personal details (name, DOB, gender)
- Contact information (phone, email, address)
- Medical history and allergies

### Patient Directory
View and manage all registered patients with:
- Searchable interface
- Sortable columns
- Edit and delete functionality

### Data Persistence
All patient data persists across page refreshes using browser storage

### Multi-Tab Support
Synchronization across multiple browser tabs

### Form Validation
Input validation to ensure data integrity

## Installation

Clone the repository:
```bash
git clone https://github.com/rashim27us/patient-registration-app.git
```

Navigate to the project directory:
```bash
cd patient-registration-app
```

Install dependencies and start the app:
```bash
npm start
```

## Running the Application

Start the development server:
```bash
npm start
```

This will launch the application at `http://localhost:8081` in your default browser.

## Build for Production

Create a production-ready build:
```bash
npm run build
```

This generates optimized files in the `dist` directory.

## Project Structure

```
patient-registration-app/
├── src/
│   ├── components/
│   │   ├── ErrorBoundary.js
│   │   ├── Header.js
│   │   ├── PatientForm.js
│   │   ├── PatientList.js
│   │   ├── QueryInterface.js
│   │   └── SyncStatus.js
│   ├── services/
│   │   ├── db.js
│   │   ├── patientService.js
│   │   └── syncService.js
│   ├── utils/
│   │   └── validators.js
│   ├── App.js
│   ├── index.js
│   └── styles.css
├── public/
│   ├── index.html
│   └── manifest.json
├── package.json
├── webpack.config.js
├── .babelrc
└── README.md
```

## Development

### Available Scripts

- `npm start` - Runs the app in development mode  
- `npm run build` - Builds the app for production  
- `npm test` - Runs tests in watch mode  
- `npm run lint` - Lints the codebase  

## Data Storage

The application uses two storage mechanisms:
- **IndexedDB (`patientService.js`)**: For primary patient data storage  
- **localStorage (`db.js`)**: For simple operations and cross-tab synchronization  


