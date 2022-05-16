import {useEffect, useState} from 'react';
import {Keyboard} from 'react-native';

export function useKeyboard() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setVisible(true); // or some other action
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setVisible(false); // or some other action
      },
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const hideKeyboard = () => {
    Keyboard.dismiss();
  };

  return {visible, hideKeyboard};
}
