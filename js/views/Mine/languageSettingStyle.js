import EStyleSheet from 'react-native-extended-stylesheet';
import { device } from '@/common/Util';

export default styles = EStyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '$color.containerBackground',
  },
  doneButtonText: {
    fontSize: 16,
    color: '#1FD762',
    marginRight: 12,
  },
  languageItem: {
    height: 46,
    flexDirection: 'row',
    backgroundColor: '$color.white',
    alignItems: 'center',
  },
  languageItemImg: {
    width: 38,
    height: 26,
    marginVertical: 10,
    marginHorizontal: 22,
    resizeMode: 'contain',
  },
  checkBoxIcon: {
    width: 20,
    height: 20,
    marginRight: 14,
  },
  separator: {
    marginLeft: 18,
  },
  helloView: {
    backgroundColor: '#fff',
    height: 90,
    alignItems: 'center',
  },
  helloText: {
    fontSize: 36,
    top: 28,
    color: '#000',
  },
  bar: {
    backgroundColor: 'transparent',
    height: 36,
    width: device.width,
  },
  barTitleText: {
    fontSize: 10,
    height: 20,
    left: 18,
    marginTop: 16,
    color: '#999999',
  },
});