import { Link, useNavigate, useLocation } from "react-router-dom";
import "../styles/theme.css";

export default function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();

    const isAuthenticated = !!localStorage.getItem("access");

    const handleLogout = () => {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        navigate("/login");
    };

    return (
        <nav
            style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "14px 28px",
                backgroundColor: "var(--ink)",
                borderBottom: "3px solid var(--brand)",
            }}
        >
            <Link
                to="/"
                style={{
                    textDecoration: "none",
                    color: "#ffffff",
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: "20px",
                    letterSpacing: "0.01em",
                }}
            >
                Job Tracker
            </Link>

            <div style={{ display: "flex", alignItems: "center", gap: "18px", fontFamily: "var(--font-display)", fontSize: "13px", fontWeight: 700, letterSpacing: "0.02em" }}>
                {isAuthenticated ? (
                    <>
                        <Link
                            to="/"
                            style={{
                                color: location.pathname === "/" ? "#8b7cff" : "#ffffff",
                                textDecoration: "none",
                            }}
                        >
                            Dashboard
                        </Link>
                        <button
                            onClick={handleLogout}
                            style={{
                                background: "transparent",
                                border: "2px solid #ff9daf",
                                color: "#ff9daf",
                                borderRadius: "8px",
                                padding: "7px 14px",
                                fontFamily: "var(--font-display)",
                                fontSize: "12.5px",
                                fontWeight: 700,
                                cursor: "pointer",
                            }}
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login" style={{ color: "#ffffff", textDecoration: "none" }}>
                            Login
                        </Link>
                        <Link
                            to="/register"
                            style={{
                                backgroundColor: "var(--brand)",
                                color: "#ffffff",
                                textDecoration: "none",
                                padding: "8px 16px",
                                borderRadius: "8px",
                            }}
                        >
                            Register
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
}
