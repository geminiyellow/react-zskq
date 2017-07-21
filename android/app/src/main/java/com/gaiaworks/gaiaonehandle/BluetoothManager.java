package com.gaiaworks.gaiaonehandle;

import android.bluetooth.BluetoothAdapter;

/**
 * Created by emily on 6/27/16.
 */
public class BluetoothManager {

    public static boolean isBluetoothSupported(){
        return BluetoothAdapter.getDefaultAdapter() != null ? true : false;
    }

    public static boolean isBluetoothEnabled(){
        BluetoothAdapter bluetoothAdapter = BluetoothAdapter.getDefaultAdapter();
        if(bluetoothAdapter!=null){
            return bluetoothAdapter.isEnabled();
        }
        return false;
    }

    public static boolean turnOnBluetooth(){
        BluetoothAdapter bluetoothAdapter = BluetoothAdapter.getDefaultAdapter();
        if(bluetoothAdapter != null){
            return bluetoothAdapter.enable();
        }
        return false;
    }
}
