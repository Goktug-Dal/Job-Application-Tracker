import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const loginUser = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            const response = await axios.post(
                "https://job-application-tracker-7ykl.onrender.com/api/token/",
                { username, password }
            );

            // Store the JWT tokens exactly where customAxios expects to find them
            localStorage.setItem("access", response.data.access);
            localStorage.setItem("refresh", response.data.refresh);
            
            // Send the user to the Dashboard
            navigate("/"); 
        } catch (err) {
            setError("Invalid username or password.");
        }
    };

    return (
        <div style={{ padding: "20px", maxWidth: "400px", margin: "0 auto" }}>
            <h2>Login</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}

            <form onSubmit={loginUser} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                <input
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    style={{ padding: "8px" }}
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={{ padding: "8px" }}
                />

                <button type="submit" style={{ backgroundColor: "#007bff", color: "white", padding: "10px", border: "none", borderRadius: "5px", cursor: "pointer" }}>
                    Login
                </button>
            </form>
            
            <p style={{ marginTop: "15px" }}>
                Don't have an account? <Link to="/register">Register here</Link>
            </p>
        </div>
    );
}