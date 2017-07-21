//
//  RNLineChartValueFormatter.swift
//  ZSKQ
//
//  Created by Andy Wu on 6/13/17.
//  Copyright © 2017 Facebook. All rights reserved.
//

import Foundation

class RNLineChartValueFormatter: NSObject {
	
	// 格式化Marker显示文本
	static func stringForValue(_ value: Double) -> String? {
		let formatter = NumberFormatter()
		formatter.numberStyle = NumberFormatter.Style.decimal
		formatter.groupingSeparator = ","
		let markerValue = formatter.string(from: NSNumber(value: value))
		return markerValue
	}
	
}
