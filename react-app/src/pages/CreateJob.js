import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";

export default function CreateJob() {
    // 1. Updated variables to match Django's exact field names
    const [name, setName] = useState("");
    const [applyLink, setApplyLink] = useState("");
    
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // 2. Send the exact keys Django is looking for
            const response = await axios.post("/createJob/", {
                name: name,
                apply_link: applyLink
            });
            
            console.log("Job created successfully!", response.data);
            navigate("/"); 
            
        } catch (error) {
            console.error("Django says:", error.response?.data || error.message);
        }
    };

    return (
        <div>
            <h2>Create New Job Application</h2>
            
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Job or Company Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <input
                    type="url"
                    placeholder="Application Link (URL)"
                    value={applyLink}
                    onChange={(e) => setApplyLink(e.target.value)}
                    required
                />
                <button type="submit">Save Job</button>
            </form>
        </div>
    );
}