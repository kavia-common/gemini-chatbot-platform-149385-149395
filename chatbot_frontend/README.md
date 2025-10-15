# Lightweight React Template for KAVIA

This project provides a minimal React template with a clean, modern UI and minimal dependencies.

## Features

- **Lightweight**: No heavy UI frameworks - uses only vanilla CSS and React
- **Modern UI**: Clean, responsive design with KAVIA brand styling
- **Fast**: Minimal dependencies for quick loading times
- **Simple**: Easy to understand and modify

## Getting Started

In the project directory, you can run:

### `npm start`

Runs the app in development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

If you see "Invalid Host header" in a cloud/preview URL, create a `.env` from `.env.example` and ensure:
- HOST=0.0.0.0
- PORT=3000
This allows the dev server to accept the preview host. The proxy to the backend at port 3001 is already configured in package.json.

### Backend Connectivity

The frontend talks to a Flask backend that should be running on port `3001`. There are two supported ways to connect:

1. Dev Proxy (recommended for local dev)
   - package.json includes `"proxy": "http://localhost:3001"`.
   - Set `REACT_APP_USE_PROXY=true` in your `.env` (see `.env.example`).
   - Requests use relative URLs like `/api/chat` and are forwarded by the CRA dev server, avoiding CORS issues.

2. Direct Base URL
   - Set `REACT_APP_API_BASE_URL=http://localhost:3001` in your `.env`.
   - Leave `REACT_APP_USE_PROXY` unset or `false`.
   - The client will call `http://localhost:3001/api/...` directly.

If neither variable is set, the client defaults to `window.location.origin` with port forced to `3001`.

Create a `.env` file based on `.env.example` for your preferred setup.

### `npm test`

Launches the test runner in interactive watch mode.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

## Troubleshooting "Failed to fetch"

A generic "Failed to fetch" usually indicates a network or CORS problem:
- Ensure the backend is running and reachable at `http://localhost:3001`.
- Confirm the backend exposes the expected route: `POST /api/chat`.
- If not using the dev proxy, make sure the backend enables CORS for origin `http://localhost:3000`.
- If using the dev proxy, ensure the CRA dev server is running and `proxy` is set in `package.json`.
- Check your `.env` for `REACT_APP_API_BASE_URL` or `REACT_APP_USE_PROXY` settings.

## Customization

### Colors

The main brand colors are defined as CSS variables in `src/App.css`.

### Components

This template uses pure HTML/CSS components instead of a UI framework. You can find component styles in `src/App.css`.

## Learn More

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
