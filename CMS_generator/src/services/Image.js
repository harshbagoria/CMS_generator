import api from "./api";

export const generatedImage =  (Data) =>{
    return  api.post('/v1/image/generate', Data);

};
