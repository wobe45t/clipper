import {useFetchWrapper} from '../core';

export const useGenerateClip = () => {
  const fetchWrapper = useFetchWrapper()
  return async (file_id, seconds) => {
    try {
      const {data} = fetchWrapper.get(`/clip/${file_id}?seconds=${seconds}`);
      return data;
    } catch (err) {
      console.error(err.response.data.detail);
    }
  }
}

export const useGetPlaylistClips = () => {
  const fetchWrapper = useFetchWrapper()

  return async (playlist_id) => {
    const {data} = await fetchWrapper.get(`/clips/${playlist_id}`);
    return data;
  }
}

export const useUpdateClip = () => {
  const fetchWrapper = useFetchWrapper()

  return async (clip_id, clip) => {
    const {status} = await fetchWrapper.put(`/clips/${clip_id}`, clip)
    if(status == 200) {
      return true 
    }
    return false
  }
}

export const useDeleteClip = () => {

  const fetchWrapper = useFetchWrapper()

  return async (clip_id) => {
    const {status} = await fetchWrapper.delete(`/clips/${clip_id}`)
    if(status == 200) {
      return true
    }
    return false
  }
}