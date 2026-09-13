import axios from "axios"

const baseURL = `${process.env.REACT_APP_API_URL}`
const startUrl =  `${process.env.REACT_APP_API_BASE_URL}/admin`

export const authorAPI = {
    getAll: (siteId) => axios.get(`${baseURL}/authors`).then(res => res.data),
    addNew: (content) => axios.post(`${startUrl}/register`, content).then(res => res.data),
    update: async(dt) => {
        const { id, ...rest } = dt

        return axios.put(`${baseURL}/author/${id}`, rest).then(res => res.data)
    },
    delete: (dt) => axios.delete(`${baseURL}/author/${dt}`).then(res => res.data),
    single: (dt) => axios.get(`${baseURL}/get-writer/${dt}`).then(res => res.data),
}