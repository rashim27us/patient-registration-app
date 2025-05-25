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
git clone <repository-url>
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

## Challenges Faced During Development

### 1. Data Storage Consistency and Technology Transition
Initially, the app used IndexedDB (via the `idb` package) for structured data storage in the browser. This was chosen because IndexedDB is natively supported in all browsers and allows for persistent, client-side storage without any backend. However, IndexedDB does not support SQL queries, which limited our ability to provide a flexible query interface for users.

As the project evolved, we needed to support raw SQL queries in the browser. To achieve this, we integrated pglite—a WASM-based, PostgreSQL-compatible engine that runs entirely in the browser. This allowed us to offer a true SQL experience for querying patient data. The transition required us to implement data synchronization between the original IndexedDB/localStorage and the new pglite database, ensuring that all patient data remained consistent and accessible regardless of the storage backend.

### 2. SQL Support in the Browser
Supporting raw SQL queries in a browser environment is non-trivial. IndexedDB does not natively support SQL, so we had to use pglite (a WASM-based PostgreSQL-like engine) to allow users to run real SQL queries on the client side. This required changes to the data model and query service.

### 3. Data Type Mismatches
When migrating from localStorage/IndexedDB to pglite, we encountered issues with ID types. Patient IDs generated with `Date.now()` were too large for the default `SERIAL` (integer) type in SQL, causing errors. We fixed this by changing the `id` column to `TEXT` in the SQL schema.

### 4. Keeping UI and Data in Sync
Ensuring that new or updated patients were immediately visible in the SQL query interface required careful synchronization after every save operation. We added automatic syncing from localStorage to pglite after each patient save.

### 5. Error Handling and Debugging
Browser-based SQL engines and storage APIs can fail silently or behave differently across browsers. We added robust error handling and logging to help diagnose and resolve issues quickly during development.


