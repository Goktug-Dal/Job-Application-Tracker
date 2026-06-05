import { useState } from "react";
import axios from "axios";

export default function Register() {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const registerUser = async (e) => {
        e.preventDefault();

        await axios.post(
            "http://127.0.0.1:8000/api/register/",
            {
                username,
                password
            }
        );

        alert("Account created");
    };

    return (
        <form onSubmit={registerUser}>
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

            <button>Register</button>
        </form>
    );
}