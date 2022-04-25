import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app";
import theme from "./css/theme.module.scss";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App theme={theme} />
  </React.StrictMode>
);
