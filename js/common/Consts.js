module.exports = {
  // 接口地址
  baseUrl: 'https://mobilesaas.hrone.cn/G4/api',
  // 接口地址（移动云）（正式）
  // baseUrlMobile: 'https://mobilecenter.hrone.cn/',
  // 接口地址（移动云）（正式）(AWS)
  // baseUrlMobile: 'https://mobile-q.gaiaworkforce.com/'
  // 接口地址（移动云）（测试）
  baseUrlMobile: 'http://114.55.105.65:8080/',
  // SPM的接口地址 http://106.15.103.65:411
  baseUrlSPM: 'http://106.15.103.65:411/api/',
  // APP版本号
  appVersion: '3.7.1',
  // 请求超时时间
  requestTimeout: 300000,
  // 提示显示动画时间
  durationToShow: 300,
  // 提示消失动画时间
  durationToHide: 300,
  // 提示动画时间
  durationTime: {
    // 成功-绿色
    success: 3000,
    // 警告-黄色
    warning: 3000,
    // 错误-红色
    error: 10000,
  },
  // 动画类型
  animationType: 'SlideFromTop',
  // 顶部消息提示类型
  messageType: {
    // 成功-绿色
    success: 'success',
    // 警告-黄色
    warning: 'warning',
    // 错误-红色
    error: 'error',
  },
  // DES加密使用的key
  desKey: 'IuFWKUut',
  // 引导页是否显示控制参数 当更新后需要显示引导页的时候只需要更改该参数（修改为跟之前不一样即可），无需显示则无需更改
  parameterToControlGuideShow: 'anythingCanWrite',
  // 接口地址
  // 启动时从AsyncStorage中读取并赋值
  // 设置企业代码后存储到AsyncStorage中并赋值
  apiAddress: '',
  // 登录后的sessionId，登录后赋值
  sessionId: '',
  // 头像色块
  actorColors: [
    '#94f062',
    '#fe8680',
    '#fec571',
    '#f8eeb0',
    '#a8c9e3',
    '#d2b9a2',
    '#e1a9e3',
    '#cccccc',
    '#fb896e',
    '#fece00',
  ],
  // 手势解锁
  gesturePwdOperation: {
    unlock: 'unlock',
    updateOrigin: 'updateOrigin',
    updateConfirm: 'updateConfirm',
    reset: 'reset',
  },
  gesturePwdSelectedOperation: null,
  gesturePwdDrawTimes: 0,
  gesturePwdDrawMaxTimes: 5,
  goLoginToResetGesturePwd: 'goLoginToResetGesturePwd',
  loginPageFromResetGesturePwd: 'loginPageFromResetGesturePwd',
  pageOptions: {
    mysalary: 'mysalary',
    salary: 'salary',
  },
  currentPage: '',
  // 更新日志
  sourceDataZh: [
    '1.请假单添加假别描述。',
    '2.用户登录会话失效优化。',
  ],

  sourceDataEn: [
    '1.Added leave type description.',
    '2.Optimized user session expiration experience.',
  ],

  sourceDataKo: [
    '1.Added leave type description.',
    '2.Optimized user session expiration experience.',
  ],
  companysCode: {
    Estee: 'Estee',
    Samsung: 'Samsung',
    Gant: 'Gant',
  },
  // 公司代码组
  companyCodeList: {
    standard: 1,
    estee: 2,
    samsung: 3,
    gant: 4,
  },
  // 九宫格组
  moduleList: {
    mobileCheckIn: 'S010010',
    scheduleQuery: 'S010020',
    leave: 'S010030',
    overtime: 'S010040',
    onBusiness: 'S010050',
    myForms: 'S010060',
    directorApprove: 'S010070',
    checkinSummary: 'S010080',
    checkinRules: 'S010090',
    availableShift: 'S010100',
    mySalary: 'S010110',
    loveCare: 'S010120',
    myStore: 'S010130',
  },
  // Log平台的参数
  logConsts: {
    // 公司的项目编码
    projectId: '596429044060d20c9c16be6b', // 正式平台
    // 公司的api
    apiKey: 'IEy1PfSBxlg0VTtpdjaNbGmWV7r76NtHHEc3Jcni', // 正式平台
  },
};
