import EStyleSheet from 'react-native-extended-stylesheet';
import { device } from '@/common/Util';

const styles = EStyleSheet.create({
  bar: {
    width: device.width,
    height: 28,
    backgroundColor: '#f0eff5',
    justifyContent: 'center',
    paddingLeft: 22,
  },
  listView: {
    flexGrow: 1,
    backgroundColor: 'red',
  },
  restCodeListView: {
    backgroundColor: 'green',
  },
  font: {
    fontSize: 14,
    color: '#999999',
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