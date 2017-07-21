//条形图显示时，会弹出对话框
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import React, { Component } from 'react';
import I18n from 'react-native-i18n';
import DeviceInfo from 'react-native-device-info';
import { device } from '../Util';

export default class Alert extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showAlert: true,
    };
  }
  componentDidMount() {
    // console.log('System Version', DeviceInfo.getSystemVersion());
  }

  onBtnPressed() {
    this.setState({
      showAlert: false,
    });
  }
  //条形图显示时，弹出对话框
  renderAlert() {
    if (device.isIos && DeviceInfo.getSystemVersion().charAt(0) == '7') {
      if (this.state.showAlert) {
        return (
          <View style={styles.container}>
            <Text style={styles.description}>{I18n.t('alertIOS7Msg')}</Text>
            <View style={styles.btnBlock}>
              <TouchableOpacity style={styles.btnWrapper} onPress={() => this.onBtnPressed()}>
                <Text style={styles.btnText}>{I18n.t('alertGot')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      }
    }
    return null;
  }

  render() {
    return (
      <View>
        {this.renderAlert()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 0,
    backgroundColor: '#fd4e48',
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 14,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  description: {
    color: '#ffffff',
    fontSize: 15,
    flexGrow: 4,
    paddingRight: 18,
  },
  btnBlock: {
    flexGrow: 1,
    marginRight: 0,
    justifyContent: 'center',
  },
  btnWrapper: {
    borderWidth: 1,
    borderRadius: 2,
    borderColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    width: 60,
    height: 24,
  },
  btnText: {
    color: '#ffffff',
    fontSize: 14,
  },
});

