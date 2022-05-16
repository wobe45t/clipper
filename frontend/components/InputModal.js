import React, {useState, useEffect} from 'react';
import {View, Text, Modal, Pressable} from 'react-native';
import { colors } from '../constants/theme';

export const InputModal = ({transparent, title, children, show, onDismiss}) => {
  return (
    <Modal transparent visible={show} onRequestClose={onDismiss}>
      <View
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignContent: 'center',
          maxHeight: '70%',
          width: '80%',
          height: '60%',
          marginLeft: 'auto',
          marginRight: 'auto',
          marginTop: 'auto',
          marginBottom: 'auto',
          backgroundColor: colors.p7,
        }}>
          {/* ===HEADER=== */}
          <View style={{flexGrow: 1, width: '100%', justifyContent: 'center',  flexDirection: 'row'}}>
            <Text style={{textAlign: 'center'}}>{title}</Text>
          </View>
          <View style={{flexGrow: 9, width: '100%', flexDirection: 'column'}}>
            <Text>{children}</Text>
          </View>
      </View>
    </Modal>
  );
};

