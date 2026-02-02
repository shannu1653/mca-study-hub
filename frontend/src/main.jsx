import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import App from "./App";
import "./index.css";
import "./styles/main.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />

      {/* ✅ Mobile-safe Toaster */}
      <Toaster
        position="top-center"
        containerStyle={{
          top: 20,
          pointerEvents: "none",   // 🔥 IMPORTANT
        }}
        toastOptions={{
          style: {
            pointerEvents: "auto",
          },
        }}
      />
    </BrowserRouter>
  </React.StrictMode>
);
