import {StyleSheet} from 'react-native';
import {colors} from '../constants';

export const styles = StyleSheet.create({
  container: {
    display: 'flex',
    alignItems: 'center',
    height: '100%',
    width: '100%',
  },
  header: {
    flexGrow: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  // headerText: {
  //   color: 'white',
  //   letterSpacing: 1,
  //   textTransform: 'uppercase',
  //   fontSize: 24,
  //   textAlign: 'center',
  // },
  body: {
    flexGrow: 9,
    width: '90%',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  searchBar: {
    // borderBottomColor: 'transparent',
    borderTopColor: 'transparent',
    backgroundColor: 'transparent',
  },
});

export const playlistStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 10,
    marginTop: 10,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: colors.sea,
    alignItems: 'center',
  },
});
