import TrackPlayer from 'react-native-track-player';

module.exports = async function () {
  TrackPlayer.addEventListener('remote-play', () => {
    TrackPlayer.play()
  });
  TrackPlayer.addEventListener('remote-pause', () => {
    TrackPlayer.pause()
  });
  TrackPlayer.addEventListener('remote-jump-forward', () => {
      TrackPlayer.getPosition().then(position => {
          TrackPlayer.seekTo(position + 10).then(() => {
              console.log('Seeked to position')
          }).catch(error => {console.error('Couldnt seek to position : ', error)})
      })
  });
  TrackPlayer.addEventListener('remote-jump-backward', () => {
      TrackPlayer.getPosition().then(position => {
          TrackPlayer.seekTo(position - 10).then(() => {
              console.log('Seeked to position')
          }).catch(error => {console.error('Couldnt seek to position : ', error)})
      })
  })
};
