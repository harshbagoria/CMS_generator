import api from "./api";

export const generateContent =  (Data) =>{
    return  api.post('/v1/content/generate', Data);

};
