import api from './Api';

export const signup =  (userData) =>{
    return  api.post('/v1/auth/signup', userData);

};

export const login = (userData) =>{
    return api.post('/v1/auth/login', userData);

}