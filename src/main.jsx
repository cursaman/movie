import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import App from "./App";
import { WishlistProvider } from "./providers/WishlistProvider";
import { ErrorBoundary } from "./components/Feedback";
import "./styles/index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary>
      <HashRouter>
        <WishlistProvider>
          <App />
        </WishlistProvider>
      </HashRouter>
    </ErrorBoundary>
  </React.StrictMode>,
);
