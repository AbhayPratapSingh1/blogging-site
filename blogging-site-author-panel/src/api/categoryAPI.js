import axios from "axios"

const baseURL = `${process.env.REACT_APP_API_URL}`

export const categoryAPI = {
    getAll: (siteId) => axios.get(`${baseURL}/categories-by-site-id/${siteId}`).then(res => res.data),
    addNew: (content) => axios.post(`${baseURL}/category`, content).then(res => res.data),
    update: async(dt) => {
        const { id, ...rest } = dt

        return axios.put(`${baseURL}/category/${id}`, rest).then(res => res.data)
    },
    delete: (dt) => axios.delete(`${baseURL}/category/${dt}` ,{headers:{encodedes:'https://a.com'}}).then(res => res.data),
    single: (dt) => axios.get(`${baseURL}/category/${dt}`, {headers:{encodedes:'https://a.com'}}).then(res => res.data),
}