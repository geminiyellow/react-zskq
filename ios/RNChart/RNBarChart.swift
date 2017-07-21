//
//  BarChart.swift
//  PoliRank
//
//  Created by Jose Padilla on 2/6/16.
//  Copyright © 2016 Facebook. All rights reserved.
//

import Foundation
import UIKit

@objc(RNBarChart)
class RNBarChart : BarChartView {
	
	// MARK: - Properties
	open var noDataDescription: String = "No Data Description."
	
	open var noDataDescriptionFont: NSUIFont? = NSUIFont(name: "HelveticaNeue", size: 12.0)
	
	open var noDataDescriptionTextColor: NSUIColor = NSUIColor(red: 247.0/255.0, green: 189.0/255.0, blue: 51.0/255.0, alpha: 1.0)
	
	let SCREEN_WIDTH: CGFloat = UIScreen.main.bounds.width
	
	var myLegend: CustomLegend = CustomLegend()
	
	var myBarChartDescription: BarChartDescription = BarChartDescription()
	
	let marginRight: CGFloat = 14.0
	
	// MARK: - Initializers
	override init(frame: CGRect) {
		super.init(frame: frame);
		self.frame = frame;
		self.legend.enabled = false
		self.chartDescription = nil
		
		myLegend.delegate = self
	}
	
	required init?(coder aDecoder: NSCoder) {
		fatalError("init(coder:) has not been implemented");
	}
	
	// MARK: Life cycle
	override func draw(_ rect: CGRect) {
		super.draw(rect)
		
		let optionalContext = NSUIGraphicsGetCurrentContext()
		guard let context = optionalContext else { return }
		
		let bounds = self.bounds
		
		if self.data === nil {
			context.saveGState()
			defer { context.restoreGState() }
			
			let hasText = noDataText.characters.count > 0
			let hasDescription = noDataDescription.characters.count > 0
			var textHeight = hasText ? noDataFont.lineHeight : 0.0
			if hasDescription {
				textHeight += (noDataDescriptionFont?.lineHeight)!
			}
			var y = (bounds.height - textHeight - 8 - 15 - 33 - 20) / 2.0
			
			// draw no data icon
			ChartUtils.drawImage(context: context, image: UIImage(named: "icon_chart")!, rect: CGRect(x: (frame.width-40)/2.0, y: y, width: 40, height: 33))
			y = y + 33 + 15 + noDataFont.lineHeight
			
			// draw no data description
			if hasDescription {
				ChartUtils.drawText(context: context, text: noDataDescription, point: CGPoint(x: bounds.width/2.0, y: y), align: .center, attributes: [NSFontAttributeName: noDataDescriptionFont!, NSForegroundColorAttributeName: noDataDescriptionTextColor])
			}
			
			return
		}
	}
	
	func setConfig(_ config: String!) {
		setBarLineChartViewBaseProps(config);
		
		var labels: [String] = [];
		
		var json: JSON = nil;
		if let data = config.data(using: String.Encoding.utf8) {
			json = JSON(data: data);
		};
		
		// 设置X轴显示文字
		if json["labels"].exists() {
			labels = json["labels"].arrayValue.map({$0.stringValue});
			self.xAxis.valueFormatter = DefaultAxisValueFormatter(block: {(index, _) in
				return labels[Int(index)]
			})
		}
		
		let data = getBarData(labels, json: json)
		if (data.getYMax() == 0.0) {
			self.data = nil
		} else {
			self.data = data
		}
		
		descriptionConfig(json)
		
		if let _ = self.data {

			// 添加自定义图例
//			let legendRect: CGRect = CGRect(x: SCREEN_WIDTH-189.0-14.0-48, y: 0.0, width: 189.0, height: 14.0)
//			myLegend.frame = legendRect
			self.addSubview(myLegend)
			
			// 添加自定义图表描述
			let descriptionRect: CGRect = CGRect(x: 10.0, y: 0.0, width: 95.0, height: 14.0)
			myBarChartDescription.frame = descriptionRect
			self.addSubview(myBarChartDescription)
		} else {
			myLegend.removeFromSuperview()
			myBarChartDescription.removeFromSuperview()
		}
	}
	
	/// config style of view
	func descriptionConfig(_ json: JSON!) {
		if json["drawValueAboveBar"].exists() {
			self.drawValueAboveBarEnabled = json["drawValueAboveBar"].boolValue;
		}
		if json["drawHighlightArrow"].exists() {
			//            self.drawHighlightArrowEnabled = json["drawHighlightArrow"].boolValue;
			print("未设置 drawHighlightArrow")
		}
		if json["drawBarShadow"].exists() {
			self.drawBarShadowEnabled = json["drawBarShadow"].boolValue;
		}
		
		// no data description, include text, font, color
		if json["noDataTextDescription"].exists() {
			self.noDataDescription = json["noDataTextDescription"].stringValue;
		}
		if json["infoDescriptionFontSize"].exists() {
			self.noDataDescriptionFont = self.noDataDescriptionFont?.withSize(CGFloat(json["infoDescriptionFontSize"].floatValue));
		}
		if json["infoDescriptionTextColor"].exists() {
			self.noDataDescriptionTextColor = RCTConvert.uiColor(json["infoDescriptionTextColor"].intValue);
		}
		
		// 图表左上方描述文字
		if json["descriptionText"].exists() {
			self.myBarChartDescription.text = json["descriptionText"].stringValue
		}
		
		// 图例标题信息
		if json["dataSets"].exists() {
			let dataSets = json["dataSets"].arrayObject;
			if !(dataSets!.isEmpty) {
				guard let _ = dataSets?.count, let set = dataSets?[0] else { return }
				let tmp = JSON(set)
				if tmp["stackLabels"].exists() {
					let labels: [String] = tmp["stackLabels"].arrayValue.map({$0.stringValue});
					if labels.count >= 4 {
						self.myLegend.regularText = labels[0]
						self.myLegend.overTimeText = labels[1]
						self.myLegend.leaveText = labels[2]
						self.myLegend.onBusinessText = labels[3]
					}
				}
			}
		}
	}
}

extension RNBarChart: CustomLegendDelegate {
	// MARK: - CustomLegendDelegate
	func didChangeFrame(frame: CGRect) {
		self.myLegend.frame.origin.x = SCREEN_WIDTH - frame.size.width - marginRight
	}
}
