import { Link } from "react-router-dom";
import "../styles/theme.css";

export default function KanbanBoard({ jobs, onStatusChange }) {
    const columns = [
        { id: "is_applied", title: "Applied", bg: "#eaf6ff", border: "var(--sky)" },
        { id: "in_interview_process", title: "Interviewing", bg: "#fff6e3", border: "var(--amber)" },
        { id: "is_accepted", title: "Accepted", bg: "#e6faf1", border: "var(--lime)" },
        { id: "is_rejected", title: "Rejected", bg: "#ffe9ed", border: "var(--coral)" }
    ];

    const handleDragStart = (e, jobId) => {
        e.dataTransfer.setData("jobId", String(jobId));
    };

    const handleDrop = (e, newStatus) => {
        const jobId = e.dataTransfer.getData("jobId");
        if (jobId) {
            onStatusChange(jobId, newStatus);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    if (!jobs || jobs.length === 0) {
        return <div style={{ textAlign: "center", padding: "20px", fontFamily: "var(--font-mono)", color: "var(--ink-soft)" }}>No jobs to display on the board!</div>;
    }

    return (
        <div style={{ display: "flex", gap: "15px", overflowX: "auto", paddingBottom: "15px", marginTop: "8px", minHeight: "60vh" }}>
            {columns.map(col => (
                <div
                    key={col.id}
                    onDrop={(e) => handleDrop(e, col.id)}
                    onDragOver={handleDragOver}
                    style={{
                        flex: 1,
                        minWidth: "260px",
                        backgroundColor: col.bg,
                        border: `2.5px solid ${col.border}`,
                        borderRadius: "16px",
                        padding: "14px",
                        display: "flex",
                        flexDirection: "column"
                    }}
                >
                    <h3 style={{
                        textAlign: "center",
                        marginTop: 0,
                        fontFamily: "var(--font-display)",
                        fontSize: "14px",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.02em",
                        color: "var(--ink)"
                    }}>
                        {col.title}
                    </h3>

                    <div style={{ display: "flex", flexDirection: "column", gap: "12px", flex: 1 }}>
                        {jobs.filter(job => job[col.id]).map(job => (
                            <div
                                key={job.id}
                                draggable
                                onDragStart={(e) => handleDragStart(e, job.id)}
                                style={{
                                    backgroundColor: "#fff",
                                    padding: "13px 14px",
                                    borderRadius: "12px",
                                    border: `2px solid ${col.border}`,
                                    boxShadow: `3px 3px 0 ${col.border}`,
                                    cursor: "grab"
                                }}
                            >
                                <h4 style={{ margin: "0 0 4px 0", fontFamily: "var(--font-display)", fontSize: "15.5px", fontWeight: 700, color: "var(--ink)" }}>{job.name}</h4>
                                {job.company && job.company !== "Unknown" && (
                                    <p style={{ margin: "0 0 8px 0", fontSize: "12px", fontFamily: "var(--font-mono)", color: "var(--ink-soft)" }}>{job.company}</p>
                                )}

                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "8px" }}>
                                    <span style={{ fontSize: "11px", fontFamily: "var(--font-mono)", color: "var(--ink-soft)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                                        {job.is_remote ? "Remote" : job.is_hybrid ? "Hybrid" : "Office"}
                                    </span>
                                    <Link to={`/edit-job/${job.id}`} state={{ job }} className="link-ink" style={{ fontSize: "12px" }}>
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
