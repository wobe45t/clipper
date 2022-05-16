import {atom, selector} from 'recoil'

export const playerTrackAtom = atom({
    key: 'playerTrackAtom',
    default: {
        name: null,
        id: null,
        position: 0,
        duration: 0,
    }
})

export const playerPlaylistAtom = atom({
    key: 'playerPlaylistAtom',
    default: {
        id: null,
        name: null,
        saving: false
    }
})

export const playerInfoAtom = atom({
    key: 'playerInfoAtom',
    default: {
        rate: 1,
        icon: 'play',
        playing: false
    }
})

    //   default:
    //     if (method instanceof DefaultValue) {
    //       set(targetYearAtom, method);
    //     }
    //     return;


export const showPlayerModalAtom = atom({
    key: 'playerModalAtom',
    default: false
})

export const playerQueueAtom = atom({
    key: 'playerQueueAtom',
    default: []
})