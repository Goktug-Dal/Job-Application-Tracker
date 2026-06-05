import { useEffect, useState } from "react";
import axios from "axios";

export default function Dashboard() {

    const [jobs, setJobs] = useState([]);

    useEffect(() => {

        const fetchJobs = async () => {

            const token =
                localStorage.getItem("access");

            const response =
                await axios.get(
                    "http://127.0.0.1:8000/api/jobs/",
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`
                        }
                    }
                );

            setJobs(response.data);
        };

        fetchJobs();

    }, []);

    return (
        <div>
            <h1>My Applications</h1>

            {jobs.map(job => (
                <div key={job.id}>
                    <h3>{job.name}</h3>

                    <p>
                        Status:
                        {" "}
                        {job.status}
                    </p>

                    <p>
                        Type:
                        {" "}
                        {job.work_type}
                    </p>

                    <a href={job.apply_link}>
                        Open Listing
                    </a>
                </div>
            ))}
        </div>
    );
}