import { useState, useEffect } from "react";
import { getJobs, deleteJob } from "../api/jobs";
import { Link } from "react-router-dom";

export default function Dashboard() {
    const [jobs, setJobs] = useState([]); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // --- NEW: Search, Filter, and Sort States ---
    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
    const [sortBy, setSortBy] = useState("newest");

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            const data = await getJobs();
            setJobs(data); 
            setLoading(false);
        } catch (err) {
            console.error("Error fetching jobs:", err);
            setError("Failed to load jobs.");
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this job?");
        if (!confirmDelete) return;

        try {
            await deleteJob(id);
            setJobs(jobs.filter(job => job.id !== id));
        } catch (err) {
            alert("Failed to delete job.");
        }
    };

    const getStatusBadge = (job) => {
        if (job.is_accepted) return <span style={{ backgroundColor: "#d4edda", color: "#155724", padding: "4px 8px", borderRadius: "4px", fontSize: "0.9em" }}>Accepted 🎉</span>;
        if (job.is_rejected) return <span style={{ backgroundColor: "#f8d7da", color: "#721c24", padding: "4px 8px", borderRadius: "4px", fontSize: "0.9em" }}>Rejected</span>;
        if (job.in_interview_process) return <span style={{ backgroundColor: "#fff3cd", color: "#856404", padding: "4px 8px", borderRadius: "4px", fontSize: "0.9em" }}>Interviewing</span>;
        if (job.is_applied) return <span style={{ backgroundColor: "#cce5ff", color: "#004085", padding: "4px 8px", borderRadius: "4px", fontSize: "0.9em" }}>Applied</span>;
        if (job.is_no_response) return <span style={{ backgroundColor: "#e2e3e5", color: "#383d41", padding: "4px 8px", borderRadius: "4px", fontSize: "0.9em" }}>No Response</span>;
        return <span style={{ backgroundColor: "#e2e3e5", color: "#383d41", padding: "4px 8px", borderRadius: "4px", fontSize: "0.9em" }}>On Hold</span>;
    };

    const getWorkType = (job) => {
        if (job.is_remote) return "Remote";
        if (job.is_hybrid) return "Hybrid";
        return "Office";
    };

    // --- NEW: The Processing Engine ---
    // This runs instantly every time you type or click a dropdown
    const processedJobs = jobs
        .filter((job) => {
            // 1. Search by Name
            if (searchQuery && !job.name.toLowerCase().includes(searchQuery.toLowerCase())) {
                return false;
            }
            
            // 2. Filter by Status
            if (filterStatus !== "all") {
                // If filterStatus is "is_rejected", this checks if job.is_rejected === true
                if (!job[filterStatus]) return false;
            }
            
            return true;
        })
        .sort((a, b) => {
            // 3. Sort the results
            if (sortBy === "newest") return b.id - a.id; // Higher ID means created more recently
            if (sortBy === "oldest") return a.id - b.id;
            if (sortBy === "name_asc") return a.name.localeCompare(b.name);
            if (sortBy === "name_desc") return b.name.localeCompare(a.name);
            return 0;
        });

    if (loading) return <div style={{ padding: "20px", textAlign: "center" }}>Loading your jobs...</div>;
    if (error) return <div style={{ padding: "20px", color: "red", textAlign: "center" }}>{error}</div>;

    return (
        <div style={{ padding: "20px", maxWidth: "700px", margin: "0 auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <h2 style={{ margin: 0 }}>Your Job Applications</h2>
                <Link to="/create-job" style={{ backgroundColor: "#007bff", color: "white", padding: "10px 15px", textDecoration: "none", borderRadius: "5px", fontWeight: "bold" }}>
                    + Add New Job
                </Link>
            </div>
            
            {/* --- NEW: Controls UI --- */}
            {jobs.length > 0 && (
                <div style={{ display: "flex", gap: "10px", marginBottom: "20px", flexWrap: "wrap", backgroundColor: "#f8f9fa", padding: "15px", borderRadius: "8px", border: "1px solid #ddd" }}>
                    
                    <input 
                        type="text" 
                        placeholder="Search jobs..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{ flex: 2, padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
                    />

                    <select 
                        value={filterStatus} 
                        onChange={(e) => setFilterStatus(e.target.value)}
                        style={{ flex: 1, padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
                    >
                        <option value="all">All Statuses</option>
                        <option value="is_applied">Applied</option>
                        <option value="in_interview_process">Interviewing</option>
                        <option value="is_accepted">Accepted</option>
                        <option value="is_rejected">Rejected</option>
                        <option value="is_no_response">No Response</option>
                        <option value="on_hold">On Hold</option>
                    </select>

                    <select 
                        value={sortBy} 
                        onChange={(e) => setSortBy(e.target.value)}
                        style={{ flex: 1, padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
                    >
                        <option value="newest">Newest First</option>
                        <option value="oldest">Oldest First</option>
                        <option value="name_asc">Name (A-Z)</option>
                        <option value="name_desc">Name (Z-A)</option>
                    </select>
                </div>
            )}

            {processedJobs.length === 0 ? (
                <p>No jobs found matching those filters.</p>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                    {/* Notice we map over processedJobs now, not jobs! */}
                    {processedJobs.map((job) => (
                        <div key={job.id} style={{ border: "1px solid #ccc", padding: "15px", borderRadius: "8px", position: "relative", backgroundColor: "white" }}>
                            
                            <div style={{ position: "absolute", top: "15px", right: "15px" }}>
                                {getStatusBadge(job)}
                            </div>

                            <h3 style={{ marginTop: 0, paddingRight: "100px" }}>{job.name}</h3>
                            
                            <p style={{ margin: "5px 0" }}><strong>Type:</strong> {getWorkType(job)}</p>
                            <p style={{ margin: "5px 0" }}><strong>Duration:</strong> {job.day_work_duration} days</p>
                            
                            <p style={{ margin: "5px 0 15px 0" }}>
                                <strong>Link: </strong> 
                                <a href={job.apply_link} target="_blank" rel="noopener noreferrer" style={{ color: "#007bff" }}>
                                    View Application
                                </a>
                            </p>

                            <div style={{ marginTop: "15px" }}>
                                <Link 
                                    to={`/edit-job/${job.id}`} 
                                    state={{ job: job }} 
                                    style={{ backgroundColor: "#ffc107", color: "black", textDecoration: "none", padding: "6px 12px", borderRadius: "4px", marginRight: "10px", fontSize: "14px" }}
                                >
                                    Edit
                                </Link>

                                <button 
                                    onClick={() => handleDelete(job.id)}
                                    style={{ backgroundColor: "#ff4d4f", color: "white", border: "none", padding: "6px 12px", cursor: "pointer", borderRadius: "4px", fontSize: "14px" }}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}