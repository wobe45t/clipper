import React, {useEffect, useState} from 'react';
import {View, Pressable, Text} from 'react-native';
import {Modal} from 'native-base';
import {Slider} from 'react-native-elements';
import {colors} from '../constants/theme';
import { playerInfoAtom } from '../state';
import {useRecoilValue, useRecoilState} from 'recoil'
import {useChangePlaybackSpeed} from '../core'

export const PlaybackSpeedModal = ({isOpen, onClose}) => {
  const [playerInfo, setPlayerInfo] =  useRecoilState(playerInfoAtom);
  const [value, setValue] = useState()
  const changePlaybackSpeed = useChangePlaybackSpeed()

  useEffect(() => {
    if(playerInfo) {
      setValue(playerInfo.rate)
    }
  }, [playerInfo])

  return (
    <Modal isOpen={isOpen} onClose={() => onClose(false)}>
      <Modal.Content style={{backgroundColor: colors.p8}}>
        <Modal.Header>Change playback speed</Modal.Header>
        <Modal.Body>
          <View style={{width: '100%'}}>
            <Slider
              value={value}
              allowTouchTrack={true}
              onValueChange={value => setValue(value)}
              minimumValue={0.8}
              maximumValue={3}
              step={0.1}
              trackStyle={{height: 10, backgroundColor: 'transparent'}}
              thumbStyle={{
                height: 20,
                width: 20,
                backgroundColor: colors.orange,
              }}
            />
            <View
              style={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
              }}>
              <Text
                style={{fontSize: 18, textAlign: 'center'}}>
                {value && value.toFixed(1)}x
              </Text>
              <Pressable
                onPress={() => {
                  changePlaybackSpeed(value)
                  onClose(false);
                }}>
                <View
                  style={{
                    padding: 10,
                    borderColor: colors.orangeRed,
                    borderWidth: 1,
                    justifyContent: 'center',
                    borderRadius: 20,
                  }}>
                  <Text
                    style={{
                      fontSize: 18,
                      textAlign: 'center',
                    }}>
                    Accept
                  </Text>
                </View>
              </Pressable>
            </View>
          </View>
        </Modal.Body>
      </Modal.Content>
    </Modal>
  );
};
