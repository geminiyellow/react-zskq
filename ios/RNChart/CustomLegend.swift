//
//  CustomLegend.swift
//  ZSKQ
//
//  Created by Andy Wu on 4/25/17.
//  Copyright © 2017 Facebook. All rights reserved.
//

import Foundation
import UIKit

/// 图例色块尺寸
struct LumpRect {
	let y: CGFloat = CGFloat(0.0)
	let width: CGFloat = CGFloat(13.0)
	let height: CGFloat = CGFloat(13.0)
}

/// 图例文本尺寸
struct LabelRect {
	let y: CGFloat = CGFloat(0.0)
	let width: CGFloat = CGFloat(42.0)
	let height: CGFloat = CGFloat(14.0)
}

protocol CustomLegendDelegate {
	/// CustomLegend view did update its frame
	func didChangeFrame(frame: CGRect)
}

/// 自定义图例
open class CustomLegend: UIView {
	
	// MARK: Properties
	
	private let lumpRect: LumpRect = LumpRect()
	private let labelRect: LabelRect = LabelRect()
	private let textSize: CGFloat = CGFloat(10.0)
	private let textColor: UIColor = UIColor(red: 153/255.0, green: 153/255.0, blue: 153/255.0, alpha: 1.0)
	private let spaceWidth: CGFloat = CGFloat(5.0)
	
	var delegate: CustomLegendDelegate?
	
	/// 正常上班色块
	var view1 = UIView()
	
	/// 加班色块
	var view2 = UIView()
	
	/// 请假色块
	var view3 = UIView()

	/// 出差色块
	var view4 = UIView()
	
	var label1: UILabel = UILabel()
	let label2: UILabel = UILabel()
	let label3: UILabel = UILabel()
	let label4: UILabel = UILabel()
	
	var lumpLabelWith: CGFloat {
		return lumpRect.width + labelRect.width + spaceWidth // 13+30
	}
	
	/// 正常上班
	var regularText: String? {
		get {
			return label1.text
		}
		set {
			label1.text = newValue
			updateLabelFrames()
		}
	}
	
	/// 加班
	var overTimeText: String? {
		get {
			return label2.text
		}
		set {
			label2.text = newValue
			updateLabelFrames()
		}
	}
	
	/// 请假
	var leaveText: String? {
		get {
			return label3.text
		}
		set {
			label3.text = newValue
			updateLabelFrames()
		}
	}
	
	/// 出差
	var onBusinessText: String? {
		get {
			return label4.text
		}
		set {
			label4.text = newValue
			updateLabelFrames()
		}
	}
	
	// MARK: initializers
	
	override init(frame: CGRect) {
		super.init(frame: frame)
		
		// 正常上班
		view1.frame = CGRect(x: 0, y: lumpRect.y, width: lumpRect.width, height: lumpRect.height)
		view1.backgroundColor = UIColor(red: 20/255.0, green: 190/255.0, blue: 75/255.0, alpha: 1.0)
		self.addSubview(view1)
		
		label1.font = UIFont.systemFont(ofSize: textSize)
		label1.textColor = textColor
		self.addSubview(label1)
		
		// 请假
		view2.frame = CGRect(x: lumpLabelWith, y: lumpRect.y, width: lumpRect.width, height: lumpRect.height)
		view2.backgroundColor = UIColor(red: 18/255.0, green: 156/255.0, blue: 245/255.0, alpha: 1.0)
		self.addSubview(view2)
		
		label2.font = UIFont.systemFont(ofSize: textSize)
		label2.textColor = textColor
		self.addSubview(label2)
		
		// 加班
		view3.frame = CGRect(x: lumpLabelWith*2, y: lumpRect.y, width: lumpRect.width, height: lumpRect.height)
		view3.backgroundColor = UIColor(red: 249/255.0, green: 191/255.0, blue: 19/255.0, alpha: 1.0)
		self.addSubview(view3)
		
		label3.font = UIFont.systemFont(ofSize: textSize)
		label3.textColor = textColor
		self.addSubview(label3)
		
		// 出差
		view4.frame = CGRect(x: lumpLabelWith*3, y: lumpRect.y, width: lumpRect.width, height: lumpRect.height)
		view4.backgroundColor = UIColor(red: 255/255.0, green: 128/255.0, blue: 26/255.0, alpha: 1.0)
		self.addSubview(view4)
		
		label4.font = UIFont.systemFont(ofSize: textSize)
		label4.textColor = textColor
		self.addSubview(label4)
	}

	required public init?(coder aDecoder: NSCoder) {
		fatalError("init(coder:) has not been implemented")
	}
	
	// MARK: Helpers
	
	/// 当设置legend Text时，调整legend的frame
	func updateLabelFrames() {
		label1.sizeToFit()
		
		if label1.frame.width > 50.0 {
			label1.frame.size.width = 50.0
		}
		label1.frame.origin.x = view1.frame.origin.x + view1.frame.size.width + 5.0
		view2.frame.origin.x = label1.frame.origin.x + label1.frame.size.width + 5.0
		
		label2.sizeToFit()
			
		if label2.frame.width > 50.0 {
			label2.frame.size.width = 50.0
		}
		label2.frame.origin.x = view2.frame.origin.x + view2.frame.size.width + 5.0
		view3.frame.origin.x = label2.frame.origin.x + label2.frame.size.width + 5.0
		
		label3.sizeToFit()
		
		if label3.frame.width > 50.0 {
			label3.frame.size.width = 50.0
		}
		label3.frame.origin.x = view3.frame.origin.x + view3.frame.size.width + 5.0
		view4.frame.origin.x = label3.frame.origin.x + label3.frame.size.width + 5.0
		label4.frame.origin.x = view4.frame.origin.x + view4.frame.size.width + 5.0
		
		label4.sizeToFit()
		
		if label4.frame.width > 50.0 {
			label4.frame.size.width = 50.0
		}
		
		let legendWidth: CGFloat = view1.bounds.width*4 + label1.bounds.width + label2.bounds.width + label3.bounds.width + label4.bounds.width + 5.0*7 + 14.0
		let legendSize = CGSize(width: legendWidth, height: 14.0)
		self.frame.size = legendSize
		delegate?.didChangeFrame(frame: self.frame)
	}
}

/// 图例左边描述
class BarChartDescription: UILabel {
	override init(frame: CGRect) {
		super.init(frame: frame)
		
		self.font = UIFont.systemFont(ofSize: CGFloat(12.0))
		self.textColor = UIColor(red: 206/255.0, green: 206/255.0, blue: 206/255.0, alpha: 1.0)
	}
	
	required init?(coder aDecoder: NSCoder) {
		fatalError("init(coder:) has not been implemented")
	}
}
