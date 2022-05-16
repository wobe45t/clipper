import {
  atom,
  useRecoilValue,
  useRecoilState,
  selector,
  selectorFamily,
  atomFamily,
} from 'recoil';
import {tagAtom, playerPlaylistAtom} from '.';

export const playlistsAtom = atom({
  key: 'playlistsAtom',
  default: [],
});

export const captureProgressAtom = atom({
  key: 'captureProgressAtom',
  default: false,
});

export const currentPlaylistAtom = atom({
  key: 'currentPlaylistAtom',
  default: {}
})

export const storePlaylistProgressAtom = atom({
  key: 'storePlaylistProgressAtom',
  default: false
})

export const currentPlaylistSelector = selector({
  key: 'currentPlaylistSelector',
  get: ({get}) => {
    const playlists = get(playlistsAtom);
    const {id} = get(playerPlaylistAtom);
    let result;
    playlists.map(playlist => {
      if (playlist.id === id) {
        result = playlist;
      }
    });
    return result;
  },
});

export const filterAtom = atom({
  key: 'filterAtom',
  default: '',
});

export const filteredPlaylistsSelector = selector({
  key: 'filteredPlaylistsSelector',
  get: ({get}) => {
    const playlists = get(playlistsAtom);
    const filterText = get(filterAtom);
    const tags = get(tagAtom);

    if (filterText) {
      const filteredTags = tags.filter(item => {
        return item.name.toUpperCase().indexOf(filterText.toUpperCase()) > -1;
      });

      const tagNames = filteredTags.map(tag => tag.name);

      const filteredPlaylists = playlists.filter(
        playlist =>
          playlist.tags
            .map(tag => tagNames.includes(tag.name))
            .some(element => element) ||
          playlist.name.toUpperCase().indexOf(filterText.toUpperCase()) > -1,
      );
      return filteredPlaylists;
    }
    return playlists;
  },
});

export const playlistCompletedAtom = atom({
  key: 'playlistCompletedAtom',
  default: {
    playlist_id: null,
    completed: null
  }
})

export const playlistSelector = selectorFamily({
  key: 'playlistSelector',
  get:
    id =>
    ({get}) => {
      let result;
      const playlists = get(playlistsAtom);
      playlists.map(playlist => {
        if (playlist.id == id) {
          result = playlist;
        }
      });
      return result;
    },
});

export const playlistProgressAtoms = atomFamily({
  key: 'playlistProgressAtoms',
  default: {},
});

// export const playlistProgressAtomsSelector = selectorFamily({
//   key: 'playlistProgressAtomsSelector',
//   get: (id) => ({get}) => {
//     return get(playlistProgressAtoms(id))
//   },
//   set: (id, value) => set(playlistProgressAtoms(id), value)
// })

// export const playlistProgressAtom = atom({
//   key: 'playlistsProgress',
//   default: []
// })

export const playlistProgressAtom = atomFamily({
  key: 'playlistProgressAtom',
  default: {},
});

const playlistsProgressIdsAtom = atom({
  key: 'playlistsProgressIdsAtom',
  default: [],
});

const playlistProgressSelector = selectorFamily({
  key: 'playlistProgressSelector',
  get:
    id =>
    ({get}) => {
      const atom = get(playlistProgressAtom(id));
      return atom;
    },
  set:
    id =>
    ({set}, progress) => {
      set(playlistProgress(id), progress);
      set(playlistsProgressIdsAtom(id), prev => [...prev, progress.id]);
    },
});
