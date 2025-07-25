import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { Integrations } from "./integrations";

const root = document.getElementById("root");

if (!root) {
	throw new Error("No root element");
}

createRoot(root).render(
	<StrictMode>
		<Integrations />
	</StrictMode>,
);
