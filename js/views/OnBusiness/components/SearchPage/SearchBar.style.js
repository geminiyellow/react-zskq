import EStyleSheet from 'react-native-extended-stylesheet';
import { device } from '@/common/Util';

const styles = EStyleSheet.create({
  flex: {
    flexGrow: 1,
  },
  container: {
    width: device.width,
    height: 44,
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
  },
  bar: {
    flexGrow: 1,
    borderWidth: 1,
    borderColor: '#f2f2f2',
    borderRadius: 6,
    paddingRight: 2,
    marginHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    height: 28,
    backgroundColor: '#f2f2f2',
    paddingBottom: 0,
  },
  button: {
    marginRight: 18,
  },
  image: {
    marginHorizontal: 8,
    width: 22,
    height: 22,
  },
  textInput: {
    flexGrow: 1,
    fontSize: 16,
    color: '#999999',
    margin: 0,
    padding: 0,
  },
  buttonText: {
    color: '#1fd662',
    fontSize: 16,
  },
  lineBackground: {
    backgroundColor: '#ffffff',
  },
  line: {
    backgroundColor: '#EBEBEB',
  },
});

export default styles;