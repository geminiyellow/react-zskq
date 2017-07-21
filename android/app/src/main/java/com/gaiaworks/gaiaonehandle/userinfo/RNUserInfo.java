package com.gaiaworks.gaiaonehandle.userinfo;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;

/**
 * Created by pan_g on 2016/9/7.
 */

public class RNUserInfo {

    private static RNUserInfo mRNUserInfo = null;

    private RNUserInfo(){
        // 默认构造函数
    }

    public static RNUserInfo initInstance() {
        if(null == mRNUserInfo){
            mRNUserInfo = new RNUserInfo();
        }
        return mRNUserInfo;
    }

    public String companyCode;
    public String userName;
    public String password;

    public WritableMap readUserInfoFromSD(){
        WritableMap params = Arguments.createMap();
        RNReadUserInfoFromSD userUtil = new RNReadUserInfoFromSD();
        String userInfoStr = userUtil.readSDFile();
        if(RNReadUserInfoFromSD.isNull(userInfoStr)){
            params.putString("companyCode","");
            params.putString("userName","");
            params.putString("password","");
            return params;
        }
        UserInfo userInfo = userUtil.transUserInfoByStr(userInfoStr);
        params.putString("companyCode",userInfo.getCompanyCode());
        params.putString("userName",userInfo.getUserName());
        params.putString("password",userInfo.getPassword());

        return params;
    }
}
