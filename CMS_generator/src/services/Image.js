import api from "./Api";

export const generatedImage =  (Data) =>{
    return  api.post('/v1/image/generate', Data);

};
export const getGeneratedImageHistory = (Data) =>{
    return api.get('/v1/image/history', { params: Data });

}
