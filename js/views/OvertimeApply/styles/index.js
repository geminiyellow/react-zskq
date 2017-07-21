import EStyleSheet from 'react-native-extended-stylesheet';
import { device } from '@/common/Util';

const styles = EStyleSheet.create({
  // --------------------------------------------------------公用的样式
  // item的背景样式
  itemAllView: {
    backgroundColor: 'white',
    marginTop: 10,
  },
  // 每一个底线的样式
  lineView: {
    marginLeft: 18,
  },

  // --------------------------------------------------------加班额度的样式
  // 额度背景信息
  otOverView: {
    height: 135,
    flexDirection: 'column',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 54,
  },
  // 加班额度超过字体显示
  overAmountFontView: {
    fontSize: 14,
    color: '#ffb600',
  },
  // 本月加班额度
  amountView: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: 54,
    marginTop: 20,
  },
  // 本月加班额度--字体
  amountFontView: {
    width: device.width - 108,
    flexDirection: 'row',
    flexWrap: 'wrap',
    fontSize: 14,
    color: '#333333',
  },
  // 本月工时显示
  workingHoursView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 54,
    marginTop: 10,
  },
  // 本月工时显示 -- 字体
  workingHoursFontView: {
    fontSize: 18,
    color: '$color.mainColorLight',
  },
  // 进度条
  progressBarView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  // 本月加班的提示信息 marginHorizontal: 54, justifyContent: 'space-between',
  infoPromptView: {
    flexDirection: 'row',
    marginTop: 16,
    marginBottom: 10,
  },
  // 本月加班的提示信息 -- 字体
  infoPromptFontViewLeft: {
    fontSize: 11,
    marginLeft: 54,
    width: (device.width - 110) / 2,
    textAlign: 'left',
    flexWrap: 'wrap',
    color: '#999999',
  },
  // 本月加班的提示信息 -- 字体
  infoPromptFontViewRight: {
    fontSize: 11,
    marginRight: 54,
    width: (device.width - 110) / 2,
    textAlign: 'right',
    flexWrap: 'wrap',
    color: '#999999',
  },
  // 本月申请加班的提示信息
  infoApplyView: {
    flexDirection: 'row',
    marginHorizontal: 54,
    marginBottom: 10,
  },
  // 本月申请加班的提示信息 -- 字体
  infoApplyFontView: {
    fontSize: 11,
    color: '#ffb600',
  },

  // --------------------------------------------------------附件的样式
  // 附件样式
  attachViewStyle: {
    flexGrow: 1,
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
  },
  // 附件列表内容样式
  attListStyle: {
    justifyContent: 'flex-start',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  // 附件列表item样式
  attListViewStyle: {
    alignSelf: 'center',
  },
  // 附件图片样式
  attachStyle: {
    height: 45,
    width: 45,
    marginLeft: 18,
    marginBottom: 10,
    alignItems: 'center',
  },
  // 附件详情Modal
  attDetailModalStyle: {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  // 每一个item的缩略图样式
  itemAttachStyle: {
    backgroundColor: '#FFFFFF',
    height: 70,
    marginTop: 24,
  },
  // 附件的说明
  attDescription: {
    height: 45,
    marginLeft: 18,
    marginTop: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // 附件的说明---字体的颜色
  attDescriptionFont: {
    color: '#a3a3a3',
    fontSize: 14,
  },

  // --------------------------------------------------------表单item的样式
  // 每一个item的样式
  itemView: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    height: 48,
    marginHorizontal: 18,
  },
  // 每一个item的样式（含有icon的图标）
  itemIconView: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    height: 48,
    marginLeft: 18,
    marginRight: 11,
  },
  // 每一个item的样式--左边
  itemLeftView: {
    color: '#000000',
    fontSize: 18,
  },
  // 每一个item的样式--右边
  itemRightView: {
    flex: 1,
    textAlign: 'right',
    color: '#666666',
    fontSize: 14,
    marginLeft: 14,
  },
  // 水平居中
  hc: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
  },
  // 显示图片和文字
  it: {
    width: 22,
    height: 22,
    marginLeft: 5,
  },

  // --------------------------------------------------------加班主界面的样式
  // 总体设置
  container: {
    flexGrow: 1,
    backgroundColor: '$color.containerBackground',
    flexDirection: 'column',
  },

  // --------------------------------------------------------餐别、用餐时数和转调休的样式
  // 用餐时数、餐别、转调休
  mealModalView: {
    backgroundColor: 'white',
    marginTop: 10,
  },

  // --------------------------------------------------------餐别弹出框的样式
  // 显示餐别时间的Item
  mealSubItemView: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#F6F6F6',
    height: 36,
  },
  // 显示餐别时间的Item-- 字体
  mealSubItemFontView: {
    marginLeft: 8,
    color: '#333333',
    fontSize: 16,
  },
  // 显示餐别图标的样式
  mealSubItemIcon: {
    width: 22,
    height: 22,
    marginLeft: 16,
  },
  // 显示modal的样式
  mealModalViewS: {
    height: 270,
    backgroundColor: 'white',
    justifyContent: 'flex-end',
  },
  // 显示modal的title
  mealModalHeadView: {
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 36,
  },
  // 显示title的TouchableOpacity的样式
  mealModalTouchableOpacity: {
    justifyContent: 'center',
    height: 36,
  },
  // 显示title的样式
  mealModalTitleView: {
    flex: 1,
    fontSize: 14,
    color: '#A3A3A3',
    textAlign: 'center',
  },
  // 显示modal的取消按钮
  mealModalCancelView: {
    color: '#14BE4B',
    fontSize: 16,
    marginHorizontal: 16,
  },
  // 显示modal的取消按钮
  mealModalConfirmView: {
    color: '#14BE4B',
    fontSize: 16,
    marginHorizontal: 16,
  },
  // 设置View的背景
  mealView: {
    backgroundColor: '#f0eff5',
  },
  // 设置ScrollView的样式
  mealScrollView: {
    height: 210,
  },
  // 设置头部的线条
  mealViewLine: {
    backgroundColor: '#EEEEEE',
  },
  // --------------------------------------------------------提交表单的样式
  // 底部样式
  bottomView: {
    position: 'absolute',
    height: 48,
    width: device.width,
    bottom: 0,
    left: 0,
    // backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'flex-end',
  },
});

export default styles;