import api from "./Api";

export const generateContent =  (Data) =>{
    return  api.post('/v1/content/generate', Data);

};
export const generatedContenthistory = (Data)=>{
    return api.get('/v1/content/history', { params: Data });

};
