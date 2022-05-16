import {StyleSheet} from 'react-native';
import {colors} from '../constants';

export const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '100%',
  },
  header: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    flexDirection: 'row',
    width: '100%',
  },
  body: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    height: '100%',
    width: '90%',
  },
  playerContainer: {
    justifyContent: 'center',
    marginTop: 10,
    width: '80%',
  },
  button: {
    marginTop: '5%',
    marginBottom: '5%',
    borderWidth: 1,
    bodrderStyle: 'solid',
    padding: 10,
    borderColor: colors.sea,
    borderRadius: 50,
  },
  playerRow: {
    flexDirection: 'row',
    marginTop: '5%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
});
