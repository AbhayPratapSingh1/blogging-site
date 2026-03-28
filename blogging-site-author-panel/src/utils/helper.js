// string clip
import axios from 'axios';

export const stringClip= (str, count=50)=>{
    return str&& str.length>count? str.slice(0, count):str
}

export const formatDate= (dt)=>{
    return new Date(dt).toLocaleDateString()
}



export const uploadImageToAPI = async (imageFile) => {
  
  const formData = new FormData();
  formData.append('file', imageFile);
  const uploadToServer = await axios.post(`${process.env.REACT_APP_API_URL}/upload-single-image`, formData, {
    headers: { 'Access-Control-Allow-Origin': '*' }
  });

  console.log("uploadign image to server is maybe done recieved data : ", uploadToServer);
  return uploadToServer?.data;
};