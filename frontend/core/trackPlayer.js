import TrackPlayer, {
  Capability,
  useTrackPlayerEvents,
  Event,
  useProgress,
  State as TrackPlayerState,
  State,
} from 'react-native-track-player';
import {useEffect, useMemo, useState} from 'react';
import {InputLeftAddon, useToast} from 'native-base';
import {
  useSetRecoilState,
  useResetRecoilState,
  useRecoilValue,
  waitForAll,
  useRecoilState,
} from 'recoil';
import {
  playerInfoAtom,
  showPlayerModalAtom,
  playerPlaylistAtom,
  playerTrackAtom,
  playlistCompletedAtom,
  playlistProgressAtom,
  serverAddressAtom
} from '../state';
import {useGetPlaylistProgress,useSaveLastPlayedPlaylist, useSetPlaylistProgressCompleted} from '../core';
import {useGetPlaylist} from '../actions';
import Config from 'react-native-config'

const calculateTimeFinished = (files, track_id) => {
  console.log('time finished recalculation');
  let sum = 0;
  for (var i = 0; i < files.length; i++) {
    if (files[i].id == track_id) {
      break;
    }
    sum += files[i].duration;
    console.log('sum : ', sum);
  }
  return sum;
};

const calculateWholeTime = files => {
  let sum = 0;
  files.map(file => (sum += file.duration));
  return sum;
};

const longTime = time => {
  if (time) {
    return new Date(time * 1000).toISOString().substr(11, 8);
  }
  return '00:00:00';
};
const shortTime = time => {
  if (time) {
    return new Date(time * 1000).toISOString().substr(14, 5);
  }
  return '00:00';
};

export const usePlaylistProgress = playlist => {
  const [func, setFunc] = useState(() => shortTime);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const playerTrack = useRecoilValue(playerTrackAtom);
  const playerPlaylist = useRecoilValue(playerPlaylistAtom);
  const {position} = useProgress(1000);
  const setPlaylistProgressCompleted = useSetPlaylistProgressCompleted();
  const [completed, setCompleted] = useState(false);
  const getPlaylistProgress = useGetPlaylistProgress();
  const resetPlayerPlaylist = useResetRecoilState(playerPlaylistAtom);
  const resetPlayerTrack = useResetRecoilState(playerTrackAtom);
  const [timeBase, setTimeBase] = useState(0);
  
  const [playlistProgress, setPlaylistProgress] = useRecoilState(playlistProgressAtom(playlist.id));

  useEffect(() => {
    if(playlistProgress) {
      if(playlistProgress.completed == true){
        console.log(`Setting completed ${playlist.id} in async storage`);
        setPlaylistProgressCompleted(playlist.id, true);
        setCompleted(true)
      }
      else if (playlistProgress.completed == false) {
        console.log(`Setting uncompleted ${playlist.id} in async storage`);
        setPlaylistProgressCompleted(playlist.id, false);
        setCompleted(false)
      }
    }
  }, [playlistProgress])


  useEffect(() => {
    if (playerPlaylist.id == playlist.id) {
      const result = calculateTimeFinished(playlist.files, playerTrack.id);
      if (result != 0) {
        setTimeBase(result);
      }
    }
  }, [playerTrack.id]);

  useTrackPlayerEvents([Event.PlaybackQueueEnded], async () => {
    if (playlist.id == playerPlaylist.id) {
      setPlaylistProgress({completed: true})
      await TrackPlayer.pause();
      resetPlayerPlaylist();
      resetPlayerTrack();
    }
  });

  useEffect(() => {
    const init = async () => {
      const data = await getPlaylistProgress(playlist.id);
      if (data) {
        console.log('DATA IN EFFECT USE PROGRESS: '+ playlist.id + JSON.stringify(data));
        if (data.completed) {
          setCompleted(true);
        } else {
          const timefinished = calculateTimeFinished(
            playlist.files,
            data.track_id,
          );
          setProgress(timefinished + data.progress);
          setTimeBase(timefinished);
          setCompleted(false)
        }
      } else {
        setProgress(0);
      }
    };
    init();
  }, []);

  useEffect(() => {
    if (playerPlaylist.id == playlist.id) {
      if (duration >= 60 * 60) {
        setFunc(() => longTime);
      } else {
        setFunc(() => shortTime);
      }
    }
  }, [duration]);

  useEffect(() => {
    if (
      playlist.id == playerPlaylist.id &&
      timeBase != duration &&
      position != 0
    ) {
      setProgress(timeBase + position);
    }
  }, [position]);

  useEffect(() => {
    console.log('playlist.files.length changed effect');
    setDuration(calculateWholeTime(playlist.files));
  }, [playlist.files.length]);

  const progressStr = useMemo(
    () => func(Math.round(progress)),
    [Math.round(progress)],
  );
  const durationStr = useMemo(
    () => func(Math.round(duration)),
    [Math.round(duration)],
  );

  return {
    completed: completed,
    positionValue: progress,
    durationValue: duration,
    position: progressStr,
    duration: durationStr,
  };
};

export const useTrackProgress = () => {
  const [func, setFunc] = useState(() => shortTime);
  const {position, duration} = useProgress(500);

  useEffect(() => {
    if (duration >= 60 * 60) {
      setFunc(() => longTime);
    } else {
      setFunc(() => shortTime);
    }
  }, [duration]);

  return {
    positionValue: position,
    durationValue: duration,
    position: useMemo(() => func(Math.round(position)), [Math.round(position)]),
    duration: useMemo(() => func(Math.round(duration)), [duration]),
  };
};

export const useTrackInfo = () => {
  const [trackInfo, setTrackInfo] = useState({});
  const setPlayerTrack = useSetRecoilState(playerTrackAtom);
  const setPlayerPlaylist = useSetRecoilState(playerPlaylistAtom);

  useTrackPlayerEvents([Event.PlaybackTrackChanged], async () => {
    try {
      const info = await TrackPlayer.getTrack(
        await TrackPlayer.getCurrentTrack(),
      );
      const result = {duration: info.duration, id: info.id, name: info.title};
      setTrackInfo(result);
      setPlayerTrack(result);
    } catch (error) {
      console.log(error);
    }
  });
  return trackInfo;
};

export const findFileId = async file_id => {
  const tracks = await TrackPlayer.getQueue();
  let id;
  tracks.map((track, index) => {
    if (track.id === file_id) {
      id = index;
    }
  });
  if (id === undefined) {
    throw new Error('File wasnt found');
  }
  return id;
};

const addWholePlaylistToQueue = async (playlistFiles, excludeId = 0) => {
  await TrackPlayer.reset();
  let tracks = [];
  console.log('CONFIG:', Config.FILE_SERVER_URL)
  playlistFiles.map(file => {
    if (excludeId != file.id) {
      const track = {
        id: file.id,
        url: file.url,
        title: file.name,
        duration: file.duration,
      };
      tracks.push(track);
    }
  });
  await TrackPlayer.add(tracks);
};

export const usePlayPlaylist = (id) => {
  const getPlaylistProgress = useGetPlaylistProgress();
  const [playerPlaylist, setPlayerPlaylist] =
    useRecoilState(playerPlaylistAtom);
  const [playerTrack, setPlayerTrack] = useRecoilState(playerTrackAtom);
  const setPlaylistProgressCompleted = useSetPlaylistProgressCompleted()
  const saveLastPlayedPlaylist = useSaveLastPlayedPlaylist()
  const [playlistProgress, setPlaylistProgress] = useRecoilState(playlistProgressAtom(id));
  const getPlaylist = useGetPlaylist()

  return async playlist => {
    // const playlist = await getPlaylist(_playlist.id)
    const data = await getPlaylistProgress(playlist.id);
    const prevState = playerPlaylist;
    setPlayerPlaylist({name: playlist.name, id: playlist.id, saving: true});
    saveLastPlayedPlaylist(playlist.id)
    try {
      if (playlist.id != playerPlaylist.id) {
        await addWholePlaylistToQueue(playlist.files);
      }
      if (data) {
        if (data.completed) {
          await TrackPlayer.skip(0);
          setPlaylistProgress({completed: false})
        } else {
          if (data.track_id && data.progress) {
            await TrackPlayer.skip(await findFileId(data.track_id));
            await TrackPlayer.seekTo(Math.floor(data.progress));
            setPlayerTrack({...playerTrack, id: data.track_id});
            console.log('restore completed');
          }
        }
      } else {
        await TrackPlayer.skip(0); 
      }
      await TrackPlayer.play();
    } catch (error) {
      console.error(error);
      setPlayerPlaylist(prevState);
    }
    TrackPlayer.play();
  };
};

export const usePlayFile = () => {
  const [playerPlaylist, setPlayerPlaylist] =
    useRecoilState(playerPlaylistAtom);
  const [playerTrack, setPlayerTrack] = useRecoilState(playerTrackAtom);
  const setShowPlayerModal = useSetRecoilState(showPlayerModalAtom);

  return async (file_id, playlist, seek = 0) => {
    const prevPlayerTrack = playerTrack;
    setPlayerTrack({...playerTrack, id: file_id});

    if (file_id == playerTrack.id) {
      await TrackPlayer.play();
      setShowPlayerModal(true);
      return;
    }
    try {
      if (playerPlaylist.id === playlist.id) {
        await TrackPlayer.skip(await findFileId(file_id));
        await TrackPlayer.play();
      } else {
        let file;
        playlist.files.map(f => {
          if (f.id == file_id) {
            file = f;
          }
        });
        await TrackPlayer.reset();
        await TrackPlayer.add({
          id: file.id,
          url: file.url,
          title: file.name,
          duration: file.duration,
        });
        await TrackPlayer.play();
      }
      setPlayerPlaylist({id: playlist.id, name: playlist.name, saving: true});
    } catch (err) {
      setPlayerTrack(prevPlayerTrack);
    }
  };
};

export const useRestoreState = () => {
  const getPlaylist = useGetPlaylist();
  const [playerPlaylist, setPlayerPlaylist] =
    useRecoilState(playerPlaylistAtom);

  return async (playlist_id, track_id, progress) => {
    const playlist = await getPlaylist(playlist_id); // TODO this results in bitrate etc. should improve the api to give me clean results.
    if (playlist) {
      await addWholePlaylistToQueue(playlist.files);
      const id = await findFileId(track_id);
      await TrackPlayer.skip(id);
      await TrackPlayer.seekTo(progress);
      setPlayerPlaylist({id: playlist.id, name: playlist.name, saving: true});
    }
  };
};

export const useJumpBackward = () => {
  const toast = useToast();
  return async position => {
    try {
      TrackPlayer.seekTo(Math.floor(position) - 10);
    } catch (error) {
      toast.show({description: 'Seek error'});
      console.error(error);
    }
  };
};

export const useJumpForward = () => {
  const toast = useToast();
  return async position => {
    try {
      TrackPlayer.seekTo(Math.floor(position) + 10);
    } catch (error) {
      toast.show({description: 'Seek error'});
      console.error(error);
    }
  };
};

export const useChangePlaybackSpeed = () => {
  const [playerInfo, setPlayerInfo] = useRecoilState(playerInfoAtom);
  const toast = useToast();
  return async rate => {
    try {
      await TrackPlayer.setRate(rate);
      setPlayerInfo({...playerInfo, rate: rate});
    } catch (error) {
      toast.show({description: 'Seek error'});
      console.error('Couldnt change playback speed : ', error);
    }
  };
};

export const useTogglePlayPause = () => {
  const [playerInfo, setPlayerInfo] = useRecoilState(playerInfoAtom);
  return async () => {
    const state = await TrackPlayer.getState();
    if (state === TrackPlayerState.Playing) {
      try {
        setPlayerInfo({...playerInfo, icon: 'play'});
        await TrackPlayer.pause();
      } catch (error) {
        setPlayerInfo({...playerInfo, icon: 'pause'});
        console.error('Couldnt pause : ', error); //TODO something with error message?
      }
    }
    if (state === TrackPlayerState.Paused) {
      try {
        setPlayerInfo({...playerInfo, icon: 'pause'});
        await TrackPlayer.play();
      } catch (error) {
        setPlayerInfo({...playerInfo, icon: 'play'});
        console.error('Couldnt play : ', error);
      }
    }
  };
};

export const useDestroyPlayer = () => {
  return async () => {
    try {
      await TrackPlayer.destroy();
    } catch (error) {
      console.error('Couldnt destroy');
    }
  };
};

export const useSkipToNext = () => {
  const toast = useToast();
  return async () => {
    try {
      await TrackPlayer.skipToNext();
    } catch (error) {
      toast.show({
        id: 1,
        description: 'No more tracks to play',
        duration: 3000,
      });
      console.error('skip to next error : ', error);
    }
  };
};

export const useSkipToPrevious = () => {
  const toast = useToast();
  return async () => {
    try {
      await TrackPlayer.skipToNext();
    } catch (error) {
      toast.show({
        id: 1,
        description: 'No more tracks to play',
        duration: 3000,
      });
      console.error('skip to previous error : ', error);
    }
  };
};

export const useSeekTo = () => {
  return async value => TrackPlayer.seekTo(value);
};

export const useSetupPlayer = () => {
  return async () => {
    console.log('SETUP PLAYER');
    TrackPlayer.setupPlayer()
      .then(() => {
        console.log('SETUP PLAYER SUCCESS');
        TrackPlayer.updateOptions({
          stopWithApp: false,
          capabilities: [
            Capability.Play,
            Capability.Pause,
            Capability.JumpForward,
            Capability.JumpBackward,
            Capability.Stop,
          ],
          compactCapabilities: [
            Capability.Play,
            Capability.Pause,
            Capability.JumpForward,
            Capability.JumpBackward,
            Capability.Stop,
          ],
          forwardJumpInterval: 10,
          backwardJumpInterval: 10,
          // stopIcon: require('../assets/back15.png')
        });
      })
      .catch(error => console.error('Couldnt setup player : ', error));
  };
};

const updateTrackName = async (file_id, name) => {
  //TODO use it
  TrackPlayer.updateMetadataForTrack(findFileId(file_id), {title: name});
};
