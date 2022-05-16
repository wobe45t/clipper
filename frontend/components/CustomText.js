import React from 'react'
import {Text} from 'react-native'

export const CustomText = ({children, size}, style) => {
  let fontsize = 18
  if(size == 'sm') {
    fontsize = 14 
  }
  else if(size == 'md') {
    fontsize = 18 
  }
  else if(size == 'bg') {
    fontsize = 20 
  }
  else if(size == 'lg') {
    fontsize = 24 
  }
  return (
    <Text style={{...style, fontSize: fontsize, letterSpacing: .7, textTransform: 'uppercase'}}>{children}</Text>
  )
}

