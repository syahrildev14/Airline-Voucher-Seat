import axios from "axios";

const API = axios.create({
    baseURL: "http://127.0.0.1:8000/api",
});

export const checkVoucher = (data: {
    flightNumber: string;
    date: string;
}) => {
    return API.post("/check", data);
};

export const generateVoucher = (data: {
    name: string;
    id: string;
    flightNumber: string;
    date: string;
    aircraft: string;
}) => {
    return API.post("/generate", data);
};
