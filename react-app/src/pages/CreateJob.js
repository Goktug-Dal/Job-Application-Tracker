import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createJob } from "../api/jobs";
import "../styles/theme.css";

export default function CreateJob() {
    const [name, setName] = useState("");
    const [applyLink, setApplyLink] = useState("");
    const [status, setStatus] = useState("on_hold");
    const [workType, setWorkType] = useState("is_office");
    const [duration, setDuration] = useState(0);
    const [company, setCompany] = useState("");
    const [notes, setNotes] = useState("");

    const [error, setError] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSubmitting(true);

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
            await createJob(jobData);
            navigate("/");
        } catch (err) {
            console.error("Failed to create job:", err);
            setError(err.response?.data ? JSON.stringify(err.response.data) : "Something went wrong.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="dossier-shell">
            <div className="dossier-card">
                <p className="dossier-eyebrow">New Entry</p>
                <h2 className="dossier-title">Log a Job</h2>
                {error && <p className="error-strip">{error}</p>}

                <form onSubmit={handleSubmit}>
                    <div className="field-group">
                        <label className="field-label">Job Name</label>
                        <input className="field-input" value={name} onChange={(e) => setName(e.target.value)} required />
                    </div>

                    <div className="field-group">
                        <label className="field-label">Company</label>
                        <input className="field-input" value={company} onChange={(e) => setCompany(e.target.value)} required />
                    </div>

                    <div className="field-group">
                        <label className="field-label">Application Link</label>
                        <input className="field-input" type="url" value={applyLink} onChange={(e) => setApplyLink(e.target.value)} required placeholder="https://..." />
                    </div>

                    <div className="field-group">
                        <label className="field-label">Interview Notes / Details</label>
                        <textarea className="field-textarea" value={notes} onChange={(e) => setNotes(e.target.value)} rows="4" />
                    </div>

                    <div className="field-group">
                        <label className="field-label">Job Status</label>
                        <select className="field-select" value={status} onChange={(e) => setStatus(e.target.value)}>
                            <option value="on_hold">On Hold (May apply later)</option>
                            <option value="is_applied">Applied</option>
                            <option value="in_interview_process">In Interview Process</option>
                            <option value="is_accepted">Accepted / Offer Received</option>
                            <option value="is_rejected">Rejected</option>
                            <option value="is_no_response">No Response</option>
                        </select>
                    </div>

                    <div className="field-row">
                        <div className="field-group">
                            <label className="field-label">Work Type</label>
                            <select className="field-select" value={workType} onChange={(e) => setWorkType(e.target.value)}>
                                <option value="is_office">Office</option>
                                <option value="is_remote">Remote</option>
                                <option value="is_hybrid">Hybrid</option>
                            </select>
                        </div>

                        <div className="field-group">
                            <label className="field-label">Duration (Days)</label>
                            <input className="field-input" type="number" min="0" value={duration} onChange={(e) => setDuration(e.target.value)} />
                        </div>
                    </div>

                    <button type="submit" className="btn btn-accept" disabled={submitting}>
                        {submitting ? "Saving…" : "Save Job"}
                    </button>
                </form>
            </div>
        </div>
    );
}
