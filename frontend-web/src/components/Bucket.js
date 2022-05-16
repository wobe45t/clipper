import { useCallback, useState, useEffect } from 'react'
import { useDrop } from 'react-dnd'
import { useDropzone } from 'react-dropzone'
import './styles/Bucket.style.css'
import { Button } from '../components'
import { Snackbar, Paper, CircularProgress } from '@mui/material'
import { userAtom } from '../state'
import { useRecoilValue } from 'recoil'
import axios from 'axios'
import {useUrl} from '../core'

const File = (props) => {
  const { name, index } = props

  return (
    <div
      className='file'
      style={{
        backgroundColor: index % 2 == 0 ? '#f2f7f4' : '#ebf2ee',
      }}
    >
      {name}
    </div>
  )
}

export function Bucket() {
  const [files, setFiles] = useState([])
  const [name, setName] = useState('')
  const [showSnackbar, setShowSnackbar] = useState(false)
  const [snackbarText, setSnackbarText] = useState('')
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0.0)
  const API_URL = useUrl()

  const user = useRecoilValue(userAtom)

  const [{ canDrop, isOver }, drop] = useDrop(() => ({
    // The type (or types) to accept - strings or symbols
    accept: 'BOX',
    // Props to collect
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }))

  const uploadFiles = async () => {
    if (files.length === 0 || name == '') {
      setSnackbarText('Files and name are required.')
      setShowSnackbar(true)
      return
    }
    setUploading(true)
    const formData = new FormData()
    files.forEach((file) => {
      formData.append('files', file)
    })
    formData.append('name', name)
    axios
      .request({
        method: 'post',
        url: `${API_URL}/playlists/${user.id}/upload`,
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (p) => {
          setProgress(p.loaded / p.total)
        },
      })
      .then((data) => {
        setSnackbarText('Upload successful')
        setShowSnackbar(true)
        setFiles([])
        setName('')
        setUploading(false)
        setProgress(1.0)
      })
      .catch((err) => {
        setUploading(false)
        setSnackbarText('Upload failed.')
        setShowSnackbar(true)
        setFiles([])
        setName('')
        console.error(err)
      })
  }

  const onDrop = useCallback((acceptedFiles) => {
    console.log(acceptedFiles)
    setFiles(acceptedFiles)
  }, [])
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  return (
    <Paper
      elevation={6}
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
        flexDirection: 'column',
        width: '50%',
      }}
    >
      <div
        {...getRootProps()}
        ref={drop}
        role={'Dustbin'}
        className='bin scroll-box'
        style={{
          backgroundColor: isOver || isDragActive ? '#f7f7f7' : 'white',
        }}
      >
        {uploading ? (
          <div className='center column'>
            <div className='text'>{progress * 100}%</div>
            <div className='row'>
              <div className='text' style={{ marginRight: 5 }}>
                Uploading
              </div>
              <CircularProgress />
            </div>
          </div>
        ) : files.length !== 0 ? (
          files.map((file, index) => <File name={file.name} index={index} />)
        ) : (
          <div className='center'>
            <div className='text'>
              {isOver || isDragActive
                ? 'Drop files...'
                : 'Choose or drop files...'}
            </div>
          </div>
        )}
        <input {...getInputProps()} />
      </div>

      <input
        className='input'
        value={name}
        placeholder='Playlist name'
        onChange={(event) => setName(event.target.value)}
      />

      {/* <div style={{display: 'flex', justiwidth: '100%' }}> */}
      <Button
        onClick={() => {
          console.log('onClick')
          uploadFiles()
        }}
      >
        CREATE PLAYLIST
      </Button>
      {/* </div> */}
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        open={showSnackbar}
        autoHideDuration={5000}
        onClose={() => setShowSnackbar(false)}
        message={snackbarText}
      />
    </Paper>
  )
}
