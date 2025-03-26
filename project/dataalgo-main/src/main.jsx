import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

// Important styles
import "./assets/strings/color.css";
import "./assets/strings/size.css";
import "./assets/styles/Main.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
