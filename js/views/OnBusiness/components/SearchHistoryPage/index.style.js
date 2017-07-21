import EStyleSheet from 'react-native-extended-stylesheet';
import { device } from '@/common/Util';

const styles = EStyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '$color.containerBackground',
  },
  rowFont: {
    flexGrow: 1,
    marginLeft: 8,
    fontSize: 16,
    color: '#1fd662',
  },
  row: {
    height: 44,
    width: device.width,
    backgroundColor: 'white',
    alignItems: 'center',
    flexDirection: 'row',
  },
  listViewContainer: {
    flexGrow: 1,
  },
  list: {
    marginTop: 11,
  },
  image: {
    width: 22,
    height: 22,
    marginLeft: 30,
  },
  deleteImg: {
    width: 22,
    height: 22,
    marginRight: 12,
  },
  lineBackground: {
    backgroundColor: '#ffffff',
  },
  line: {
    marginLeft: 26,
    backgroundColor: '#EBEBEB',
  },
});

export default styles;