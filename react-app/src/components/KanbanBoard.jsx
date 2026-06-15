import { Link } from "react-router-dom";

export default function KanbanBoard({ jobs, onStatusChange }) {
    // 1. Define our columns and their matching Django boolean flags
    const columns = [
        { id: "is_applied", title: "Applied", bgColor: "#e3f2fd", borderColor: "#90caf9" },
        { id: "in_interview_process", title: "Interviewing", bgColor: "#fff8e1", borderColor: "#ffe082" },
        { id: "is_accepted", title: "Accepted 🎉", bgColor: "#e8f5e9", borderColor: "#a5d6a7" },
        { id: "is_rejected", title: "Rejected", bgColor: "#ffebee", borderColor: "#ef9a9a" }
    ];

    // 2. When you pick up a card, save its ID into the browser's drag memory
    const handleDragStart = (e, jobId) => {
        e.dataTransfer.setData("jobId", jobId);
    };

    // 3. When you drop it, read the ID and tell the Dashboard to update the database
    const handleDrop = (e, newStatus) => {
        const jobId = e.dataTransfer.getData("jobId");
        if (jobId) {
            onStatusChange(parseInt(jobId), newStatus);
        }
    };

    // 4. Required to allow dropping elements in HTML5
    const handleDragOver = (e) => {
        e.preventDefault(); 
    };

    if (!jobs || jobs.length === 0) {
        return <div style={{ textAlign: "center", padding: "20px" }}>No jobs to display on the board!</div>;
    }

    return (
        <div style={{ display: "flex", gap: "15px", overflowX: "auto", paddingBottom: "15px", marginTop: "20px", minHeight: "60vh" }}>
            {columns.map(col => (
                <div
                    key={col.id}
                    onDrop={(e) => handleDrop(e, col.id)}
                    onDragOver={handleDragOver}
                    style={{ 
                        flex: 1, 
                        minWidth: "260px", 
                        backgroundColor: col.bgColor, 
                        border: `2px solid ${col.borderColor}`, 
                        borderRadius: "8px", 
                        padding: "15px",
                        display: "flex",
                        flexDirection: "column"
                    }}
                >
                    <h3 style={{ textAlign: "center", marginTop: 0, color: "#333" }}>{col.title}</h3>
                    
                    <div style={{ display: "flex", flexDirection: "column", gap: "15px", flex: 1 }}>
                        {jobs.filter(job => job[col.id]).map(job => (
                            <div
                                key={job.id}
                                draggable
                                onDragStart={(e) => handleDragStart(e, job.id)}
                                style={{ 
                                    backgroundColor: "white", 
                                    padding: "15px", 
                                    borderRadius: "6px", 
                                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)", 
                                    cursor: "grab",
                                    borderLeft: `4px solid ${col.borderColor}`
                                }}
                            >
                                <h4 style={{ margin: "0 0 5px 0" }}>{job.name}</h4>
                                {job.company && job.company !== "Unknown" && (
                                    <p style={{ margin: "0 0 10px 0", fontSize: "0.9em", color: "#666" }}>🏢 {job.company}</p>
                                )}
                                
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "10px" }}>
                                    <span style={{ fontSize: "0.8em", color: "#888" }}>{job.is_remote ? "Remote" : "Office"}</span>
                                    <Link to={`/edit-job/${job.id}`} state={{ job }} style={{ fontSize: "0.85em", color: "#007bff", textDecoration: "none", fontWeight: "bold" }}>
                                        Edit
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}