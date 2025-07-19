import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import IndicatorControlSystem from "./App";
import "./styles/global.scss";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <IndicatorControlSystem />
  </StrictMode>
);
