import { Link, useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
    const navigate = useNavigate();
    // useLocation forces the Navbar to re-render and check the token whenever the page changes
    const location = useLocation(); 
    
    // Check if the user is currently logged in by looking for the token
    const isAuthenticated = !!localStorage.getItem("access");

    const handleLogout = () => {
        // 1. Remove the tokens to log them out
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        
        // 2. Kick them back to the login page
        navigate("/login");
    };

    return (
        <nav style={{ 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center", 
            padding: "15px 30px", 
            backgroundColor: "#2c3e50", // Dark sleek background
            color: "white",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
        }}>
            {/* LEFT SIDE: Logo / App Name */}
            <h2 style={{ margin: 0 }}>
                <Link to="/" style={{ textDecoration: "none", color: "white" }}>
                    💼 Job Tracker
                </Link>
            </h2>

            {/* RIGHT SIDE: Auth Links */}
            <div>
                {isAuthenticated ? (
                    <>
                        <Link to="/" style={{ color: "white", textDecoration: "none", marginRight: "20px", fontWeight: "bold" }}>
                            Dashboard
                        </Link>
                        <button 
                            onClick={handleLogout} 
                            style={{ backgroundColor: "#e74c3c", color: "white", border: "none", padding: "8px 16px", borderRadius: "5px", cursor: "pointer", fontWeight: "bold" }}
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login" style={{ color: "white", textDecoration: "none", marginRight: "20px", fontWeight: "bold" }}>
                            Login
                        </Link>
                        <Link to="/register" style={{ backgroundColor: "#27ae60", color: "white", textDecoration: "none", padding: "8px 16px", borderRadius: "5px", fontWeight: "bold" }}>
                            Register
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
}