import axios from "axios";

const API_BASE_URL = "https://job-application-tracker-7ykl.onrender.com/api";

export const getJobs = async () => {
    const token = localStorage.getItem("access"); // Grab the token!
    const response = await axios.get(`${API_BASE_URL}/getAll/`, {
        headers: { Authorization: `Bearer ${token}` } // Send it to Django!
    });
    return response.data;
};

export const deleteJob = async (id) => {
    const token = localStorage.getItem("access");
    await axios.delete(`${API_BASE_URL}/deleteJob/${id}/`, {
        headers: { Authorization: `Bearer ${token}` }
    });
};

export const updateJob = async (id, jobData) => {
    const token = localStorage.getItem("access");
    const response = await axios.put(`${API_BASE_URL}/editJob/${id}/`, jobData, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};