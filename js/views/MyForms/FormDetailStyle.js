import EStyleSheet from 'react-native-extended-stylesheet';
import { device } from '@/common/Util';

const FormDetailStyle = EStyleSheet.create({
  container: {
    minHeight: device.height - 60,
    backgroundColor: '$color.containerBackground',
  },
  rowStyle: {
    flexDirection: 'column',
  },
  // 附件列表内容样式
  attListStyle: {
    justifyContent: 'flex-start',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  // 行容器样式
  rowTagStyle: {
    flexDirection: 'row',
    paddingTop: 5,
    paddingBottom: 5,
  },
  // 行label样式
  rowTagTitleStyle: {
    fontSize: 14,
    color: '#030303',
  },// 行label样式
  rowTagTitle1Style: {
    fontSize: 14,
    color: '#030303',
    marginTop: 1,
  },
  // 行label对应的值的样式
  rowContentValueStyle: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'right',
    marginLeft: 9,
    flex: 1,
  },
  //行lable对应值文字样式
  rowContentValueTextStyle: {
    marginTop: 1,
    marginBottom: 1,
    fontSize: 14,
    color: '#666666',
    textAlign: 'right',
    marginLeft: 9,
    flex: 1,
  },
  // 分隔线样式
  lineStyle: {
  },
  // 表单状态text样式
  statusStyle: {
    maxWidth: 170,
    fontSize: 14,
    color: '#FFC800',
  },
  // 表单状态容器样式
  statusContainerStyle: {
    marginLeft: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 14,
    backgroundColor: '#F8F8F8',
  },
  // 表单头部容器样式
  formheadStyle: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    marginTop: 9,
    paddingLeft: 12,
    paddingRight: 12,
    borderTopWidth: device.hairlineWidth,
    borderColor: '$color.line',
  },
  // 表单概要容器样式
  formoutlineStyle: {
    backgroundColor: '#fff',
    paddingLeft: 12,
    paddingRight: 12,
    paddingTop: 10,
    paddingBottom: 10,
    borderTopWidth: device.hairlineWidth,
    borderBottomWidth: device.hairlineWidth,
    borderColor: '$color.line',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  formdetailsStyle: {
    backgroundColor: 'white',
    paddingBottom: 12,
    borderTopWidth: device.hairlineWidth,
    borderBottomWidth: device.hairlineWidth,
    borderColor: '$color.line',
  },
  formdetailsStyle2: {
    backgroundColor: 'white',
    borderTopWidth: device.hairlineWidth,
    borderBottomWidth: device.hairlineWidth,
    borderColor: '$color.line',
  },
  allTextStyle: {
    marginLeft: 5,
    color: '#666',
    fontSize: 16,
  },
});
export default FormDetailStyle;