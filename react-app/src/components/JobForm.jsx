import { useState } from "react";
import api from "../api/axios";

export default function JobForm({ onJobCreated }) {
    const [name, setName] = useState("");
    const [applyLink, setApplyLink] = useState("");
    const [workType, setWorkType] = useState("OFFICE");

    const handleSubmit = async (e) => {
        e.preventDefault();

        const res = await api.post("/jobs/createJob/", {
            name: name,
            apply_link: applyLink,
            work_type: workType,
        });

        setName("");
        setApplyLink("");

        if (onJobCreated) {
            onJobCreated(res.data);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h3>Create Job</h3>

            <input
                placeholder="Company / Job Name"
                value={name}
                onChange={(e) =>
                    setName(e.target.value)
                }
            />

            <input
                placeholder="Apply Link"
                value={applyLink}
                onChange={(e) =>
                    setApplyLink(e.target.value)
                }
            />

            <select
                value={workType}
                onChange={(e) =>
                    setWorkType(e.target.value)
                }
            >
                <option value="REMOTE">Remote</option>
                <option value="HYBRID">Hybrid</option>
                <option value="OFFICE">Office</option>
            </select>

            <button>Create</button>
        </form>
    );
}