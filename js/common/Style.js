/** 全局通用样式 */

module.exports = {
  // 通用色值
  color: {
    // 白色
    white: '#FFF',
    // 表格分割线色值
    line: '#d9d9d9',
    // 卡片选中状态背景颜色
    underlayColor: '#d9d9d9',
    // 页面背景色
    containerBackground: '#EEE',
    // 主要级别文字颜色-标题
    mainTitleTextColor: '#000',
    // 正文文字颜色
    mainBodyTextColor: '#333',
    // 提示性文字
    mainAlertTextColor: '#A3A3A3',
    // 次要级别文字颜色
    titleTextColor: '#CCC',
    // 主色
    mainColorLight: '#14BE4B',
    // 主色-着重
    mainColorDark: '#10C64B',
    // 按钮禁用色值
    buttonColorDisable: '#7BF4AA',
    // 成功通知色值
    successColor: '#14BE4B',
    // 警告通知色值
    warnColor: '#FDAE1E',
    // 失败通知色值
    errorColor: '#FD4E48',
  },
  // 首页图表
  chart: {
    // 正常上班
    regularHours: '#14BE4B',
    // 加班
    overtime: '#129CF5',
    // 请假
    leave: '#F9BF13',
    // 出差
    onBusiness: '#FF801A',
  },
  // 加载页面
  loading: {
    textColor: '#949494',
    textSize: 12,
    backgroundColor: '#FFF',
  },
  // 文本输入框
  input: {
    color: '#000000',
    fontSize: 16,
    height: 48,
    borderColor: '#CCC',
  },
  // 多行文本输入框
  textArea: {
    backgroundColor: 'white',
    defaultHeight: 103,
    maxHeight: 190,
    title: {
      fontSize: 18,
      color: '#000000',
    },
    input: {
      fontSize: 14,
      color: '#333333',
      placeholderColor: '#a3a3a3',
      editingColor: '#a3a3a3',
      defaultHeight: 40,
      maxHeight: 120,
    },
    prompt: {
      fontSize: 11,
      normalColor: '#a3a3a3',
      activeColor: '#f7b82e',
    },
  },
  // 导航栏通用设置
  navigationBar: {
    height: 44,
    bottomLineColor: '#cccccc',
    background: 'white',
    homeBackgroundColor: '#14be4b',
    titleFontSize: 19,
    titleFontWeight: 'bold',
    titleColor: '#000',
    titleBottom: 5,
    leftFontSize: 16,
    leftColor: '#1fd762',
    leftMargin: 12,
    leftImageWidth: 20,
    leftImageHeight: 20,
    rightMargin: 12,
    rightImageWidth: 20,
    rightImageHeight: 20,
  },
  // 顶部消息提示
  tip: {
    fontSize: 14,
    color: '#FFF',
  },
  punch: {
    workingTimeValueColor: '#1fd662',
    workingTimeValueSize: 14,
    workingTimeLabelColor: '#999999',
    workingTimeLabelSize: 11,
    punchTextColor: '#000000',
    punchTextSize: 18,
    gpsColor: '#999999',
    gpsSize: 14,
  },
  // 按钮颜色
  button: {
    background: {
      normal: '#14be4b',
      active: '#15a53c',
      disabled: '#7df5aa',
    },
    white: '#ffffff',
  },
  // 标准分割线
  splitLine: {
    color: '#e5e5e5',
    width: 1,
  },
  // 动画加载条
  loadingLine: {
    color: '#14BE4B',
  },
  // 单行选项卡片
  optionCard: {
    backgroundColor: '#FFFFFF',
    title: {
      fontSize: 18,
      color: '#000000',
    },
    detailText: {
      fontSize: 14,
      color: '#666666',
    },
  },
  // 带输入框的卡片
  inputCard: {
    backgroundColor: '#FFFFFF',
    title: {
      fontSize: 18,
      color: '#000000',
    },
    input: {
      placeholderColor: '#a3a3a3',
      fontSize: 14,
      color: '#666666',
    },
  },
  // 带开关的卡片
  switchCard: {
    backgroundColor: '#FFFFFF',
    defaultHeight: 48,
    height: 60,
    title: {
      fontSize: 18,
      color: '#000000',
    },
    detail: {
      fontSize: 13,
      color: '#999999',
    },
  },
  // 组件间间距
  margin: 10,
  // 导航栏
  navBar: {
    whiteBackground: '#FFFFFF',
    greenBackground: '#14BE4B',
    title: {
      fontSize: 19,
      color: '#000',
      whiteColor: '#FFFFFF',
      fontWeight: 'bold',
    },
    button: {
      fontSize: 18,
      color: '#14BE4B',
    },
  },
  // 下拉刷新样式
  refreshStyle: {
    // 下拉指示器背景色
    progressBackgroundColor: '#14BE4B',
    // 下拉指示器刷新中的颜色 android
    colors: ['white'],
    // 下拉指示器刷新中的颜色 ios
    tintColor: '#14BE4B',
  },
};
