import EStyleSheet from 'react-native-extended-stylesheet';
import { color } from '@/common/Style';

const styles = EStyleSheet.create({
  flex: { flex: 1 },
  background: {
    backgroundColor: '$color.containerBackground',
  },
  container: {
    flexGrow: 1,
    alignItems: 'center',
    paddingTop: 40,
    paddingHorizontal: 18,
  },
  image: {
    width: 80,
    height: 58,
    marginBottom: 21,
  },
  button: {
    color: color.mainColorLight,
    fontSize: 16,
  },
  prompt: {
    marginTop: 11,
    marginBottom: 28,
    fontSize: 14,
    color: '#999999',
  },
});

export default styles;