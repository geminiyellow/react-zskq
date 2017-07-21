import EStyleSheet from 'react-native-extended-stylesheet';
import { device } from '@/common/Util';

const styles = EStyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '$color.containerBackground',
  },
  status: {
    '@media ios': {
      height: 20,
    },
    backgroundColor: 'white',
    width: device.width,
  },
  row: {
    height: 44,
    width: device.width,
    backgroundColor: 'white',
    justifyContent: 'center',
  },
  rowFont: {
    marginLeft: 22,
    fontSize: 16,
    color: '#1fd662',
  },
});

export default styles;