import EStyleSheet from 'react-native-extended-stylesheet';

const styles = EStyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '$color.containerBackground',
  },
  lineStyle: {
    marginLeft: 18,
    backgroundColor: 'green',
    color: 'red',
  },
});

export default styles;