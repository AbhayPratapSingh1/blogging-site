import axios from "axios"

const baseURL = `${process.env.REACT_APP_API_URL}`

export const socialMediaAPI = {
    getAll: (siteId) => axios.get(`${baseURL}/social-media-by-site-id/${siteId}`).then(res => res.data),
    addNew: (content) => axios.post(`${baseURL}/add-social-media`, content).then(res => res.data),
    update: async(dt) => {
        const { id, ...rest } = dt
        return axios.put(`${baseURL}/social-media/${id}`, rest).then(res => res.data)
    },
    delete: (dt) => axios.delete(`${baseURL}/social-media/${dt}`).then(res => res.data),
    single: (dt) => axios.get(`${baseURL}/social-media/${dt}`).then(res => res.data),
}