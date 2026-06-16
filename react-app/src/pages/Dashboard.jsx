import { useState, useEffect } from "react";
import { getJobs, deleteJob, updateJob } from "../api/jobs"; 
import { Link } from "react-router-dom";
import StatsView from "../components/StatsView"; 
import KanbanBoard from "../components/KanbanBoard"; 

// --- 1. HIGH-FIDELITY DUMMY DATA ---
// These match your exact Django model schema so the Board and Stats views work natively.
const DUMMY_JOBS = [
    { id: 'demo1', name: 'Backend Engineer', company: 'Stark Industries', apply_link: '#', notes: 'Using Python & Django', day_work_duration: 5, is_remote: true, is_hybrid: false, is_applied: true, in_interview_process: false, is_accepted: false, is_rejected: false, is_no_response: false, on_hold: false },
    { id: 'demo2', name: 'DevOps Intern', company: 'Wayne Enterprises', apply_link: '#', notes: 'Docker and AWS focus', day_work_duration: 4, is_remote: false, is_hybrid: true, is_applied: false, in_interview_process: true, is_accepted: false, is_rejected: false, is_no_response: false, on_hold: false },
    { id: 'demo3', name: 'Full-Stack Developer', company: 'Cyberdyne Systems', apply_link: '#', notes: 'React + Node', day_work_duration: 5, is_remote: true, is_hybrid: false, is_applied: false, in_interview_process: true, is_accepted: false, is_rejected: false, is_no_response: false, on_hold: false },
    { id: 'demo4', name: 'Software Engineer', company: 'Oscorp', apply_link: '#', notes: 'Great benefits', day_work_duration: 5, is_remote: false, is_hybrid: false, is_applied: false, in_interview_process: false, is_accepted: true, is_rejected: false, is_no_response: false, on_hold: false },
    { id: 'demo5', name: 'Cloud Architect', company: 'Umbrella Corp', apply_link: '#', notes: 'Requires clearance', day_work_duration: 5, is_remote: true, is_hybrid: false, is_applied: false, in_interview_process: false, is_accepted: false, is_rejected: true, is_no_response: false, on_hold: false }
];

export default function Dashboard() {
    const [jobs, setJobs] = useState([]); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
    const [sortBy, setSortBy] = useState("newest");
    const [viewMode, setViewMode] = useState("list"); 

    // --- 2. NEW DEMO MODE STATE ---
    const [isDemoMode, setIsDemoMode] = useState(false);

    useEffect(() => {
        // Check if user is actually logged in
        const token = localStorage.getItem("token"); // Adjust this key if you named your token differently!

        if (!token) {
            // Guest Mode: Load dummy data instantly
            setJobs(DUMMY_JOBS);
            setIsDemoMode(true);
            setLoading(false);
        } else {
            // Authenticated Mode: Fetch real data
            fetchJobs();
        }
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

        // If in demo mode, just delete it locally from the screen
        if (isDemoMode) {
            setJobs(jobs.filter(job => job.id !== id));
            return;
        }

        try {
            await deleteJob(id);
            setJobs(jobs.filter(job => job.id !== id));
        } catch (err) {
            alert("Failed to delete job.");
        }
    };

    const handleStatusChange = async (jobId, newStatusFlag) => {
        const jobToUpdate = jobs.find(j => j.id === jobId);
        if (!jobToUpdate) return;

        const updatedJobData = {
            ...jobToUpdate, 
            on_hold: false,
            is_applied: false,
            in_interview_process: false,
            is_accepted: false,
            is_rejected: false,
            is_no_response: false,
            [newStatusFlag]: true 
        };

        // Instantly update the UI
        setJobs(jobs.map(job => job.id === jobId ? updatedJobData : job));

        // IMPORTANT: Prevent guests from sending API requests to Render
        if (isDemoMode) return; 

        try {
            await updateJob(jobId, updatedJobData);
        } catch (err) {
            console.error("Failed to save move:", err);
            alert("Failed to save that move to the database. Reverting!");
            fetchJobs(); 
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

    const processedJobs = jobs
        .filter((job) => {
            if (searchQuery && !job.name.toLowerCase().includes(searchQuery.toLowerCase())) {
                return false;
            }
            if (filterStatus !== "all") {
                if (!job[filterStatus]) return false;
            }
            return true;
        })
        .sort((a, b) => {
            if (sortBy === "newest") return b.id - a.id;
            if (sortBy === "oldest") return a.id - b.id;
            if (sortBy === "name_asc") return a.name.localeCompare(b.name);
            if (sortBy === "name_desc") return b.name.localeCompare(a.name);
            return 0;
        });

    if (loading) return <div style={{ padding: "20px", textAlign: "center" }}>Loading your jobs...</div>;
    if (error) return <div style={{ padding: "20px", color: "red", textAlign: "center" }}>{error}</div>;

    return (
        <div style={{ padding: "20px", maxWidth: "1000px", margin: "0 auto" }}>
            
            {/* --- 3. THE GUEST BANNER --- */}
            {isDemoMode && (
                <div style={{
                    backgroundColor: '#fff3cd',
                    color: '#856404',
                    padding: '12px 15px',
                    textAlign: 'center',
                    fontWeight: 'bold',
                    border: '1px solid #ffeeba',
                    marginBottom: '20px',
                    borderRadius: '6px'
                }}>
                    👋 You are viewing the demo sandbox. 
                    <Link to="/login" style={{ color: '#533f03', marginLeft: '10px', textDecoration: 'underline' }}>Log in</Link> or 
                    <Link to="/register" style={{ color: '#533f03', marginLeft: '5px', textDecoration: 'underline' }}>Register</Link> to save your own applications!
                </div>
            )}

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <h2 style={{ margin: 0 }}>Your Job Applications</h2>
                {/* Hide the Add button if they are a guest so they don't try to add to the fake DB */}
                {!isDemoMode && (
                    <Link to="/create-job" style={{ backgroundColor: "#007bff", color: "white", padding: "10px 15px", textDecoration: "none", borderRadius: "5px", fontWeight: "bold" }}>
                        + Add New Job
                    </Link>
                )}
            </div>

            {jobs.length > 0 && (
                <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
                    <button onClick={() => setViewMode("list")} style={{ padding: "8px 16px", cursor: "pointer", border: "1px solid #ccc", borderRadius: "4px", backgroundColor: viewMode === "list" ? "#007bff" : "white", color: viewMode === "list" ? "white" : "black", fontWeight: "bold" }}>
                        📝 List View
                    </button>
                    <button onClick={() => setViewMode("board")} style={{ padding: "8px 16px", cursor: "pointer", border: "1px solid #ccc", borderRadius: "4px", backgroundColor: viewMode === "board" ? "#007bff" : "white", color: viewMode === "board" ? "white" : "black", fontWeight: "bold" }}>
                        📌 Board View
                    </button>
                    <button onClick={() => setViewMode("stats")} style={{ padding: "8px 16px", cursor: "pointer", border: "1px solid #ccc", borderRadius: "4px", backgroundColor: viewMode === "stats" ? "#007bff" : "white", color: viewMode === "stats" ? "white" : "black", fontWeight: "bold" }}>
                        📊 Analytics
                    </button>
                </div>
            )}
            
            {viewMode === "stats" ? (
                <StatsView jobs={jobs} />
            ) : viewMode === "board" ? (
                <KanbanBoard jobs={jobs} onStatusChange={handleStatusChange} />
            ) : (
                <>
                    {jobs.length > 0 && (
                        <div style={{ display: "flex", gap: "10px", marginBottom: "20px", flexWrap: "wrap", backgroundColor: "#f8f9fa", padding: "15px", borderRadius: "8px", border: "1px solid #ddd" }}>
                            <input type="text" placeholder="Search jobs..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ flex: 2, padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }} />
                            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} style={{ flex: 1, padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}>
                                <option value="all">All Statuses</option>
                                <option value="is_applied">Applied</option>
                                <option value="in_interview_process">Interviewing</option>
                                <option value="is_accepted">Accepted</option>
                                <option value="is_rejected">Rejected</option>
                                <option value="is_no_response">No Response</option>
                                <option value="on_hold">On Hold</option>
                            </select>
                            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={{ flex: 1, padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}>
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
                            {processedJobs.map((job) => (
                                <div key={job.id} style={{ border: "1px solid #ccc", padding: "15px", borderRadius: "8px", position: "relative", backgroundColor: "white" }}>
                                    <div style={{ position: "absolute", top: "15px", right: "15px" }}>
                                        {getStatusBadge(job)}
                                    </div>
                                    <h3 style={{ marginTop: 0, paddingRight: "100px" }}>{job.name} {job.company && job.company !== "Unknown" ? `at ${job.company}` : ""}</h3>
                                    <p style={{ margin: "5px 0" }}><strong>Type:</strong> {getWorkType(job)}</p>
                                    <p style={{ margin: "5px 0" }}><strong>Duration:</strong> {job.day_work_duration} days</p>
                                    
                                    {job.notes && (
                                        <div style={{ margin: "10px 0", padding: "10px", backgroundColor: "#f8f9fa", borderRadius: "4px", fontSize: "0.9em", borderLeft: "3px solid #ccc" }}>
                                            <strong>Notes:</strong> {job.notes}
                                        </div>
                                    )}

                                    <p style={{ margin: "5px 0 15px 0" }}>
                                        <strong>Link: </strong> 
                                        <a href={job.apply_link} target="_blank" rel="noopener noreferrer" style={{ color: "#007bff" }}>View Application</a>
                                    </p>

                                    <div style={{ marginTop: "15px" }}>
                                        {/* Disabled edit/delete visually for guests so they aren't confused */}
                                        {!isDemoMode && (
                                            <Link to={`/edit-job/${job.id}`} state={{ job: job }} style={{ backgroundColor: "#ffc107", color: "black", textDecoration: "none", padding: "6px 12px", borderRadius: "4px", marginRight: "10px", fontSize: "14px" }}>Edit</Link>
                                        )}
                                        <button onClick={() => handleDelete(job.id)} style={{ backgroundColor: "#ff4d4f", color: "white", border: "none", padding: "6px 12px", cursor: "pointer", borderRadius: "4px", fontSize: "14px" }}>Delete</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}