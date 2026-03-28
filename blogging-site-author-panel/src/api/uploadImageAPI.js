import axios from "axios"

const baseURL = `${process.env.REACT_APP_API_URL}`

export const uploadImageAPI = {
    uploadSingle: (img) => axios.post(`${baseURL}/upload-single-image`, img).then(res => res.data),
}