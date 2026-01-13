import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import CreateWorkflowPage from "./pages/CreateWorkflow.js";
import { Toaster } from "sonner";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<BrowserRouter>
			<Toaster
				theme="light"
				position="top-center"
				closeButton
			/>
			<Routes>
				<Route
					path="/"
					element={<App />}
				/>
				<Route
					path="/create-workflow"
					element={<CreateWorkflowPage />}
				/>
			</Routes>
		</BrowserRouter>
	</StrictMode>,
);
