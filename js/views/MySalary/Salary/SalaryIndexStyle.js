import EStyleSheet from 'react-native-extended-stylesheet';
import { device } from '@/common/Util';

const styles = EStyleSheet.create({
  wrapper: {
    flexGrow: 1,
  },
  container: {
    flexGrow: 1,
  },
  chooseMonth: {
    backgroundColor: '#ff000000',
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
  },
  monthIcon: {
    width: 22,
    height: 22,
    marginLeft: 18,
    marginRight: 11,
  },
  monthLabel: {
    flexGrow: 1,
    fontSize: 17,
    color: '#000000',
  },
  monthText: {
    marginRight: 11,
    fontSize: 17,
    color: '#000000',
  },
  rightArrow: {
    width: 22,
    height: 22,
    marginRight: 11,
  },
  rowItem: {
    backgroundColor: '#ff000000',
  },
  packageNameWrapper: {
    justifyContent: 'center',
    height: 16,
    marginTop: 28,
  },
  packageNameLabel: {
    marginLeft: 18,
    fontSize: 14,
    color: '$color.mainAlertTextColor',
  },
  payMoneyWrapper: {
    height: 50,
    justifyContent: 'center',
  },
  payMoney: {
    marginLeft: 18,
    fontSize: 48,
    color: '#1fd662',
    fontWeight: 'bold',
  },
  salaryStageWrapper: {
    marginTop: 14,
    height: 16,
    justifyContent: 'center',
  },
  salaryStage: {
    fontSize: 14,
    color: '$color.mainAlertTextColor',
    marginLeft: 18,
  },
  separator: {
    marginVertical: 20,
    marginHorizontal: 28,
  },
  addItemLabelWrapper: {
    height: 18,
    justifyContent: 'center',
    marginBottom: 12,
  },
  addItemLabel: {
    fontSize: 16,
    color: '$color.mainBodyTextColor',
    marginLeft: 28,
  },
  minusItemLabelWrapper: {
    height: 18,
    justifyContent: 'center',
    marginBottom: 12,
    marginTop: 16,
  },
  minusItemLabel: {
    fontSize: 16,
    color: '$color.mainBodyTextColor',
    marginLeft: 28,
  },
  salarySubItem: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginLeft: 28,
    marginRight: 40,
    height: 24,
    alignItems: 'center',
  },
  privacyItemStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
    marginTop: 30,
    height: 13,
  },
  privacyLine: {
    width: 48,
    height: 1,
    backgroundColor: '#cccccc',
  },
  privacyText: {
    fontSize: 11,
    color: '#cccccc',
    marginHorizontal: 11,
  },
  rowSeperator: {
    backgroundColor: '$color.containerBackground',
  },
  salaryWave: {
    width: device.width,
    height: 10,
    marginBottom: 28,
  },
  emptyContentWrapper: {
    backgroundColor: '#ff000000',
    paddingLeft: 18,
    height: 120,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  emptyText: {
    fontSize: 48,
    color: '#1fd662',
    fontWeight: 'bold',
  },
  grayViewSeperator: {
    height: 10,
    width: device.width,
    backgroundColor: '$color.containerBackground',
  },
  emptyGrayBg: {
    backgroundColor: '$color.containerBackground',
    height: device.height - 248,
    width: device.width,
  },
  singleItemSeperator: {
    height: device.height - 525,
    width: device.width,
    backgroundColor: '$color.containerBackground',
  },

  // New
  salaryItemsTitle: {
    fontSize: 19,
    color: '$color.mainBodyTextColor',
  },
  salaryItemsDetail: {
    color: '$color.mainAlertTextColor',
  },
});

export default styles;