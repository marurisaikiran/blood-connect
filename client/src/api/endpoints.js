import api from "./axios";

// Auth
export const registerUser = (data) => api.post("/auth/register", data);
export const loginUser = (data) => api.post("/auth/login", data);
export const getMe = () => api.get("/auth/me");

// Donors
export const getDonors = (params) => api.get("/donors", { params });
export const getDonorById = (id) => api.get(`/donors/${id}`);
export const updateAvailability = (isAvailable) =>
  api.patch("/donors/me/availability", { isAvailable });
export const updateDonorProfile = (data) => api.patch("/donors/me", data);
export const getNearbyRequests = (radiusKm) =>
  api.get("/donors/requests/nearby", { params: { radiusKm } });

// Patients
export const getMyPatientProfile = () => api.get("/patients/me");
export const updatePatientProfile = (data) => api.patch("/patients/me", data);

// Requests
export const createRequest = (data) => api.post("/requests", data);
export const getMyRequests = () => api.get("/requests/me");
export const getRequestById = (id) => api.get(`/requests/${id}`);
export const updateRequestStatus = (id, status) =>
  api.patch(`/requests/${id}/status`, { status });
export const respondToMatch = (id, response) =>
  api.post(`/requests/${id}/respond`, { response });
