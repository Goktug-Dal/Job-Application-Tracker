import customAxios from "../customAxios";

// Fetch all jobs
export const getJobs = async () => {
    const response = await customAxios.get("/getAll/");
    return response.data;
};

// Create a new job
export const createJob = async (jobData) => {
    const response = await customAxios.post("/createJob/", jobData);
    return response.data;
};

// Update an existing job
export const updateJob = async (id, jobData) => {
    const response = await customAxios.put(`/editJob/${id}/`, jobData);
    return response.data;
};

// Delete an existing job
export const deleteJob = async (id) => {
    const response = await customAxios.delete(`/deleteJob/${id}/`);
    return response.data;
};