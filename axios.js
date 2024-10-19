import axios from "axios";

export default axios.create({
    baseURL: "https://auth-service1-bkdhfbh9a3a2g4ba.canadacentral-01.azurewebsites.net/api/v1",
    headers: {
        "Content-type": "application/json"
    }
});