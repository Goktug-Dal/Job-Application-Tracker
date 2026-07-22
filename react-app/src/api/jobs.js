import axios from "./axios";

export const getJobs = async () => {
    const response = await axios.get("getAll/");
    return response.data;
};

export const deleteJob = async (id) => {
    await axios.delete(`deleteJob/${id}/`);
};

export const updateJob = async (id, jobData) => {
    const response = await axios.put(`editJob/${id}/`, jobData);
    return response.data;
};

export const createJob = async (jobData) => {
    const response = await axios.post("createJob/", jobData);
    return response.data;
};