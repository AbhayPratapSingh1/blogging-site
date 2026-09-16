import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearError, doLoginRequest } from "../../features/loginSlice";
import NotificationModal from "../../Components/modals/NotificationModal";
import Image from "../../images/logo.png";

const Login = () => {
    const dispatch = useDispatch();
    const isAuthenticated = useSelector((state) => state.app.isAuthenticated);
    const errorInLogin = useSelector((state) => state.login.errorInUser);
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleClick = async (e) => {
        e.preventDefault();
        if (email && password) {
            dispatch(doLoginRequest({ email, password }));
        }
    };

    useEffect(() => {
        const token = localStorage.getItem("abToken");
        if (isAuthenticated || token) {
            navigate("/dashboard");
        }
    }, [isAuthenticated, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-xl shadow-lg p-8">
                    <div className="text-center mb-8">
                        <img className="mx-auto h-16 w-auto mb-4" src={Image} alt="Logo" />
                        <h2 className="text-2xl font-semibold text-gray-800">Welcome Back</h2>
                        <p className="text-gray-500 text-sm mt-1">Sign in to your account</p>
                    </div>

                    {errorInLogin && (
                        <NotificationModal
                            message={errorInLogin}
                            modelOpen={errorInLogin}
                            modelClose={() => dispatch(clearError())}
                            error
                        />
                    )}

                    <form onSubmit={handleClick} className="space-y-5">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Email Address
                            </label>
                            <input
                                id="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                name="email"
                                type="email"
                                autoComplete="email"
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                                placeholder="Enter your email"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                Password
                            </label>
                            <input
                                id="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                                placeholder="Enter your password"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                        >
                            Sign In
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
