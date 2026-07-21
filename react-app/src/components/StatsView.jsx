import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import "../styles/theme.css";

const STAMP = {
    applied: "#2bb6ff",
    interview: "#ffb020",
    accepted: "#10c97e",
    rejected: "#ff4f6d",
    noresponse: "#9291b0",
    hold: "#66647f",
};

export default function StatsView({ jobs }) {
    if (!jobs || jobs.length === 0) {
        return <div style={{ textAlign: "center", padding: "20px", fontFamily: "var(--font-mono)", color: "var(--ink-soft)" }}>No data to display yet!</div>;
    }

    // 1. Summary stats
    const totalJobs = jobs.length;
    const interviewing = jobs.filter(j => j.in_interview_process).length;
    const accepted = jobs.filter(j => j.is_accepted).length;
    const rejected = jobs.filter(j => j.is_rejected).length;

    // Interview rate: (interviews + offers) / total
    const interviewRate = (((interviewing + accepted) / totalJobs) * 100).toFixed(1);

    // 2. Status breakdown for the pie chart
    const statusData = [
        { name: "Applied", value: jobs.filter(j => j.is_applied).length, color: STAMP.applied },
        { name: "Interviewing", value: interviewing, color: STAMP.interview },
        { name: "Accepted", value: accepted, color: STAMP.accepted },
        { name: "Rejected", value: rejected, color: STAMP.rejected },
        { name: "No Response", value: jobs.filter(j => j.is_no_response).length, color: STAMP.noresponse },
        { name: "On Hold", value: jobs.filter(j => j.on_hold).length, color: STAMP.hold }
    ].filter(item => item.value > 0);

    // 3. Work type breakdown for the bar chart
    const workTypeData = [
        { name: "Remote", count: jobs.filter(j => j.is_remote).length },
        { name: "Hybrid", count: jobs.filter(j => j.is_hybrid).length },
        { name: "Office", count: jobs.filter(j => j.is_office).length }
    ];

    const statCardStyle = {
        flex: 1,
        backgroundColor: "var(--bg)",
        padding: "20px",
        borderRadius: "16px",
        textAlign: "center",
        border: "2.5px solid var(--ink)",
        boxShadow: "5px 5px 0 var(--rule)",
    };

    const statLabelStyle = {
        margin: "0 0 8px 0",
        fontFamily: "var(--font-mono)",
        fontSize: "11.5px",
        fontWeight: 700,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        color: "var(--ink-soft)",
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginTop: "4px" }}>

            <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                <div style={statCardStyle}>
                    <h3 style={statLabelStyle}>Total Applied</h3>
                    <h1 style={{ margin: 0, fontSize: "2.4rem", fontFamily: "var(--font-display)", color: "var(--ink)" }}>{totalJobs}</h1>
                </div>
                <div style={{ ...statCardStyle, boxShadow: `5px 5px 0 ${STAMP.interview}` }}>
                    <h3 style={statLabelStyle}>Interviews</h3>
                    <h1 style={{ margin: 0, fontSize: "2.4rem", fontFamily: "var(--font-display)", color: STAMP.interview }}>{interviewing}</h1>
                </div>
                <div style={{ ...statCardStyle, boxShadow: `5px 5px 0 ${STAMP.accepted}` }}>
                    <h3 style={statLabelStyle}>Interview Rate</h3>
                    <h1 style={{ margin: 0, fontSize: "2.4rem", fontFamily: "var(--font-display)", color: STAMP.accepted }}>{interviewRate}%</h1>
                </div>
                <div style={{ ...statCardStyle, boxShadow: `5px 5px 0 ${STAMP.rejected}` }}>
                    <h3 style={statLabelStyle}>Rejected</h3>
                    <h1 style={{ margin: 0, fontSize: "2.4rem", fontFamily: "var(--font-display)", color: STAMP.rejected }}>{rejected}</h1>
                </div>
            </div>

            <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>

                <div style={{ flex: 1, minWidth: "300px", backgroundColor: "var(--bg)", padding: "18px", borderRadius: "16px", border: "2.5px solid var(--ink)" }}>
                    <h3 style={{ textAlign: "center", marginTop: 0, fontFamily: "var(--font-display)", fontSize: "14px", fontWeight: 700, textTransform: "uppercase", color: "var(--ink)" }}>
                        Application Status
                    </h3>
                    <div style={{ height: "300px" }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={statusData} cx="50%" cy="50%" outerRadius={100} dataKey="value" label>
                                    {statusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div style={{ flex: 1, minWidth: "300px", backgroundColor: "var(--bg)", padding: "18px", borderRadius: "16px", border: "2.5px solid var(--ink)" }}>
                    <h3 style={{ textAlign: "center", marginTop: 0, fontFamily: "var(--font-display)", fontSize: "14px", fontWeight: 700, textTransform: "uppercase", color: "var(--ink)" }}>
                        Work Type Breakdown
                    </h3>
                    <div style={{ height: "300px" }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={workTypeData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--rule)" />
                                <XAxis dataKey="name" stroke="var(--ink-soft)" style={{ fontFamily: "var(--font-mono)", fontSize: "12px" }} />
                                <YAxis allowDecimals={false} stroke="var(--ink-soft)" style={{ fontFamily: "var(--font-mono)", fontSize: "12px" }} />
                                <Tooltip />
                                <Bar dataKey="count" fill="#4b3dff" radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

            </div>
        </div>
    );
}
