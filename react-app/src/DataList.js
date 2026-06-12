import { useEffect, useState } from "react";
import axios from "./api/axios"; // Uses YOUR custom axios instance

export default function DataList() {
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const response = await axios.get("/getAll/");
                setData(response.data);
            } catch (error) {
                console.error("Failed to fetch data:", error);
            }
        };

        fetchJobs();
    }, []);

    return (
        <div>
            <h2>Data List</h2>
            <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
    );
}