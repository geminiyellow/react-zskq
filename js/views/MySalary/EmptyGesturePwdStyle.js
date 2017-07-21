import EStyleSheet from 'react-native-extended-stylesheet';
import { device } from '@/common/Util';

const styles = EStyleSheet.create({
  wrapper: {
    flexGrow: 1,
  },
  container: {
    flexGrow: 1,
    alignItems: 'center',
  },
  panImg: {
    width: 51,
    height: 51,
    marginTop: 60,
    marginBottom: 18,
  },
  textTitle: {
    color: '#ffffff',
    fontSize: 21,
    marginBottom: 18,
    fontWeight: 'bold',
    backgroundColor: '#ff000000',
    width: device.width,
    textAlign: 'center',
  },
  textDesc: {
    color: '#d0f6e9',
    fontSize: 16,
    backgroundColor: '#ff000000',
  },
  btnRow: {
    flexDirection: 'row',
    marginTop: 54,
  },
});

export default styles;