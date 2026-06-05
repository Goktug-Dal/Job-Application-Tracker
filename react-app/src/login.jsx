import { useState } from "react";
import axios from "axios";

export default function Login() {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await axios.post(
            "http://127.0.0.1:8000/api/token/",
            {
                username,
                password
            }
        );

        localStorage.setItem(
            "access",
            response.data.access
        );

        localStorage.setItem(
            "refresh",
            response.data.refresh
        );
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                placeholder="Username"
                value={username}
                onChange={(e) =>
                    setUsername(e.target.value)
                }
            />

            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) =>
                    setPassword(e.target.value)
                }
            />

            <button>Login</button>
        </form>
    );
}