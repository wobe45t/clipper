import { useState, useEffect } from 'react'
import { Button } from '../components'
import { useExport, useGetPlaylists } from '../actions'
import { Paper } from '@mui/material'
import './styles/Export.style.css'

const Playlist = (props) => {
  const { playlist } = props
  const exportBookmarks = useExport()

  return (
    <div
      style={{
        backgroundColor: '#f7f7f7',
        letterSpacing: 1,
        padding: 10,
        margin: 10,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '95%',
      }}
    >
      <div>{playlist.name}</div>
      <Button onClick={() => exportBookmarks(playlist)}>Export</Button>
    </div>
  )
}

export const Export = () => {
  const getPlaylists = useGetPlaylists()
  const [playlists, setPlaylists] = useState([])

  useEffect(() => {
    const fetch = async () => {
      const data = await getPlaylists()
      console.log(data)
      setPlaylists(data)
    }
    fetch()
  }, [])

  return (
    <div
    id='export'
    // className='container'
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
      }}
    >
      <Paper
        elevation={6}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: 40,
          width: '50%',
          height: 700,
        }}
      >
        <div
          style={{
            width: '100%',
            textTransform: 'uppercase',
            letterSpacing: 1,
            textAlign: 'center',
            fontSize: 30,
            margin: 10,
          }}
        >
          Your playlists
        </div>
        <div style={{ marginBottom: 5 }}>
          Click export to download playlist bookmarks...
        </div>
        <div className='scroll-box' style={{width: '100%', height: '100%'}}>
          {playlists.length === 0
            ? 'No playlists found'
            : playlists.map((playlist, index) => (
                <Playlist key={index} playlist={playlist} />
              ))}
        </div>
      </Paper>
    </div>
  )
}
