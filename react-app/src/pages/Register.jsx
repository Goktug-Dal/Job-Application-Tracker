import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../api/config";
import "../styles/theme.css";

export default function Register() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();

    const registerUser = async (e) => {
        e.preventDefault();
        setError(null);
        setSubmitting(true);

        try {
            // 1. Create the account
            await axios.post(`${API_BASE_URL}/register/`, { username, password });

            // 2. Automatically log them in
            const response = await axios.post(`${API_BASE_URL}/token/`, { username, password });

            // 3. Save the keys
            localStorage.setItem("access", response.data.access);
            localStorage.setItem("refresh", response.data.refresh);

            // 4. Send them straight to their real dashboard
            navigate("/");
        } catch (err) {
            if (!err.response) {
                setError("Can't reach the server. Check your connection and try again.");
            } else if (err.response.status === 400) {
                setError("Username is already taken.");
            } else {
                setError("Registration failed. Please try again.");
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="dossier-shell">
            <div className="dossier-card">
                <p className="dossier-eyebrow">New Case File</p>
                <h2 className="dossier-title">Register</h2>
                {error && <p className="error-strip">{error}</p>}

                <form onSubmit={registerUser}>
                    <div className="field-group">
                        <label className="field-label">Username</label>
                        <input
                            className="field-input"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="field-group">
                        <label className="field-label">Password</label>
                        <input
                            className="field-input"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-accept" disabled={submitting}>
                        {submitting ? "Creating account…" : "Register & Log In"}
                    </button>
                </form>

                <p className="footnote">
                    Already have an account? <Link className="link-ink" to="/login">Login here</Link>
                </p>
            </div>
        </div>
    );
}
