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
import EditWorkflowPage from "./pages/EditWorkflow";
import DashboardLayout from "./layouts/DashboardLayout";
import { Toaster } from "sonner";
import Executions from "./pages/Executions";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
	const token = localStorage.getItem("token");
	if (!token) return <Navigate to="/signin" />;
	return <>{children}</>;
}

function App() {
	return (
		<Router>
			<Toaster
				theme="light"
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
							<DashboardLayout>
								<Dashboard />
							</DashboardLayout>
						</ProtectedRoute>
					}
				/>
				<Route
					path="/workflow/create"
					element={
						<ProtectedRoute>
							<DashboardLayout>
								<CreateWorkflow />
							</DashboardLayout>
						</ProtectedRoute>
					}
				/>
				<Route
					path="/workflow/:id"
					element={
						<ProtectedRoute>
							<DashboardLayout>
								<EditWorkflowPage />
							</DashboardLayout>
						</ProtectedRoute>
					}
				/>
				<Route
					path="/workflow/:id/executions"
					element={
						<ProtectedRoute>
							<DashboardLayout>
								<Executions />
							</DashboardLayout>
						</ProtectedRoute>
					}
				/>
			</Routes>
		</Router>
	);
}

export default App;
