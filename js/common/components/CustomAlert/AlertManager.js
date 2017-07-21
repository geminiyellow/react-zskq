module.exports = {
  register(alert) {
    this.alertView = alert;
  },
  unregister() {
    this.alertView = null;
  },
  show() {
    if (this.alertView) {
      this.alertView.show();
      this.alertView.isShow = true;
    }
  },
  getAlertView() {
    return this.alertView;
  },
};