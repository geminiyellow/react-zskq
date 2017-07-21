import { MessageBarManager } from 'react-native-message-bar';
import { durationToShow, durationToHide, durationTime, animationType, messageType } from './Consts';
import Style from './Style';

module.exports = {
  showMessage(type, message) {
    if (message) {
      let duration;
      if (type === messageType.success) {
        duration = durationTime.success;
      } else if (type === messageType.warning) {
        duration = durationTime.warning;
      } else if (type === messageType.error) {
        duration = durationTime.error;
      }

      MessageBarManager.showAlert({
        message,
        animationType,
        durationToShow,
        durationToHide,
        duration,
        viewTopInset: 20,
        viewBottomInset: 10,
        messageNumberOfLines: 5,
        stylesheetSuccess: { backgroundColor: Style.color.successColor, strokeColor: Style.color.successColor },
        stylesheetWarning: { backgroundColor: Style.color.warnColor, strokeColor: Style.color.warnColor },
        stylesheetError: { backgroundColor: Style.color.errorColor, strokeColor: Style.color.errorColor },
        messageStyle: { fontSize: Style.tip.fontSize, color: Style.tip.color },
        alertType: type,
      });
    }
  },

  hideMessage() {
    MessageBarManager.hideAlert();
  },

  isShow() {
    return MessageBarManager.isShowMessage();
  },
};