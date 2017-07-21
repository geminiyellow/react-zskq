//
//  RNKeychainManager.m
//  ZSKQ
//
//  Created by Tadas.Gao on 16/6/24.
//  Copyright © 2016年 Facebook. All rights reserved.
//

#import "RNKeychainManager.h"
#import <SAMKeychain.h>

@implementation RNKeychainManager

RCT_EXPORT_MODULE();

RCT_REMAP_METHOD(getDeviceId, getDeviceIdWithSuccessCallback:(RCTResponseSenderBlock)successBlock) {
  if (!successBlock) {
    return;
  }
  
  NSString *returnID;
  NSString *returnDeviceID;
  NSString *SIMID;
  NSString *deviceID = [[[UIDevice alloc] init].identifierForVendor.UUIDString substringToIndex:8];
  
  NSMutableDictionary *dic = (NSMutableDictionary *)[Keychain load:KEY_DEVICE_ID_IN_KEYCHAIN];
  if (dic && dic[KEY_DEVICE_ID] && dic[KEY_DEVICE_ID] != nil) {
    returnDeviceID = dic[KEY_DEVICE_ID];
  } else {
    NSMutableDictionary *dict = [NSMutableDictionary dictionary];
    dict[KEY_DEVICE_ID] = deviceID;
    [Keychain save:KEY_DEVICE_ID_IN_KEYCHAIN data:dict];
    returnDeviceID = ((NSMutableDictionary *)[Keychain load:KEY_DEVICE_ID_IN_KEYCHAIN])[KEY_DEVICE_ID];
  }
  
  NSMutableDictionary *dict = (NSMutableDictionary *)[Keychain load:KEY_SIM_ID_IN_KEYCHAIN];
  SIMID = dict[KEY_SIM_ID];

  returnID = [Util md5HexDigest:[NSString stringWithFormat:@"%@%@", returnDeviceID, SIMID]];

  successBlock(@[returnID]);
}

RCT_REMAP_METHOD(getUserInfo, getUserInfoWithSuccessCallback:(RCTResponseSenderBlock)successBlock) {
  if (!successBlock) {
    return;
  }
  
  NSString *returnCompanyCode = @"";
  NSString *returnUserName = @"";
  NSString *returnPassword = @"";
  
  NSString *companyCode = [SAMKeychain passwordForService:KEY_OLD_KEYCHAIN account:KEY_COMPANY_CODE];
  NSString *userName = [SAMKeychain passwordForService:KEY_OLD_KEYCHAIN account:KEY_USER_NAME];
  NSString *password = [SAMKeychain passwordForService:KEY_OLD_KEYCHAIN account:KEY_PASSWORD];
  
  if (companyCode) {
    returnCompanyCode = companyCode;
  }
  
  if (userName) {
    returnUserName = userName;
  }
  
  if (password) {
    returnPassword = password;
  }
  
  successBlock(
      @[
        @{
          @"companyCode": returnCompanyCode,
          @"userName": returnUserName,
          @"password": returnPassword
        }
      ]
  );
}

RCT_REMAP_METHOD(getDeviceIdSplit, getDeviceIdSplitWithSuccessCallback:(RCTResponseSenderBlock)successBlock) {
  if (!successBlock) {
    return;
  }
  
  NSString *returnID;
  NSString *returnDeviceID;
  NSString *SIMID;
  NSString *deviceID = [[[UIDevice alloc] init].identifierForVendor.UUIDString substringToIndex:8];
  
  NSMutableDictionary *dic = (NSMutableDictionary *)[Keychain load:KEY_DEVICE_ID_IN_KEYCHAIN];
  if (dic && dic[KEY_DEVICE_ID] && dic[KEY_DEVICE_ID] != nil) {
    returnDeviceID = dic[KEY_DEVICE_ID];
  } else {
    NSMutableDictionary *dict = [NSMutableDictionary dictionary];
    dict[KEY_DEVICE_ID] = deviceID;
    [Keychain save:KEY_DEVICE_ID_IN_KEYCHAIN data:dict];
    returnDeviceID = ((NSMutableDictionary *)[Keychain load:KEY_DEVICE_ID_IN_KEYCHAIN])[KEY_DEVICE_ID];
  }
  
  NSMutableDictionary *dict = (NSMutableDictionary *)[Keychain load:KEY_SIM_ID_IN_KEYCHAIN];
  SIMID = dict[KEY_SIM_ID];
  
  returnID = [Util md5HexDigest:[NSString stringWithFormat:@"%@%@", returnDeviceID, SIMID]];
  NSMutableDictionary *dicInfo = [[NSMutableDictionary alloc] init];
  [dicInfo setObject:[Util md5HexDigest:[NSString stringWithFormat:@"%@", returnDeviceID]] forKey:@"DeviceID"];
  [dicInfo setObject:[Util md5HexDigest:[NSString stringWithFormat:@"%@", SIMID]] forKey:@"SIMID"];
  
  successBlock(@[dicInfo]);
}

@end
