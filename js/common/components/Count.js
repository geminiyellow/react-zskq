import React, { PureComponent } from 'react';
import { DeviceEventEmitter, TouchableHighlight, View } from 'react-native';
import Image from '@/common/components/CustomImage';
import EStyleSheet from 'react-native-extended-stylesheet';
import Input from '@/common/components/Input';
import { device } from '@/common/Util';
import _ from 'lodash';

const addNormal = 'add_normal';
const addDisable = 'add_disable';
const reduceNormal = 'reduce_normal';
const reduceDisable = 'reduce_disable';

export default class Count extends PureComponent {

  constructor(...args) {
    super(...args);
    this.state = {
      textValue: this.props.textValue,
      isMinusDisable: true,
      isAddDisable: false,
    };
  }

  onMinus() {
    if (this.state.textValue == '') {
      DeviceEventEmitter.emit('REPEAT_INPUT_EMPTY_ERR', '');
      return;
    }
    let minusNum = parseInt(this.state.textValue);
    if (minusNum <= 2) {
      this.setState({
        textValue: 1,
        isMinusDisable: true,
      });
    } else {
      if (this.state.isAddDisable) {
        this.setState({
          isMinusDisable: false,
          isAddDisable: false,
          textValue: minusNum - 1,
        });
      } else {
        this.setState({
          isMinusDisable: false,
          textValue: minusNum - 1,
        });
      }
    }
    const { onDown } = this.props;
    onDown(minusNum - 1);
  }

  onAdd() {
    if (this.state.textValue == '') {
      DeviceEventEmitter.emit('REPEAT_INPUT_EMPTY_ERR', '');
      return;
    }
    let addNum = parseInt(this.state.textValue);
    if (addNum >= 998) {
      this.setState({
        isAddDisable: true,
        textValue: 999,
      });
    } else {
      if (this.state.isMinusDisable) {
        this.setState({
          isMinusDisable: false,
          isAddDisable: false,
          textValue: addNum + 1,
        });
      } else {
        this.setState({
          isAddDisable: false,
          textValue: addNum + 1,
        });
      }
    }
    const { onUp } = this.props;
    onUp(addNum + 1);
  }

  onRenderLeftView() {
    if (this.state.isMinusDisable) {
      return (
        <View style={styles.leftViewStyle}>
          <Image style={styles.imgStyle} source={{ uri: reduceDisable }} />
        </View>
      );
    } else {
      return (
        <TouchableHighlight
          activeOpacity={0.9}
          underlayColor={'#cccccc'}
          onPress={() => this.onMinus()}>
          <View style={styles.leftViewStyle}>
            <Image style={styles.imgStyle} source={{ uri: reduceNormal }} />
          </View>
        </TouchableHighlight>
      );
    }
  }

  onRenderAddView() {
    if (this.state.isAddDisable) {
      return (
        <View style={styles.rightViewStyle}>
          <Image style={styles.imgStyle} source={{ uri: addDisable }} />
        </View>
      );
    } else {
      return (
        <TouchableHighlight
          activeOpacity={0.9}
          underlayColor={'#cccccc'}
          onPress={() => this.onAdd()}>
          <View style={styles.rightViewStyle}>
            <Image style={styles.imgStyle} source={{ uri: addNormal }} />
          </View>
        </TouchableHighlight>
      );
    }
  }

  onTextChange = (inputValue) => {
    const re = /^\d+$/;
    if (_.isEmpty(inputValue)) {
      this.setState({
        textValue: inputValue,
      });
    } else {
      if (!re.test(inputValue)) {
        // 减号显示不可点击
        if (this.state.isAddDisable) {
          this.setState({
            isMinusDisable: true,
            isAddDisable: false,
            textValue: 1,
          });
        } else {
          this.setState({
            isMinusDisable: true,
            textValue: 1,
          });
        }
        DeviceEventEmitter.emit('REPEAT_INPUT_TYPE_ERR', '');
      } else {
        const value = parseInt(inputValue);
        if (value == 0) {
          this.setState({
            textValue: 1,
          });
          DeviceEventEmitter.emit('REPEAT_INPUT_NUM_ERR', '');
        } else if (value == 999) {
          // 加号显示不可点击
          if (this.state.isMinusDisable) {
            this.setState({
              isMinusDisable: false,
              isAddDisable: true,
              textValue: 999,
            });
          } else {
            this.setState({
              isAddDisable: true,
              textValue: 999,
            });
          }
        } else if (value == 1) {
          // 减号显示不可点击
          if (this.state.isAddDisable) {
            this.setState({
              isMinusDisable: true,
              isAddDisable: false,
              textValue: 1,
            });
          } else {
            this.setState({
              isMinusDisable: true,
              textValue: 1,
            });
          }
        } else {
          if (parseInt(inputValue) == 1) {
            // 减号显示不可点击
            if (this.state.isAddDisable) {
              this.setState({
                isMinusDisable: true,
                isAddDisable: false,
                textValue: 1,
              });
            } else {
              this.setState({
                isMinusDisable: true,
                textValue: 1,
              });
            }
            return;
          }
          if (parseInt(inputValue) == 999) {
            // 加号显示不可点击
            if (this.state.isMinusDisable) {
              this.setState({
                isMinusDisable: false,
                isAddDisable: true,
                textValue: 999,
              });
            } else {
              this.setState({
                isAddDisable: true,
                textValue: 999,
              });
            }
            return;
          }
          this.setState({
            isMinusDisable: false,
            isAddDisable: false,
            textValue: value,
          });
        }
      }
    }
    const { onInput } = this.props;
    onInput(parseInt(inputValue));
  }

  onExportNum() {
    // 当重复次数为空时 即点击输入框未执行输入操作
    if (_.isEmpty(this.state.textValue)) {
      this.setState({
        textValue: 1,
      });
    }
    return this.state.textValue;
  }

  render() {
    if (isNaN(this.state.textValue)) {
      this.setState({
        textValue: 1,
      });
    } else {
      if (parseInt(this.state.textValue) == 1) {
        // 减号显示不可点击
        if (this.state.isAddDisable) {
          this.setState({
            isMinusDisable: true,
            isAddDisable: false,
          });
        } else {
          this.setState({
            isMinusDisable: true,
            textValue: 1,
          });
        }
      } else
        if (parseInt(this.state.textValue) == 999) {
          // 加号显示不可点击
          if (this.state.isMinusDisable) {
            this.setState({
              isMinusDisable: false,
              isAddDisable: true,
            });
          } else {
            this.setState({
              isAddDisable: true,
              textValue: 999,
            });
          }
        } else {
          this.setState({
            isMinusDisable: false,
            isAddDisable: false,
          });
        }
    }
    if (device.isIos) {
      return (
        <View style={styles.containStyle}>
          {this.onRenderLeftView()}
          <Input
            style={styles.textStyle}
            value={`${this.state.textValue}`}
            keyboardType='numeric'
            clearButtonMode={'never'}
            multiline={false}
            maxLength={3}
            onChangeText={this.onTextChange} />
          {this.onRenderAddView()}
        </View>
      );
    }
    return (
      <View style={styles.containStyle}>
        {this.onRenderLeftView()}
        <Input
          style={styles.textStyle}
          value={`${this.state.textValue}`}
          keyboardType='numeric'
          multiline={false}
          maxLength={3}
          onChangeText={this.onTextChange} />
        {this.onRenderAddView()}
      </View>
    );
  }
}

const styles = EStyleSheet.create({
  containStyle: {
    flexDirection: 'row',
    width: 96,
    height: 26,
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#cccccc',
  },
  leftViewStyle: {
    width: 27,
    height: 26,
  },
  imgStyle: {
    width: 12,
    height: 12,
    alignSelf: 'center',
    marginTop: 7,
  },
  rightViewStyle: {
    width: 27,
    height: 26,
  },
  textStyle: {
    width: 42,
    height: 24,
    fontSize: 12,
    color: '#333333',
    textAlign: 'center',
    paddingLeft: 0,
    marginRight: 0,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderLeftColor: '#cccccc',
    borderRightColor: '#cccccc',
  },
});