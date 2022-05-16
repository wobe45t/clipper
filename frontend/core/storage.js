import {useState, useEffect, useMemo} from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import EncryptedStorage from 'react-native-encrypted-storage';
import {userAtom, playerTrackAtom, playerPlaylistAtom} from '../state'
import {useRecoilState, useSetRecoilState, useRecoilValue} from 'recoil'
import {useProgress} from 'react-native-track-player'

const keys = {
  playerState: 'player-state',
  userData: 'user-data',
  userSession: 'user-session',
  playlists: 'playlists',
  lastPlayedPlaylist: 'last-played-playlist',
  playlistProgress: 'playlist-progress-',
};


export const useClearPlaylistProgress = () => {

  return async (playlist_id) => {
    try {
      const rawData = await AsyncStorage.getItem(keys.lastPlayedPlaylist)
      const parsedData = JSON.parse(rawData)
      if(parsedData.playlist_id == playlist_id) {
        await AsyncStorage.removeItem(keys.lastPlayedPlaylist)
      }
      AsyncStorage.removeItem(`${keys.playlistProgress}${playlist_id}`)
    } catch (error) {
      console.log('clear playlsit progress error : ', error)
    }
  }
}

export const useSetPlaylistProgressCompleted = () => {

  return async (playlist_id, state) => {
    try{
      if(state) {
        AsyncStorage.setItem(`${keys.playlistProgress}${playlist_id}`, JSON.stringify({completed: state}))
      }
      else {
        console.log('CLEARING COMPLETED IN STORAGE')
        AsyncStorage.mergeItem(`${keys.playlistProgress}${playlist_id}`, JSON.stringify({completed: state}))
      }
      //TODO display global message - playlist completed. play next?

    } catch (error) {
      console.error(error)
    }
  }
}

export const useSaveLastPlayedPlaylist = () => {
  return async (playlist_id) => {
    try {
      if(playlist_id) {
        console.log('saving last played playlist id : ', playlist_id)
        AsyncStorage.setItem(keys.lastPlayedPlaylist, JSON.stringify(playlist_id))
      }
      else {
        console.log('Playlist id does not exist')
      }
    } catch (error) {
      console.error(error)
    }
  }
}

export const useGetLastPlayedPlaylistProgress = () => {
  return async () => {
    try {
      const rawData = await AsyncStorage.getItem(keys.lastPlayedPlaylist)
      const playlist_id = JSON.parse(rawData)
      if(playlist_id != null) {
        const rawLastPlayedPlaylist = await AsyncStorage.getItem(`${keys.playlistProgress}${playlist_id}`)
        const parsedLastPlayedPlaylist = JSON.parse(rawLastPlayedPlaylist)
        const result = {...parsedLastPlayedPlaylist, playlist_id}
        console.log('parsedLastPlayedPlaylist: ', result)
        return result 
      }
      else {
        return null
      }
    } catch (error) {
      console.error(error)
    }
  }
}

export const useCalculatePlaylistProgress = () => {

  return (playlistFiles, track_id, progress) => {
    let timeCompleted = 0
    let timeToComplete = 0
    let found = false 
    playlistFiles.map(file => {
      if(file.id == track_id) {
        found = true
        timeCompleted += progress
        timeToComplete = file.duration - progress
      }
      else {
        if(!found) {
          timeCompleted += file.duration
        } else {
          timeToComplete += file.duration
        }
      }
      console.log('timeCompleted', timeCompleted, 'timeToComplete', timeToComplete)
    })
    return {timeCompleted, timeToComplete}
  }
}


export const useUpdatePlaylistProgress = () => {

  return async (playlist_id, track_id, progress) => {
    try {
      console.log('saving playlist state : ', playlist_id, track_id, Math.floor(progress))
      const newData = {track_id, progress: Math.floor(progress), completed: false}
      await AsyncStorage.setItem(`${keys.playlistProgress}${playlist_id}`, JSON.stringify(newData))
    } catch (error) {
      console.error(error)
    }
  }
}

export const useGetPlaylistProgress =() => {
  return async (playlist_id) => {
    try {
      const rawData = await AsyncStorage.getItem(`${keys.playlistProgress}${playlist_id}`)
      const parsedData = JSON.parse(rawData)
      console.log('getPlaylistProgress : ', parsedData)
      return parsedData
    } catch (error) {
      console.error(error)
    }
  }
}

export const useSetUserSession = () => {
  return async (session) => {
    try {
      console.log('saving user session : ', JSON.stringify(session))
      await EncryptedStorage.setItem(keys.userSession, JSON.stringify(session));
    } catch (error) {
      console.error('Store user session error: ', error);
    }
  }
}

export const useGetUserSession = () => {
  const setUser = useSetRecoilState(userAtom)
  return async () => {
    try {
      const rawSession = await EncryptedStorage.getItem(keys.userSession)
      const session = JSON.parse(rawSession)
      console.log('parsed user session : ', session)
      setUser(session)
      return session
    }
    catch(error) {
      console.log('error: ' ,error)
    }
  }
}

export const useClearUserSession = () => {

  return async () => {
    try {
      await EncryptedStorage.removeItem(keys.userSession); // TODO no need for awaiting here ?
    } catch (error) {
      console.error('Clear user session error : ', error);
    }
  }
}
