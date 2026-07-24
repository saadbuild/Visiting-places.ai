import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { AppProvider } from "./context/AppContext.jsx";
import { TripsProvider } from "./context/TripsContext.jsx";
import { SubscriptionProvider } from "./context/SubscriptionContext.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <TripsProvider>
          <SubscriptionProvider>
            <AppProvider>
              <App />
            </AppProvider>
          </SubscriptionProvider>
        </TripsProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
