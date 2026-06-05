import { Link } from "react-router-dom";

export default function Navbar({ user }) {
    return (
        <nav className="navbar">
            <h2>Job Tracker</h2>

            <div>
                {user ? (
                    <span>Welcome, {user.username}</span>
                ) : (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/register">Register</Link>
                    </>
                )}
            </div>
        </nav>
    );
}