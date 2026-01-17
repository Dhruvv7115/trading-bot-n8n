import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from "react-router-dom";
import Landing from "./pages/Landing";
import Signup from "./pages/Signup";
import Signin from "./pages/Signin";
import Dashboard from "./pages/Dashboard";
import CreateWorkflow from "./pages/CreateWorkflow";
import { Toaster } from "sonner";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
	const token = localStorage.getItem("token");
	if (!token) return <Navigate to="/signin" />;
	return <>{children}</>;
}

function App() {
	return (
		<Router>
			<Toaster
				theme="dark"
				position="top-right"
			/>
			<Routes>
				<Route
					path="/"
					element={<Landing />}
				/>
				<Route
					path="/signup"
					element={<Signup />}
				/>
				<Route
					path="/signin"
					element={<Signin />}
				/>
				<Route
					path="/dashboard"
					element={
						<ProtectedRoute>
							<Dashboard />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/workflow/create"
					element={
						<ProtectedRoute>
							<CreateWorkflow />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/workflow/:id"
					element={
						<ProtectedRoute>
							{/* Todo: Add Workflow Editor Route */}
							<CreateWorkflow />
						</ProtectedRoute>
					}
				/>
			</Routes>
		</Router>
	);
}

export default App;
