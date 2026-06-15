import { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { updateJob } from "../api/jobs";

export default function EditJob() {
    const navigate = useNavigate();
    const location = useLocation();
    const { id } = useParams();

    // Grab the current job data passed through the routing state
    const job = location.state?.job;

    // Helper to extract the initial dropdown status from backend boolean flags
    const getInitialStatus = () => {
        if (!job) return "on_hold";
        if (job.is_accepted) return "is_accepted";
        if (job.is_rejected) return "is_rejected";
        if (job.in_interview_process) return "in_interview_process";
        if (job.is_applied) return "is_applied";
        if (job.is_no_response) return "is_no_response";
        return "on_hold";
    };

    // Helper to extract the initial work type selection
    const getInitialWorkType = () => {
        if (!job) return "is_office";
        if (job.is_remote) return "is_remote";
        if (job.is_hybrid) return "is_hybrid";
        return "is_office";
    };

    // Initialize all states with pre-existing job parameters
    const [name, setName] = useState(job?.name || "");
    const [company, setCompany] = useState(job?.company || "");
    const [applyLink, setApplyLink] = useState(job?.apply_link || "");
    const [notes, setNotes] = useState(job?.notes || "");
    const [status, setStatus] = useState(getInitialStatus());
    const [workType, setWorkType] = useState(getInitialWorkType());
    const [duration, setDuration] = useState(job?.day_work_duration || 0);
    const [error, setError] = useState(null);

    // Safety net: Redirect back if page is accessed directly without state data
    useEffect(() => {
        if (!job) navigate("/");
    }, [job, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        // Package the data mapping choices back into explicit flags for Django
        const jobData = {
            name: name,
            company: company,
            apply_link: applyLink,
            notes: notes,
            day_work_duration: duration,
            on_hold: status === "on_hold",
            is_applied: status === "is_applied",
            in_interview_process: status === "in_interview_process",
            is_accepted: status === "is_accepted",
            is_rejected: status === "is_rejected",
            is_no_response: status === "is_no_response",
            is_office: workType === "is_office",
            is_remote: workType === "is_remote",
            is_hybrid: workType === "is_hybrid"
        };

        try {
            await updateJob(id, jobData);
            navigate("/"); 
        } catch (err) {
            console.error("Failed to update job:", err);
            setError(err.response?.data ? JSON.stringify(err.response.data) : "Something went wrong.");
        }
    };

    if (!job) return null; 

    return (
        <div style={{ padding: "20px", maxWidth: "400px", margin: "0 auto" }}>
            <h2>Edit Job Application</h2>
            {error && <p style={{ color: "red", backgroundColor: "#ffe6e6", padding: "10px", borderRadius: "5px" }}>{error}</p>}

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                <div>
                    <label>Job Name</label><br />
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} required style={{ width: "100%", padding: "8px" }} />
                </div>

                <div>
                    <label>Company</label><br />
                    <input type="text" value={company} onChange={(e) => setCompany(e.target.value)} required style={{ width: "100%", padding: "8px" }} />
                </div>

                <div>
                    <label>Application Link</label><br />
                    <input type="url" value={applyLink} onChange={(e) => setApplyLink(e.target.value)} required style={{ width: "100%", padding: "8px" }} />
                </div>

                <div>
                    <label>Interview Notes / Details</label><br />
                    <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows="4" style={{ width: "100%", padding: "8px", resize: "vertical" }} />
                </div>

                <div>
                    <label>Job Status</label><br />
                    <select value={status} onChange={(e) => setStatus(e.target.value)} style={{ width: "100%", padding: "8px" }}>
                        <option value="on_hold">On Hold (May apply later)</option>
                        <option value="is_applied">Applied</option>
                        <option value="in_interview_process">In Interview Process</option>
                        <option value="is_accepted">Accepted / Offer Received</option>
                        <option value="is_rejected">Rejected</option>
                        <option value="is_no_response">No Response</option>
                    </select>
                </div>

                <div style={{ display: "flex", gap: "10px" }}>
                    <div style={{ flex: 1 }}>
                        <label>Work Type</label><br />
                        <select value={workType} onChange={(e) => setWorkType(e.target.value)} style={{ width: "100%", padding: "8px" }}>
                            <option value="is_office">Office</option>
                            <option value="is_remote">Remote</option>
                            <option value="is_hybrid">Hybrid</option>
                        </select>
                    </div>

                    <div style={{ flex: 1 }}>
                        <label>Duration (Days)</label><br />
                        <input type="number" min="0" value={duration} onChange={(e) => setDuration(e.target.value)} style={{ width: "100%", padding: "8px" }} />
                    </div>
                </div>

                <button type="submit" style={{ backgroundColor: "#007bff", color: "white", padding: "10px", border: "none", borderRadius: "5px", cursor: "pointer", fontWeight: "bold", marginTop: "10px" }}>
                    Update Job
                </button>
            </form>
        </div>
    );
}