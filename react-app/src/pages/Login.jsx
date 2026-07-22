import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";
import "../styles/theme.css";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();

    const loginUser = async (e) => {
        e.preventDefault();
        setError(null);
        setSubmitting(true);

        try {
            const response = await api.post("token/", { username, password });

            localStorage.setItem("access", response.data.access);
            localStorage.setItem("refresh", response.data.refresh);

            navigate("/");
        } catch (err) {
            if (!err.response) {
                setError("Can't reach the server. Check your connection and try again.");
            } else {
                setError("Invalid username or password.");
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="dossier-shell">
            <div className="dossier-card">
                <p className="dossier-eyebrow">Case File Access</p>
                <h2 className="dossier-title">Log In</h2>
                {error && <p className="error-strip">{error}</p>}

                <form onSubmit={loginUser}>
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
                    <button type="submit" className="btn btn-primary" disabled={submitting}>
                        {submitting ? "Logging in…" : "Log In"}
                    </button>
                </form>

                <p className="footnote">
                    Don't have an account? <Link className="link-ink" to="/register">Register here</Link>
                </p>
            </div>
        </div>
    );
}