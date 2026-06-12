import { useEffect, useState } from "react";

// 🚨 CRITICAL: This must point to your custom file!
// If your custom file is in the same folder, use "./axios"
// If it is in an api folder, use "./api/axios"
import axios from "../api/axios"; 

export default function Dashboard() {
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                // Because of your custom axios baseURL, this will hit http://127.0.0.1:8000/api/getAll/
                const response = await axios.get("/getAll/");
                setData(response.data);
            } catch (error) {
                console.error("Failed to fetch data:", error);
            }
        };

        fetchAllData();
    }, []);

    return (
        <div>
            <h2>Dashboard</h2>
            <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
    );
}