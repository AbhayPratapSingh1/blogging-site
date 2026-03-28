import axios from "axios"

const baseURL = `${process.env.REACT_APP_API_URL}`

export const blogAPI = {
    getAll: (siteId) => axios.get(`${baseURL}/pages-by-site-id/${siteId}`).then(res => res.data),
    addNew: (content) => axios.post(`${baseURL}/add-new-page`, content).then(res => res.data),
    update: async(dt) => {
        const { id, ...rest } = dt
        return axios.put(`${baseURL}/single-page/${id}`, rest).then(res => res.data)},
    delete: (dt) => axios.delete(`${baseURL}/single-page/${dt}`).then(res => res.data),
    single: (dt) => axios.get(`${baseURL}/single-page/${dt}`).then(res => res.data),
}