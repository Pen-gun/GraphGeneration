import axios from 'axios'

const client = axios.create({
    baseURL: 'http://localhost:5000',
});

export const request = ({...options}: any) =>{
    client.defaults.headers.common.authentication = `Bearer token`
    const onSuccess = (response: any) => response;
    const onError = (error: any) => {
        return Promise.reject(error);
    }
    return client(options).then(onSuccess).catch(onError);
}