import {
  useRecoilState,
  useRecoilValue,
  useSetRecoilState,
  useResetRecoilState,
} from 'recoil';
import {useFetchWrapper, useClearPlaylistProgress} from '../core';
import {
  playerPlaylistAtom,
  playlistsAtom,
  playerTrackAtom,
  userAtom,
} from '../state';
import Config from 'react-native-config';

export const useGetPlaylist = () => {
  const fetchWrapper = useFetchWrapper();
  return async playlist_id => {
    try {
      const {data} = await fetchWrapper.get(`/playlist/${playlist_id}`);
      let new_files = data.files.map(file => {
        return {...file, url: `${Config.API_URL}/${file.url}`};
      });

      return {...data, files: new_files};
    } catch (err) {
      console.error(err);
    }
  };
};

export const useFetchPlaylists = () => {
  const user = useRecoilValue(userAtom);
  const setPlaylists = useSetRecoilState(playlistsAtom);
  useRecoilState(playerPlaylistAtom);
  const fetchWrapper = useFetchWrapper();

  return async () => {
    try {
      const {data} = await fetchWrapper.get(`/playlists/${user.id}`);
      setPlaylists(data);
      console.log('playlists : ', JSON.stringify(data));
      return data;
    } catch (err) {
      console.error(err);
    }
  };
};

export const useDeletePlaylist = () => {
  const [playlists, setPlaylists] = useRecoilState(playlistsAtom);
  const fetchWrapper = useFetchWrapper();
  const clearPlaylistProgress = useClearPlaylistProgress();
  const resetPlayerTrack = useResetRecoilState(playerTrackAtom);
  const playerPlaylist = useRecoilValue(playerPlaylistAtom);
  const resetPlayerPlaylist = useResetRecoilState(playerPlaylistAtom);

  return async playlist_id => {
    try {
      const {status} = await fetchWrapper.delete(`/playlist/${playlist_id}`);
      if (status == 200) {
        const newPlaylists = playlists.filter(
          playlist => playlist.id !== playlist_id,
        );
        setPlaylists(newPlaylists);
        clearPlaylistProgress(playlist_id);
        if (playlist_id == playerPlaylist.id) {
          resetPlayerTrack();
          resetPlayerPlaylist();
        }
      }
    } catch (err) {
      console.error(err);
    }
  };
};
export const useUpdatePlaylistTags = () => {
  const [playlists, setPlaylists] = useRecoilState(playlistsAtom);
  const fetchWrapper = useFetchWrapper();

  return async (playlist_id, tags) => {
    try {
      let ids = tags.map(tag => tag.id);
      console.log(tags);
      const {status} = await fetchWrapper.put(
        `/playlist/${playlist_id}/tags`,
        ids,
      );
      if (status == 200) {
        let newPlaylists = playlists.map(playlist => {
          if (playlist.id == playlist_id) {
            return {...playlist, tags: tags};
          } else {
            return playlist;
          }
        });
        setPlaylists(newPlaylists);
      }
    } catch (err) {
      console.error('update playlist tags error : ', err);
      // PlaylistsState.set({success: false, message: err.response.data.detail});
    }
  };
};
export const useUpdatePlaylistName = () => {
  const [playlists, setPlaylists] = useRecoilState(playlistsAtom);
  const [playerPlaylist, setPlayerPlaylist] =
    useRecoilState(playerPlaylistAtom);
  const fetchWrapper = useFetchWrapper();

  return async (playlist_id, name) => {
    try {
      const {status} = await fetchWrapper.put(`/playlist/${playlist_id}`, {
        name: name,
      });
      if (status == 200) {
        let newPlaylists = playlists.map(playlist => {
          if (playlist.id == playlist_id) {
            return {...playlist, name};
          } else {
            return playlist;
          }
        });
        setPlaylists(newPlaylists);
        if (playerPlaylist.id == playlist_id) {
          setPlayerPlaylist({...playerPlaylist, name});
        }
      }
    } catch (err) {
      console.error(err);
      // PlaylistsState.success.set(false);
      // PlaylistsState.message.set(err.response.data.detail);
    }
  };
};
export const useUpdateFileName = () => {
  const [playlists, setPlaylists] = useRecoilState(playlistsAtom);
  const [playerTrack, setPlayerTrack] = useRecoilState(playerTrackAtom);
  const fetchWrapper = useFetchWrapper();

  return async (file_id, name) => {
    try {
      const {status} = await fetchWrapper.put(`/files/${file_id}`, {
        name: name,
      });
      if (status == 200) {
        let newPlaylists = playlists.map(playlist => {
          if (playlist.id == playlist_id) {
            return {
              ...playlist,
              files: playlist.files.map(file => {
                if (file.id == file_id) {
                  return {...file, name};
                }
                return file;
              }),
            };
          }
          return playlist;
        });
        setPlaylists(newPlaylists);
        if (playerTrack.id == file_id) {
          setPlayerTrack({...playerTrack, name});
        }
        // updateTrackName(file_id, name) //TODO its a TrackPlayer function for setting up metadata. No need for that?
      }
    } catch (err) {
      console.error(err);
      // PlaylistsState.success.set(false);
      // PlaylistsState.message.set(err.response.data.detail);
    }
  };
};

// export const useGetPlaylist = () => {
//   const playlists = useRecoilValue(playlistsAtom);
//   return async playlist_id => {
//     let result;
//     console.log('getPlaylist:', playlists);
//     playlists.map(playlist => {
//       if (playlist.id == playlist_id) {
//         result = playlist;
//       }
//     });
//     console.log('getPlaylist: ', result);
//     return result;
//   };
// };
