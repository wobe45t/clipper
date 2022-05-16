import {userAtom} from '../state'
import {useSetRecoilState} from 'recoil'

export const useSetSession = () => {
  return (session) => {
    console.log('set session : ', JSON.stringify(session))
    localStorage.setItem('session', JSON.stringify(session))
  }
}

export const useGetSession = () => {
  const setUser = useSetRecoilState(userAtom)
  return () => {
    const rawData = localStorage.getItem('session')
    const parsed = JSON.parse(rawData)
    setUser(parsed)
    return parsed
  }
}