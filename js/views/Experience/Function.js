module.exports = {
  clearIntervalTimer(timerId) {
    if (!timerId) {
      return;
    }
    clearInterval(timerId);
  },

  // 验证手机号码
  isValidPhoneNumber(number) {
    const phoneNumberReg = new RegExp(/^1[0-9]{10}$/);
    if (!phoneNumberReg.test(number)) {
      return false;
    }
    return true;
  },

  // 验证邮箱格式
  isValidEmail(mail) {
    if (mail.indexOf("@qq.com") > 0 || mail.indexOf("@163.com") > 0
      || mail.indexOf("@126.com") > 0 || mail.indexOf("@hotmail.com") > 0
      || mail.indexOf("@gmail.com") > 0 || mail.indexOf("@qq.cn") > 0
      || mail.indexOf("@163.cn") > 0 || mail.indexOf("@126.cn") > 0
      || mail.indexOf("@hotmail.cn") > 0 || mail.indexOf("@gmail.cn") > 0)
    { return false }
    const mailReg = new RegExp(/^[a-zA-Z0-9._-]*@[a-zA-Z0-9]*\.(?:com|cn)+$/);
    if (!mailReg.test(mail)) {
      return false;
    }
    return true;
  }
};