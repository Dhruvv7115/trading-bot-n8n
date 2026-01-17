import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authApi } from "../lib/api";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function Signup() {
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);
	const [formData, setFormData] = useState({
		username: "",
		password: "",
	});

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		try {
			await authApi.signup(formData);
			toast.success("Account created successfully!");
			navigate("/signin");
		} catch (error: any) {
			toast.error(error.response?.data?.message || "Something went wrong");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-neutral-950 flex items-center justify-center p-6">
			<div className="w-full max-w-md bg-neutral-900 border border-white/10 rounded-2xl p-8">
				<div className="text-center mb-8">
					<h1 className="text-2xl font-bold text-white mb-2">
						Create an account
					</h1>
					<p className="text-neutral-400">Start automating your trades today</p>
				</div>

				<form
					onSubmit={handleSubmit}
					className="space-y-4"
				>
					<div>
						<label className="block text-sm font-medium text-neutral-300 mb-1.5">
							Username
						</label>
						<input
							type="text"
							required
							className="w-full px-4 py-2 bg-neutral-950 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
							value={formData.username}
							onChange={(e) =>
								setFormData({ ...formData, username: e.target.value })
							}
						/>
					</div>
					<div>
						<label className="block text-sm font-medium text-neutral-300 mb-1.5">
							Password
						</label>
						<input
							type="password"
							required
							className="w-full px-4 py-2 bg-neutral-950 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
							value={formData.password}
							onChange={(e) =>
								setFormData({ ...formData, password: e.target.value })
							}
						/>
					</div>

					<button
						type="submit"
						disabled={loading}
						className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign Up"}
					</button>
				</form>

				<p className="mt-6 text-center text-sm text-neutral-400">
					Already have an account?{" "}
					<Link
						to="/signin"
						className="text-indigo-400 hover:underline"
					>
						Sign in
					</Link>
				</p>
			</div>
		</div>
	);
}
