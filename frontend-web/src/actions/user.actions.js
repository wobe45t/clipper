import { useFetchWrapper, useSetSession } from '../core'
import { userAtom } from '../state'
import { useSetRecoilState } from 'recoil'

export const useLogin = () => {
  const setUser = useSetRecoilState(userAtom) //this initializes the atom - without getting user too it throws an errro
  const fetchWrapper = useFetchWrapper()
  const setSession = useSetSession()

  return async (email, password) => {
    let formData = new FormData()
    console.log(email, password)
    formData.append('email', email)
    formData.append('password', password)

    const {data} = await fetchWrapper.post('/login', formData, {
      headers: {
        'content-type': 'multipart/form-data',
      },
    })
    console.log('data received : ', data)
    setUser(data)
    setSession(data)
    return data 
  }
}
