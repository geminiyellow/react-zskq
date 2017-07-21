//
//  TouchIDManger.swift
//  ZSKQ
//
//  Created by Andy Wu on 4/14/17.
//  Copyright © 2017 Facebook. All rights reserved.
//

import Foundation
import LocalAuthentication

@objc class TouchIDManager: NSObject {
	
	var oldDomainState: Data?
	
	var _policy: LAPolicy = LAPolicy.deviceOwnerAuthenticationWithBiometrics
	var myPolicy: LAPolicy {
		get {
			if #available(iOS 9.0, *) {
				_policy = LAPolicy.deviceOwnerAuthentication
			}
			return _policy
		}
	}
	
	/// 是否支持TouchID
	func canEvaluatePolicy() -> Bool {
		let myContext = LAContext()
		
		var authError: NSError? = nil
		if #available(iOS 8.0, *) {
			if myContext.canEvaluatePolicy(myPolicy, error: &authError) {
				return true
			} else {
				return false
			}
		} else {
			// system version < 8.0
			return false
		}
	}
	
	/// 验证TouchID
	func evaluatePolicy(_ title: String) {
		let myContext = LAContext()
		myContext.localizedFallbackTitle = ""
		let myLocalizedReasonString = title
		
		var authError: NSError?
		if #available(iOS 8.0, *) {
			if myContext.canEvaluatePolicy(myPolicy, error: &authError) {
				if #available(iOS 9.0, *) {
					oldDomainState = myContext.evaluatedPolicyDomainState
				} else {
					// Fallback on earlier versions
				}
				
				myContext.evaluatePolicy(myPolicy, localizedReason: myLocalizedReasonString, reply: {(success, evaluateError) in
					var value: Bool = false
					var message: String?
					
					if (success) {
						value = true
						message = ""
						if #available(iOS 9.0, *) {
							if let domainState = myContext.evaluatedPolicyDomainState {
								if domainState == self.oldDomainState {
									message = "1"
								}
							} else {
								message = "2"
							}
						} else {
							// Fallback on earlier versions
						}
						
					} else {
						if let error = evaluateError {
							if #available(iOS 9.0, *) {
								switch error {
								case LAError.appCancel:
									message = "appCancel"
									
								case LAError.authenticationFailed:
									message = "authenticationFailed"
									
								case LAError.invalidContext:
									message = "invalidContext"
									
								case LAError.passcodeNotSet:
									message = "passcodeNotSet"
									
								case LAError.systemCancel:
									message = "SystemCancel"
									
								case LAError.touchIDLockout:
									message = "touchIDLockout"
									
								case LAError.touchIDNotAvailable:
									message = "touchIDNotAvailable"
									
								case LAError.touchIDNotEnrolled:
									message = "touchIDNotEnrolled"
									
								case LAError.userCancel:
									message = "userCancel"
									
								case LAError.userFallback:
									message = "userFallback"
									
								default:
									message = "undefined error code"
								}
							} else {
								switch error {
								case LAError.authenticationFailed:
									message = "authenticationFailed"
									
								case LAError.passcodeNotSet:
									message = "passcodeNotSet"
									
								case LAError.systemCancel:
									message = "systemCancel"
									
								case LAError.touchIDNotAvailable:
									message = "touchIDNotAvailable"
									
								case LAError.touchIDNotEnrolled:
									message = "touchIDNotEnrolled"
									
								case LAError.userCancel:
									message = "userCancel"
									
								case LAError.userFallback:
									message = "userFallback"
									
								default:
									message = "undefined error code"
								}
							}
						}
					}
					
					var dic = [String: Any]()
					dic["value"] = value
					dic["msg"] = message
					
					let myEventSender = EventSender.sharedInstance()
					myEventSender?.sendEvent(withName: "EVENT_WITH_TOUCHID", body:dic)
				})
				
			} else {
				// could not evaluate policy
			}
		} else {
			// system version < 8.0
		}
	}

}
