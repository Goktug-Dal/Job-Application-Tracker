import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

export default function StatsView({ jobs }) {
    if (!jobs || jobs.length === 0) {
        return <div style={{ textAlign: "center", padding: "20px" }}>No data to display yet!</div>;
    }

    // 1. Calculate Summary Stats
    const totalJobs = jobs.length;
    const interviewing = jobs.filter(j => j.in_interview_process).length;
    const accepted = jobs.filter(j => j.is_accepted).length;
    const rejected = jobs.filter(j => j.is_rejected).length;
    
    // Interview Rate: (Interviews + Offers) / Total
    const interviewRate = (((interviewing + accepted) / totalJobs) * 100).toFixed(1);

    // 2. Prepare Data for the Pie Chart
    const statusData = [
        { name: "Applied", value: jobs.filter(j => j.is_applied).length, color: "#007bff" },
        { name: "Interviewing", value: interviewing, color: "#ffc107" },
        { name: "Accepted", value: accepted, color: "#28a745" },
        { name: "Rejected", value: rejected, color: "#dc3545" },
        { name: "No Response", value: jobs.filter(j => j.is_no_response).length, color: "#6c757d" },
        { name: "On Hold", value: jobs.filter(j => j.on_hold).length, color: "#17a2b8" }
    ].filter(item => item.value > 0); // Only show categories that actually have jobs

    // 3. Prepare Data for the Bar Chart (Work Type)
    const workTypeData = [
        { name: "Remote", count: jobs.filter(j => j.is_remote).length },
        { name: "Hybrid", count: jobs.filter(j => j.is_hybrid).length },
        { name: "Office", count: jobs.filter(j => j.is_office).length }
    ];

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "30px", marginTop: "20px" }}>
            
            {/* Top Row: Quick Stats Cards */}
            <div style={{ display: "flex", gap: "15px", justifyContent: "space-between" }}>
                <div style={{ flex: 1, backgroundColor: "#f8f9fa", padding: "20px", borderRadius: "8px", textAlign: "center", border: "1px solid #ddd" }}>
                    <h3 style={{ margin: "0 0 10px 0", color: "#6c757d" }}>Total Applied</h3>
                    <h1 style={{ margin: 0, fontSize: "2.5rem", color: "#333" }}>{totalJobs}</h1>
                </div>
                <div style={{ flex: 1, backgroundColor: "#f8f9fa", padding: "20px", borderRadius: "8px", textAlign: "center", border: "1px solid #ddd" }}>
                    <h3 style={{ margin: "0 0 10px 0", color: "#6c757d" }}>Interviews</h3>
                    <h1 style={{ margin: 0, fontSize: "2.5rem", color: "#ffc107" }}>{interviewing}</h1>
                </div>
                <div style={{ flex: 1, backgroundColor: "#f8f9fa", padding: "20px", borderRadius: "8px", textAlign: "center", border: "1px solid #ddd" }}>
                    <h3 style={{ margin: "0 0 10px 0", color: "#6c757d" }}>Success Rate</h3>
                    <h1 style={{ margin: 0, fontSize: "2.5rem", color: "#28a745" }}>{interviewRate}%</h1>
                </div>
            </div>

            {/* Bottom Row: Charts */}
            <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
                
                {/* Pie Chart */}
                <div style={{ flex: 1, minWidth: "300px", backgroundColor: "white", padding: "20px", borderRadius: "8px", border: "1px solid #ddd" }}>
                    <h3 style={{ textAlign: "center", marginTop: 0 }}>Application Status</h3>
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

                {/* Bar Chart */}
                <div style={{ flex: 1, minWidth: "300px", backgroundColor: "white", padding: "20px", borderRadius: "8px", border: "1px solid #ddd" }}>
                    <h3 style={{ textAlign: "center", marginTop: 0 }}>Work Type Breakdown</h3>
                    <div style={{ height: "300px" }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={workTypeData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis allowDecimals={false} />
                                <Tooltip />
                                <Bar dataKey="count" fill="#8884d8" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

            </div>
        </div>
    );
}