import {useRecoilState, useSetRecoilState, useResetRecoilState} from 'recoil';

import {userAtom} from '../state';
import {useFetchWrapper} from '../core';
import {useSetUserSession} from '../core';

export const useLogin = () => {
  const setUser = useSetRecoilState(userAtom); //this initializes the atom - without getting user too it throws an errro
  const fetchWrapper = useFetchWrapper();
  const setUserSession = useSetUserSession();

  return async (email, password) => {
    let formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);

    const {data} = await fetchWrapper.post(`/login`, formData, {
      headers: {
        'content-type': 'multipart/form-data',
      },
    });
    console.log('data received : ', data);
    setUser(data);
    await setUserSession(data);
    return true;
  };
};

export const useSignup = () => {
  const fetchWrapper = useFetchWrapper();
  return async (email, password) => {
    if (password != confirmPassword) {
      return;
    }
    let formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);

    const {data, status} = await fetchWrapper.post(`/login`, formData, {
      headers: {
        'content-type': 'multipart/form-data',
      },
    });
    if(status == 201) { //TODO check if its a 201 (user created)
      return true
    }
  };
};
