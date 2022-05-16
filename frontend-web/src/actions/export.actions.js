import {useUrl} from '../core'

export const useExport = () => {
  const API_URL = useUrl()

  return async (playlist) => {
    const response = await fetch(`${API_URL}/clips/${playlist.id}/export`)
    const blob = await response.blob()
    let url = window.URL.createObjectURL(blob)
    let a = document.createElement('a')
    a.href = url
    a.download = `bookmarks-${playlist.id}.txt`
    document.body.appendChild(a)
    a.click()
    a.remove()
  }
}
