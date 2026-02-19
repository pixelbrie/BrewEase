# BrewEase Client

## Overview
This is the frontend client for BrewEase, a modern POS and management system for cafes and restaurants. The client is built with React, TypeScript, Tailwind CSS, and integrates with Firebase for authentication.

## Tech Stack
- **React**: UI library for building interactive interfaces.
- **TypeScript**: Strongly typed JavaScript for safer code.
- **Tailwind CSS**: Utility-first CSS framework for rapid styling.
- **Firebase**: Authentication and backend services.

## Directory Structure
- `Dockerfile`: Container configuration for the client app.
- `index.html`: Main HTML entry point.
- `package.json`: Project dependencies and scripts.
- `postcss.config.js`, `tailwind.config.js`: Tailwind and PostCSS configuration.
- `public/`: Static assets served directly.
- `src/`: Main source code
  - `App.tsx`: Root React component.
  - `index.css`: Global styles.
  - `main.tsx`: Entry point for React app.
  - `Routes.tsx`: App routing logic.
  - `assets/`: Images and icons.
  - `components/`: Reusable UI components (e.g., Button, Input).
  - `context/`: React context providers (e.g., AuthContext).
  - `firebase/`: Firebase config and authentication provider.
  - `hooks/`: Custom React hooks (e.g., useAuth).
  - `layouts/`: Layout components (e.g., NavBar, SideBar).
  - `pages/`: Main app pages
    - `Auth/`: Login and Register pages.
    - `Dashboard/`: Dashboard page.
    - `Menu/`: Menu management page.
    - `Orders/`: Order details and order page.
    - `Settings/`: Settings page.
  - `pos/`: POS-specific components (MenuGrid, OrderCard, PaymentPanel).
  - `services/`: API service layer.
  - `utils/`: Utility functions and constants.

## Using Docker

### 1. Build and Start the Client
- **First time or after changes:**
  ```bash
  docker-compose up --build
  ```
  This builds the Docker image and starts the container.

- **Subsequent runs:**
  ```bash
  docker-compose up
  ```
  This starts the container without rebuilding.

### 2. Stopping the Client
- Press `Ctrl+C` in the terminal running Docker Compose.
- Or, in a separate terminal:
  ```bash
  docker-compose down
  ```

### 3. Installing Dependencies
**Important:** Always install new dependencies from inside the Docker container to ensure consistency.

- Open a shell in the running container:
  ```bash
  docker exec -it <container_name> sh
  ```
  Replace `<container_name>` with the actual name (e.g., `brewease_client_1`).

- Then run:
  ```bash
  npm install <package-name>
  ```

### 4. Opening Terminal in Docker Environment
- Use:
  ```bash
  docker exec -it <container_name> sh
  ```
  This gives you a shell inside the container. All commands (npm, etc.) should be run here for dependency management.

## Best Practices
- **Never install dependencies on your local machine for this project.**
- **Always use the Docker container's shell for npm installs and other CLI operations.**
- **Keep your Docker images up to date by rebuilding with `docker-compose up --build` after dependency changes.**

---
For any issues or questions, refer to the main project README or contact the Niel or Briana
