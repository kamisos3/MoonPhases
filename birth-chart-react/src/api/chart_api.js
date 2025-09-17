import axios from "axios";

const apiClient = axios.create({
    baseURL: "/api",
    headers: { "Content-Type": "application/json"}
});

export async function fetchChart({ iso, tzOffset, latitude, longitude }) {
    const payload = {
        datetimeISO: iso,
        tzOffsetMinutes: tzOffset,
        latitude,
        longitude
    };
    const response = await apiClient.post("/chart", payload);
    return response.data.chart;
}