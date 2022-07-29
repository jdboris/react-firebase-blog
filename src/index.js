import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./components/app";
import theme from "./themes/theme-1/theme.module.scss";
import { BrowserRouter } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App theme={theme} />
    </BrowserRouter>
  </React.StrictMode>
);
