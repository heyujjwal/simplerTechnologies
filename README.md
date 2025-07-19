# User Listing App with React & Node.js

This is a complete full-stack application that displays a list of products in a modern, searchable, and sortable data table. The frontend is built with React and TypeScript, and the backend is a simple Node.js and Express server that serves static JSON data.

<img width="1362" height="690" alt="image" src="https://github.com/user-attachments/assets/9b5e2097-6185-4621-b964-68f5d25ed176" />


## Features

-   **Full-Stack Architecture**: Separate client and server applications.
-   **Static JSON API**: A simple Node.js/Express backend serves a predefined list of 50 products.
-   **Modern Data Table**: The frontend uses `TanStack Table` to display the data with the following capabilities:
    -   **Sorting**: Click on column headers to sort the data.
    -   **Filtering**: A search bar to filter products by name.
    -   **Column Visibility**: A dropdown menu to toggle the visibility of columns.
    -   **Pagination**: "Next" and "Previous" buttons to navigate through the data.
-   **TypeScript End-to-End**: Both the frontend and backend are written in TypeScript for type safety and improved developer experience.
-   **Modern UI**: Styled with Tailwind CSS and uses the `shadcn/ui` component library for a clean and professional look.

## Tech Stack

| Area      | Technology                                                                                             |
| :-------- | :----------------------------------------------------------------------------------------------------- |
| **Frontend** | [React](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Vite](https://vitejs.dev/) |
| **UI/Styling**| [Tailwind CSS](https://tailwindcss.com/), [shadcn/ui](https://ui.shadcn.com/)                          |
| **Data Table**| [TanStack Table](https://tanstack.com/table/v8)                                                        |
| **Backend** | [Node.js](https://nodejs.org/), [Express](https://expressjs.com/), [TypeScript](https://www.typescriptlang.org/) |

## Project Structure

The project is organized into two main directories:

```
/root
|-- /client/      # Contains the React frontend application
|-- /server/      # Contains the Node.js backend server
|-- README.md     # This file
```

---

## Installation and Setup

You will need two separate terminals to run this project: one for the backend server and one for the frontend client.

### 1. Backend Server Setup

First, let's get the server running.

```bash
# 1. Navigate to the server directory
cd server

# 2. Install dependencies
npm install

# 3. Start the server
npm start
```

The server will start on `http://localhost:3001`. You can leave this terminal running.

### 2. Frontend Client Setup

Now, open a **new terminal** and set up the client.

```bash
# 1. Navigate to the client directory
cd client

# 2. Install dependencies
npm install

# 3. Install required table and utility libraries
npm install @tanstack/react-table clsx tailwind-merge

# 4. Start the frontend development server
npm run dev
```

The React application will open in your browser, usually at `http://localhost:5173`.

---

## Running the Application

To run the application, you must have **both** the backend and frontend servers running simultaneously in their respective terminals.

1.  **Start the Backend**: `cd server && npm start`
2.  **Start the Frontend**: `cd client && npm run dev`

Once both are running, open `http://localhost:5173` in your browser to see the application.

## Troubleshooting

If you encounter issues, here are the most common solutions:

#### **Error: "Failed to fetch data: HTTP error! status: 404"** or **"Cannot GET /api/products"**

This is the most common issue. It means your frontend application cannot find the backend API.

1.  **Is the backend server running?** Make sure the terminal for the `server` is open and running the `npm start` command.
2.  **Test the API directly:** Open your web browser and go to [http://localhost:3001/api/products](http://localhost:3001/api/products).
    -   **If you see a page of JSON data**, your backend is working correctly. The issue is likely on the frontend.
    -   **If you see an error page**, the backend is not running correctly. Stop it (`Ctrl + C`) and restart it (`npm start`).

#### **Error: "Could not resolve module..." or other build errors**

This usually means a dependency is missing or a configuration file is incorrect.

1.  **Reinstall Dependencies**: The surest way to fix this is to reset your `node_modules`.
    ```bash
    # In the client or server directory that has the error
    rm -rf node_modules package-lock.json
    npm install
    ```
2.  **Check Config Files**: Ensure your `vite.config.ts`, `postcss.config.cjs`, and `tsconfig.json` files match the ones from the project setup.
