import EStyleSheet from 'react-native-extended-stylesheet';
import { device } from '@/common/Util';

const styles = EStyleSheet.create({
  flex: {
    flexGrow: 1,
  },
  background: {
    backgroundColor: '$color.containerBackground',
  },
  map: {
    width: device.width,
    height: 280,
    backgroundColor: 'gray',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default styles;