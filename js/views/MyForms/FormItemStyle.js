import EStyleSheet from 'react-native-extended-stylesheet';

const FormItemStyle = EStyleSheet.create({
  columnStyle: {
    flex: 1,
    flexDirection: 'column',
  },
  rowStyle: {
    overflow: 'hidden',
    flexDirection: 'row',
    margin: 5,
    marginLeft: 12,
    marginRight: 12,
    paddingRight: 12,
    borderRadius: 2,
    backgroundColor: 'white',
  },
  statusStyle: {
    fontSize: 11,
    color: '#999999',
    textAlign: 'center',
    marginLeft: 9,
    marginRight: 12,
  },
  rowTitleStyle: {
    flex: 1,
    height: 35,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderTopRightRadius: 2,
  },
  rowTitleTextStyle: {
    flex: 1,
    marginLeft: 18,
    color: '#000000',
    fontSize: 16,
  },
  rowContentStyle: {
    flex: 1,
    paddingLeft: 18,
    paddingRight: 18,
    paddingTop: 12,
    paddingBottom: 12,
    backgroundColor: '#ffffff',
    borderBottomRightRadius: 2,
  },
  itemStyle: {
    flexDirection: 'row',
    marginTop: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rowContentLabelStyle: {
    fontSize: 14,
    color: '#000000',
  },
  rowContentValueStyle: {
    fontSize: 14,
    color: '#999999',
    flex: 1,
  },
});
export default FormItemStyle;