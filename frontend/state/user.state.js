import {atom, selector} from 'recoil'

export const userAtom = atom({
    key: 'userAtom',
    default: {
        access_token: null,
        id: null,
        email: null,
        is_superuser: null 
    }
}); 

export const serverAddressAtom = atom({
    key: 'serverAddressAtom',
    default: '192.168.0.7'
})