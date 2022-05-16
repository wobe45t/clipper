import {useCallback} from 'react'
import {useRecoilState} from 'recoil';
import {userAtom} from '../state';
import {useUrl} from '.'

export const useFetchWrapper = () => {
    const [user, setUser] = useRecoilState(userAtom);
    const API_URL = useUrl()

    return {
        get: request('GET'),
        post: request('POST'),
        put: request('PUT'),
        delete: request('DELETE')
    };

    function request(method) {
        return (url, body, options={}) => {
            
            const newUrl = API_URL + url
            const requestOptions = {
                method,
                headers: authHeader()
            };
            if (body) {
                if(options.headers && options.headers['content-type'] === 'multipart/form-data') {
                    // requestOptions.headers['Content-Type'] = 'multipart/form-data'    
                    requestOptions.body = body
                } 
                else {
                    requestOptions.headers['Content-Type'] = 'application/json';
                    requestOptions.body = JSON.stringify(body);
                }
            }
            console.log(newUrl, JSON.stringify(requestOptions));
            return fetch(newUrl, requestOptions).then(handleResponse);
        }
    }
    
    function authHeader() {
        if (user && user.access_token) {
            return { Authorization: `Bearer ${user.access_token}` };
        } else {
            return {};
        }
    }
    
    function handleResponse(response) {
        return response.json().then(data => {
            if (!response.ok) {
                if ([401, 403].includes(response.status) && user?.access_token) {
                    setUser(null)
                }
                // const error = (data && data.message) || response.statusText;
                console.log('BACKEND ERROR: ', JSON.stringify(response))
                return Promise.reject(response);
            }
            return {data, status: response.status};
        });
    }    
}
