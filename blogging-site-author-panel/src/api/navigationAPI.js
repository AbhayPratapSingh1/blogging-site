import axios from "axios"

const baseURL = `${process.env.REACT_APP_API_URL}`

export const navigationAPI = {
    getAll: (siteId) => axios.get(`${baseURL}/navigation-by-site-id/${siteId}`).then(res => res.data),
    addNew: (content) => axios.post(`${baseURL}/add-navigation`, content).then(res => res.data),
    update: async (dt) => {
        const { id, ...rest } = dt
        return axios.put(`${baseURL}/navigation/${id}`, rest).then(res => res.data)
    },
    delete: (dt) => axios.delete(`${baseURL}/navigation/${dt}`).then(res => res.data),
    single: (dt) => axios.get(`${baseURL}/navigation/${dt}`).then(res => res.data),
}