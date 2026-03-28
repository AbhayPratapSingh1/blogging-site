import axios from "axios"

const baseURL = `${process.env.REACT_APP_API_URL}`

export const tagsAPI = {
    getAll: (siteId) => axios.get(`${baseURL}/tags-by-site-id/${siteId}`).then(res => res.data),
    addNew: (content) => axios.post(`${baseURL}/tags`, content).then(res => res.data),
    update: async(dt) => {
        const { id, ...rest } = dt
        return axios.put(`${baseURL}/tags/${id}`, rest).then(res => res.data)
    },
    delete: (dt) => axios.delete(`${baseURL}/tags/${dt}`).then(res => res.data),
    single: (dt) => axios.get(`${baseURL}/tags/${dt}`, {headers:{encodedes:'https://a.com'}}).then(res => res.data),
}