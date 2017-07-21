/**
 * 附加的选择提示信息
 */
import React, { PureComponent } from "react";
import { View } from "react-native";
import I18n from "react-native-i18n";
import Modal from "react-native-modalbox";
import ImagePicker from "react-native-image-crop-picker";
import EStyleSheet from "react-native-extended-stylesheet";
import { device } from "@/common/Util";
import Line from "@/common/components/Line";
import Text from "@/common/components/TextField";

export default class Attachment extends PureComponent {
  open(multiple) {
    if (this.modal) {
      this.modal.open();
      this.multiple = multiple;
    }
  }

  close() {
    if (this.modal) {
      this.modal.close();
    }
  }

  /**
   * 加载图片的类库
   */
  loadLibrary() {
    this.close();
    this.loadLibraryTimer = setTimeout(() => this.loadImagePicker(), 70);
  }

  /**
   * 加载图片的类库计时器
   */
  loadImagePicker() {
    ImagePicker.openPicker({
      multiple: this.multiple,
      includeBase64: true,
      compressImageQuality: 0.5,
    })
      .then(images => {
        clearTimeout(this.loadLibraryTimer);
        this.close();
        if (this.props.loadData) {
          this.props.loadData(images);
        }
      })
      .catch(err => {
        clearTimeout(this.loadLibraryTimer);
        this.close();
        if (device.isIos) {
          if(err == 'Error: Cannot access images. Please allow access if you want to be able to select images.'){
            if (this.props.loadLibrary) {
              this.props.loadLibrary();
            }
          }
        }
      });
  }

  /**
   * 拍照
   */
  takePhotos() {
    this.close();
    this.takePhotosTimer = setTimeout(() => this.takeImagePicker(), 70);
  }


  /**
   * 拍照的计时器
   */
  takeImagePicker() {
    ImagePicker.openCamera({
      includeBase64: true,
      compressImageQuality: 0.5,
    })
      .then(images => {
        clearTimeout(this.takePhotosTimer);
        this.close();
        if (this.props.loadData) {
          this.props.loadData(images);
        }
      })
      .catch(err => {
        clearTimeout(this.takePhotosTimer);
        this.close();
        if (device.isIos) {
          if(err == 'Error: User did not grant camera permission.'){
            if (this.props.takePhotos) {
              this.props.takePhotos();
            }
          }
        }
      });
  }

  getResult() {
    return this.image;
  }

  render() {
    return (
      <Modal
        style={styles.modalBg}
        position={"bottom"}
        ref={ref => {
          this.modal = ref;
        }}
        swipeToClose={false}
        animationDuration={100}
        backdropOpacity={0.4}
        onClosed={() => this.close()}
      >
        <View style={styles.top}>
          <Text style={styles.top} onPress={() => this.close()} />
        </View>
        <View style={styles.title}>
          <Text style={styles.titleFont}>
            {I18n.t("mobile.module.leaveapply.leaveapplyattachtitle")}
          </Text>
        </View>
        <Line style={styles.lineBg} />
        <View style={styles.camera}>
          <Text style={styles.libraryFont} onPress={() => this.takePhotos()}>
            {I18n.t("mobile.module.leaveapply.leaveapplyattachcamera")}
          </Text>
        </View>
        <Line style={styles.lineBg} />
        <View style={styles.library}>
          <Text style={styles.libraryFont} onPress={() => this.loadLibrary()}>
            {I18n.t("mobile.module.leaveapply.leaveapplyattaclibrary")}
          </Text>
        </View>
        <View style={styles.cancel}>
          <Text style={styles.cancelFont} onPress={() => this.close()}>
            {I18n.t("mobile.module.leaveapply.leaveapplyattaccancle")}
          </Text>
        </View>
      </Modal>
    );
  }
}

const styles = EStyleSheet.create({
  modalBg: {
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    justifyContent: "flex-end"
  },
  top: {
    flex: 1
  },
  lineBg: {
    width: device.width - 20,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center"
  },
  title: {
    height: 50,
    marginHorizontal: 10,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    borderColor: "$color.white",
    backgroundColor: "$color.white",
    justifyContent: "center"
  },
  titleFont: {
    fontSize: 14,
    textAlign: "center"
  },
  camera: {
    height: 50,
    marginHorizontal: 10,
    borderColor: "$color.white",
    backgroundColor: "$color.white",
    justifyContent: "center"
  },
  library: {
    height: 50,
    marginHorizontal: 10,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    borderColor: "$color.white",
    backgroundColor: "$color.white",
    justifyContent: "center"
  },
  libraryFont: {
    fontSize: 18,
    color: "$color.mainColorLight",
    textAlign: "center"
  },
  cancel: {
    height: 50,
    marginVertical: 10,
    marginHorizontal: 10,
    borderRadius: 5,
    borderColor: "$color.white",
    backgroundColor: "$color.white",
    justifyContent: "center"
  },
  cancelFont: {
    fontSize: 18,
    color: "$color.mainColorLight",
    fontWeight: "bold",
    textAlign: "center"
  }
});
