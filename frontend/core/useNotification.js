import React, {useEffect, useState} from 'react';
// import {useToast} from 'native-base'
// import {View, Text} from 'react-native';
export const useNotificationState = () => {
  const [state, setState] = useState()
  return [state, setState]
}

export const useNotify = () => {
  const [notification, setNotification] = useNotificationState()

  useEffect(() => {
    setTimeout(() => {
      setNotification()
    }, 3000)
  }, [notification])

  return setNotification
}
export const useNotification = () => {
  const [notification, setNotification] = useNotificationState()
  return notification
}