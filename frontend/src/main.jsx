import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import { store } from "./store/store.js";
import { BrowserRouter } from "react-router-dom";
import {registerSW} from "virtual:pwa-register";
import SmoothScroll from "./animation/SmoothScroll.jsx";
registerSW();


createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <BrowserRouter>
    <SmoothScroll>
      <App />
    </SmoothScroll>
    </BrowserRouter>
  </Provider>
);
