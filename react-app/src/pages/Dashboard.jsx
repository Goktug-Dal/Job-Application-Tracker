import { useState, useEffect } from "react";
import { getJobs, deleteJob, updateJob } from "../api/jobs";
import { Link } from "react-router-dom";
import StatsView from "../components/StatsView";
import KanbanBoard from "../components/KanbanBoard";
import "../styles/theme.css";

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
    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
    const [sortBy, setSortBy] = useState("newest");
    const [viewMode, setViewMode] = useState("list");
    const [isDemoMode, setIsDemoMode] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("access");

        if (!token) {
            setJobs(DUMMY_JOBS);
            setIsDemoMode(true);
            setLoading(false);
        } else {
            fetchJobs();
        }
    }, []);

    const fetchJobs = async () => {
        try {
            const data = await getJobs();
            setJobs(data);
            setIsDemoMode(false);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching real jobs:", err);
            setJobs(DUMMY_JOBS);
            setIsDemoMode(true);
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this job?");
        if (!confirmDelete) return;

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
        // Compare as strings: real job IDs are numbers, demo IDs are strings
        // like 'demo1', and drag events only ever hand back a string anyway.
        const jobToUpdate = jobs.find(j => String(j.id) === String(jobId));
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

        setJobs(jobs.map(job => job.id === jobId ? updatedJobData : job));

        if (isDemoMode) return;

        try {
            await updateJob(jobId, updatedJobData);
        } catch (err) {
            console.error("Failed to save move:", err);
            alert("Failed to save to database. Reverting!");
            fetchJobs();
        }
    };

    const getStatusInfo = (job) => {
        if (job.is_accepted) return { label: "Accepted", cls: "accepted", folderCls: "status-accepted" };
        if (job.is_rejected) return { label: "Rejected", cls: "rejected", folderCls: "status-rejected" };
        if (job.in_interview_process) return { label: "Interviewing", cls: "interview", folderCls: "status-interview" };
        if (job.is_applied) return { label: "Applied", cls: "applied", folderCls: "status-applied" };
        if (job.is_no_response) return { label: "No Response", cls: "noresponse", folderCls: "status-noresponse" };
        return { label: "On Hold", cls: "hold", folderCls: "status-hold" };
    };

    const getWorkType = (job) => {
        if (job.is_remote) return "Remote";
        if (job.is_hybrid) return "Hybrid";
        return "Office";
    };

    // Keep each job's original position so sorting has a stable fallback
    // when IDs aren't sequential numbers (e.g. demo data, UUIDs).
    const jobsWithIndex = jobs.map((job, index) => ({ job, index }));

    const processedJobs = jobsWithIndex
        .filter(({ job }) => {
            if (searchQuery && !job.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
            if (filterStatus !== "all" && !job[filterStatus]) return false;
            return true;
        })
        .sort((a, b) => {
            const numA = Number(a.job.id);
            const numB = Number(b.job.id);
            const bothNumeric = !Number.isNaN(numA) && !Number.isNaN(numB);

            if (sortBy === "newest") {
                return bothNumeric ? numB - numA : b.index - a.index;
            }
            if (sortBy === "oldest") {
                return bothNumeric ? numA - numB : a.index - b.index;
            }
            if (sortBy === "name_asc") return a.job.name.localeCompare(b.job.name);
            if (sortBy === "name_desc") return b.job.name.localeCompare(a.job.name);
            return 0;
        })
        .map(({ job }) => job);

    if (loading) return <div style={{ padding: "40px", textAlign: "center", fontFamily: "var(--font-mono)" }}>Loading your jobs…</div>;

    return (
        <div className="dash-shell">

            {isDemoMode && (
                <div className="demo-banner">
                    You're viewing the demo sandbox.{" "}
                    <Link className="link-ink" to="/login">Log in</Link> or{" "}
                    <Link className="link-ink" to="/register">Register</Link> to save your own applications.
                </div>
            )}

            <div className="dash-header">
                <div>
                    <p className="dash-subtitle">Job Search Dossier</p>
                    <h2 className="dash-title">Your Applications</h2>
                </div>
                {!isDemoMode && (
                    <Link to="/create-job" className="add-job-btn">+ Add New Job</Link>
                )}
            </div>

            {jobs.length > 0 && (
                <div className="view-tabs">
                    <button className={`view-tab ${viewMode === "list" ? "active" : ""}`} onClick={() => setViewMode("list")}>List</button>
                    <button className={`view-tab ${viewMode === "board" ? "active" : ""}`} onClick={() => setViewMode("board")}>Board</button>
                    <button className={`view-tab ${viewMode === "stats" ? "active" : ""}`} onClick={() => setViewMode("stats")}>Analytics</button>
                </div>
            )}

            {viewMode === "stats" ? (
                <StatsView jobs={jobs} />
            ) : viewMode === "board" ? (
                <KanbanBoard jobs={jobs} onStatusChange={handleStatusChange} />
            ) : (
                <>
                    {jobs.length > 0 && (
                        <div className="control-strip">
                            <input
                                className="field-input"
                                type="text"
                                placeholder="Search jobs…"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <select className="field-select" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                                <option value="all">All Statuses</option>
                                <option value="is_applied">Applied</option>
                                <option value="in_interview_process">Interviewing</option>
                                <option value="is_accepted">Accepted</option>
                                <option value="is_rejected">Rejected</option>
                                <option value="is_no_response">No Response</option>
                                <option value="on_hold">On Hold</option>
                            </select>
                            <select className="field-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                                <option value="newest">Newest First</option>
                                <option value="oldest">Oldest First</option>
                                <option value="name_asc">Name (A-Z)</option>
                                <option value="name_desc">Name (Z-A)</option>
                            </select>
                        </div>
                    )}

                    {processedJobs.length === 0 ? (
                        <p style={{ fontFamily: "var(--font-mono)", color: "var(--ink-soft)" }}>No jobs found matching those filters.</p>
                    ) : (
                        <div>
                            {processedJobs.map((job) => {
                                const statusInfo = getStatusInfo(job);
                                return (
                                    <div key={job.id} className={`job-folder ${statusInfo.folderCls}`}>
                                        <span className={`badge-stamp ${statusInfo.cls}`}>{statusInfo.label}</span>

                                        <h3 className="job-folder__title">
                                            {job.name} {job.company && job.company !== "Unknown" ? `at ${job.company}` : ""}
                                        </h3>

                                        {job.notes && (
                                            <div className="job-folder__notes">{job.notes}</div>
                                        )}

                                        <div className="job-folder__stub-divider" />

                                        <div className="job-folder__stub-row">
                                            <div>
                                                <p className="job-folder__meta" style={{ margin: 0 }}>{getWorkType(job)} · {job.day_work_duration} days</p>
                                                <a href={job.apply_link} target="_blank" rel="noopener noreferrer" className="link-ink" style={{ fontSize: "13px" }}>View Application ↗</a>
                                            </div>

                                            <div className="job-folder__actions">
                                                {!isDemoMode && (
                                                    <Link to={`/edit-job/${job.id}`} state={{ job: job }} className="btn btn-secondary" style={{ textDecoration: "none", fontSize: "12.5px", padding: "7px 12px" }}>Edit</Link>
                                                )}
                                                <button onClick={() => handleDelete(job.id)} className="btn btn-danger">Delete</button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
