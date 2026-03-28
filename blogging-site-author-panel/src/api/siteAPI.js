import axios from "axios"

const baseURL = `${process.env.REACT_APP_API_URL}`

export const siteAPI = {
    getAll: () => axios.get(`${baseURL}/sites`).then(res => res.data),
    addNew: (content) => axios.post(`${baseURL}/sites`, content).then(res => res.data),
    update: async(dt) => {
        const { id, ...rest } = dt

        return axios.put(`${baseURL}/single-site/${id}`, rest).then(res => res.data)
    },
    delete: (dt) => axios.delete(`${baseURL}/single-site/${dt}`).then(res => res.data),
    single: (dt) => axios.get(`${baseURL}/single-site/${dt}`).then(res => res.data),
}