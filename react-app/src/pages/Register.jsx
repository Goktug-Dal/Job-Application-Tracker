import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

export default function Register() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const registerUser = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            const response = await axios.post("https://job-application-tracker-7ykl.onrender.com/api/register/", { 
                username: username, 
                password: password 
            });
            
            alert("Account created successfully!");
            navigate("/login"); // Send them to login after creating the account
        } catch (err) {
            setError("Failed to register. Username might be taken.");
        }
    };

    return (
        <div style={{ padding: "20px", maxWidth: "400px", margin: "0 auto" }}>
            <h2>Register</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}

            <form onSubmit={registerUser} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
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

                <button type="submit" style={{ backgroundColor: "#28a745", color: "white", padding: "10px", border: "none", borderRadius: "5px", cursor: "pointer" }}>
                    Register
                </button>
            </form>
            
            <p style={{ marginTop: "15px" }}>
                Already have an account? <Link to="/login">Login here</Link>
            </p>
        </div>
    );
}