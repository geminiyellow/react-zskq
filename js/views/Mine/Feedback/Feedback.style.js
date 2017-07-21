import EStyleSheet from 'react-native-extended-stylesheet';
import { device } from '@/common/Util';

const styles = EStyleSheet.create({
  wrapper: {
    flexGrow: 1,
  },
  container: {
    backgroundColor: '$color.containerBackground',
  },
  listView: {
    paddingHorizontal: 32,
    paddingVertical: 28,
  },
  emoticonLine: {
    marginTop: 10,
    backgroundColor: '$color.white',
  },
  commentTitle: {
    marginTop: 18,
    marginLeft: 26,
    color: '$color.mainTitleTextColor',
    fontWeight: 'bold',
  },
  thumb: {
    width: 50,
    height: 50,
    alignSelf: 'center',
  },
  inputWrap: {
    flexDirection: 'row',
    backgroundColor: '$color.white',
    height: 144,
    alignItems: 'center',
    flexGrow: 1,
    marginTop: 10,
    width: device.width,
    paddingHorizontal: 20,
  },
  contentArea: {
    height: 144,
    flexGrow: 1,
    textAlignVertical: 'top',
    '@media ios': {
      paddingVertical: 5,
    },
    marginTop: 14,
    fontSize: 14,
  },
  recommendWrapper: {
    backgroundColor: '$color.white',
    paddingHorizontal: 26,
  },
  recommendTitle: {
    marginTop: 18,
    fontWeight: 'bold',
    color: '$color.mainTitleTextColor',
  },
  recommendList: {
    marginTop: 26,
    marginBottom: 16,
  },
  textWrapper: {
    height: 22,
    width: 22,
    backgroundColor: '#dcdfe5',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 1,
  },
  recommendTextWrapper: {
    marginBottom: 24,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  recommendText: {
    color: '#999999',
    fontSize: 14,
  },
});

export default styles;