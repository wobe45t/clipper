import {useRecoilState, useRecoilValue} from 'recoil'
import {userAtom} from '../state'
import {useFetchWrapper} from '../core'

export const useGetPlaylists = () => {
  const user = useRecoilValue(userAtom)
  const fetchWrapper = useFetchWrapper()

  return async () => {
    const {data} = await fetchWrapper.get(`/playlists/${user.id}`)
    return data
  }
}