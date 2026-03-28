import axios from "axios"

const baseURL = `${process.env.REACT_APP_API_BASE_URL}`

export const loginAPI = {
    login: (dt) => axios.post(`${baseURL}/login`, dt).then(res => res.data),
    getuser: () => axios.get(`${baseURL}/getuser`).then(res => res.data),
}