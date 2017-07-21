//
//  BalloonMarker.swift
//  ChartsDemo
//
//  Created by Daniel Cohen Gindi on 19/3/15.
//
//  Copyright 2015 Daniel Cohen Gindi & Philipp Jahoda
//  A port of MPAndroidChart for iOS
//  Licensed under Apache License 2.0
//
//  https://github.com/danielgindi/ios-charts
//  https://github.com/danielgindi/Charts/blob/1788e53f22eb3de79eb4f08574d8ea4b54b5e417/ChartsDemo/Classes/Components/BalloonMarker.swift
//  Edit: Added textColor

import Foundation;

open class BalloonMarker: MarkerView {
    open var color: UIColor?
    open var arrowSize = CGSize(width: 15, height: 11)
    open var font: UIFont?
    open var textColor: UIColor?
    open var minimumSize = CGSize()

    internal var insets = UIEdgeInsetsMake(8.0, 8.0, 20.0, 8.0)
    internal var topInsets = UIEdgeInsetsMake(8.0, 8.0, 8.0, 8.0)
	
    fileprivate var labelns: NSString?
    fileprivate var _labelSize: CGSize = CGSize()
    fileprivate var _size: CGSize = CGSize()
    fileprivate var _paragraphStyle: NSMutableParagraphStyle?
    fileprivate var _drawAttributes = [String: AnyObject]()

    public init(color: UIColor, font: UIFont, textColor: UIColor) {
        super.init(frame: CGRect.zero);
        self.color = color
        self.font = font
        self.textColor = textColor

        _paragraphStyle = NSParagraphStyle.default.mutableCopy() as? NSMutableParagraphStyle
        _paragraphStyle?.alignment = .center
    }

    public required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented");
    }


    func drawRect(context: CGContext, point: CGPoint) -> CGRect{
        let chart = super.chartView
        let width = _size.width
        var rect = CGRect(origin: point, size: _size)
		
        if point.y - (_size.height + 8) < 0 {
			// marker向下移动
			rect.origin.y += 8
            if point.x - _size.width / 2.0 < 0 {
                drawTopLeftRect(context: context, rect: rect)
            } else if (chart != nil && point.x + width - _size.width / 2.0 > (chart?.bounds.width)!) {
                rect.origin.x -= _size.width
                drawTopRightRect(context: context, rect: rect)
            } else {
                rect.origin.x -= _size.width / 2.0
                drawTopCenterRect(context: context, rect: rect)
            }
            rect.origin.y += self.topInsets.top
            rect.size.height -= self.topInsets.top
        } else {
			// marker向上移动
			rect.origin.y -= 8
            rect.origin.y -= _size.height
            
            if point.x - _size.width / 2.0 < 0 {
                drawLeftRect(context: context, rect: rect)
            } else if (chart != nil && point.x + width - _size.width / 2.0 > (chart?.bounds.width)!) {
                rect.origin.x -= _size.width
                drawRightRect(context: context, rect: rect)
            } else {
                rect.origin.x -= _size.width / 2.0
                drawCenterRect(context: context, rect: rect)
            }
            rect.origin.y += self.insets.top
            rect.size.height -= self.insets.top + self.insets.bottom
        }
        return rect
    }

    func drawCenterRect(context: CGContext, rect: CGRect) {
		let minX = rect.minX, midX = rect.midX, maxX = rect.maxX
		let minY = rect.minY, midY = rect.midY, maxY = rect.maxY
		let radius = CGFloat(4.0)
		let arrowWidth = arrowSize.width
		let arrowHeight = arrowSize.height

        context.setFillColor((color?.cgColor)!)
        context.beginPath()
		// 绘制箭头
		context.move(to: CGPoint(x: midX+arrowWidth/2.0, y: maxY-arrowHeight))
		context.addLine(to: CGPoint(x: midX, y: maxY))
		context.addLine(to: CGPoint(x: midX-arrowWidth/2.0, y: maxY-arrowHeight))
		// 添加4个角的圆角弧度
		// 1
		context.addArc(tangent1End: CGPoint(x: minX, y: maxY-arrowHeight), tangent2End: CGPoint(x: minX, y: midY-arrowHeight/2.0), radius: radius)
		// 2
		context.addArc(tangent1End: CGPoint(x: minX, y: minY), tangent2End: CGPoint(x: midX, y: minY), radius: radius)
		// 3
		context.addArc(tangent1End: CGPoint(x: maxX, y: minY), tangent2End: CGPoint(x: maxX, y: midY-arrowHeight/2.0), radius: radius)
		// 4
		context.addArc(tangent1End: CGPoint(x: maxX, y: maxY-arrowHeight), tangent2End: CGPoint(x: midX+arrowWidth/2.0, y: maxY-arrowHeight), radius: radius)
		context.fillPath()
    }
	
	func drawRightRect(context: CGContext, rect: CGRect) {
		let minX = rect.minX, midX = rect.midX, maxX = rect.maxX
		let minY = rect.minY, midY = rect.midY, maxY = rect.maxY
		let radius = CGFloat(4.0)
		let arrowWidth = arrowSize.width
		let arrowHeight = arrowSize.height
		
		context.setFillColor((color?.cgColor)!)
		context.beginPath()
		// 绘制箭头
		context.move(to: CGPoint(x: maxX, y: midY))
		context.addLine(to: CGPoint(x: maxX, y: maxY))
		context.addLine(to: CGPoint(x: maxX-arrowWidth/2.0, y: maxY-arrowHeight))
		// 添加3个角的弧度
		// 1
		context.addArc(tangent1End: CGPoint(x: minX, y: maxY-arrowHeight), tangent2End: CGPoint(x: minX, y: midY-arrowHeight/2.0), radius: radius)
		// 2
		context.addArc(tangent1End: CGPoint(x: minX, y: minY), tangent2End: CGPoint(x: midX, y: minY), radius: radius)
		// 3
		context.addArc(tangent1End: CGPoint(x: maxX, y: minY), tangent2End: CGPoint(x: maxX, y: midY), radius: radius)
		context.fillPath()
	}
	
	func drawTopCenterRect(context: CGContext, rect: CGRect) {
		let minX = rect.minX, midX = rect.midX, maxX = rect.maxX
		let minY = rect.minY, midY = rect.midY, maxY = rect.maxY
		let radius = CGFloat(4.0)
		let arrowWidth = arrowSize.width
		let arrowHeight = arrowSize.height
		
		context.setFillColor((color?.cgColor)!)
		context.beginPath()
		// 绘制箭头
		context.move(to: CGPoint(x: midX-arrowWidth/2.0, y: minY+arrowHeight))
		context.addLine(to: CGPoint(x: midX, y: minY))
		context.addLine(to: CGPoint(x: midX+arrowWidth/2.0, y: minY+arrowHeight))
		// 添加4个角圆弧
		// 1
		context.addArc(tangent1End: CGPoint(x: maxX, y: minY+arrowHeight), tangent2End: CGPoint(x: maxX, y: midY+arrowHeight/2.0), radius: radius)
		// 2
		context.addArc(tangent1End: CGPoint(x: maxX, y: maxY), tangent2End: CGPoint(x: midX, y: maxY), radius: radius)
		// 3
		context.addArc(tangent1End: CGPoint(x: minX, y: maxY), tangent2End: CGPoint(x: minX, y: midY+arrowHeight/2.0), radius: radius)
		// 4
		context.addArc(tangent1End: CGPoint(x: minX, y: minY+arrowHeight), tangent2End: CGPoint(x: midX-arrowWidth/2.0, y: minY+arrowHeight), radius: radius)

		context.fillPath()
	}

    func drawLeftRect(context: CGContext, rect: CGRect) {
        context.setFillColor((color?.cgColor)!)
        context.beginPath()
        context.move(to: CGPoint(x: rect.origin.x, y: rect.origin.y))
        context.addLine(to: CGPoint(x: rect.origin.x + rect.size.width, y: rect.origin.y))
        context.addLine(to: CGPoint(x: rect.origin.x + rect.size.width, y: rect.origin.y + rect.size.height - arrowSize.height))
        context.addLine(to: CGPoint(x: rect.origin.x + arrowSize.width / 2.0, y: rect.origin.y + rect.size.height - arrowSize.height))
        context.addLine(to: CGPoint(x: rect.origin.x, y: rect.origin.y + rect.size.height))
        context.addLine(to: CGPoint(x: rect.origin.x, y: rect.origin.y))
        context.fillPath()
    }

    func drawTopLeftRect(context: CGContext, rect: CGRect) {
        context.setFillColor((color?.cgColor)!)
        context.beginPath()
        context.move(to: CGPoint(x: rect.origin.x, y: rect.origin.y))
        context.addLine(to: CGPoint(x: rect.origin.x + arrowSize.width / 2.0, y: rect.origin.y + arrowSize.height))
        context.addLine(to: CGPoint(x: rect.origin.x + rect.size.width, y: rect.origin.y + arrowSize.height))
        context.addLine(to: CGPoint(x: rect.origin.x + rect.size.width, y: rect.origin.y + rect.size.height))
        context.addLine(to: CGPoint(x: rect.origin.x, y: rect.origin.y + rect.size.height))
        context.addLine(to: CGPoint(x: rect.origin.x, y: rect.origin.y))
        context.fillPath()

    }

    func drawTopRightRect(context: CGContext, rect: CGRect) {
        context.setFillColor((color?.cgColor)!)
        context.beginPath()
        context.move(to: CGPoint(x: rect.origin.x + rect.size.width, y: rect.origin.y))
        context.addLine(to: CGPoint(x: rect.origin.x + rect.size.width, y: rect.origin.y + rect.size.height))
        context.addLine(to: CGPoint(x: rect.origin.x, y: rect.origin.y + rect.size.height))
        context.addLine(to: CGPoint(x: rect.origin.x, y: rect.origin.y + arrowSize.height))
        context.addLine(to: CGPoint(x: rect.origin.x + rect.size.width - arrowSize.height / 2.0, y: rect.origin.y + arrowSize.height))
        context.addLine(to: CGPoint(x: rect.origin.x + rect.size.width, y: rect.origin.y))
        context.fillPath()
    }

    open override func draw(context: CGContext, point: CGPoint) {
        if (labelns == nil) {
            return
        }

        context.saveGState()

        let rect = drawRect(context: context, point: point)
        UIGraphicsPushContext(context)

        labelns?.draw(in: rect, withAttributes: _drawAttributes)

        UIGraphicsPopContext()

        context.restoreGState()
    }

    open override func refreshContent(entry: ChartDataEntry, highlight: Highlight) {
		color = highlight.highlightColor
        var label : String;
        if let candleEntry = entry as? CandleChartDataEntry {
            label = candleEntry.close.description
        } else {
			label = RNLineChartValueFormatter.stringForValue(entry.y) ?? "0.00"
        }

        if let object = entry.data as? JSON {
            if object["marker"].exists() {
                label = object["marker"].stringValue;

                if highlight.stackIndex != -1 && object["marker"].array != nil {
                    label = object["marker"].arrayValue[highlight.stackIndex].stringValue
                }
            }
        }
        labelns = label as NSString

        _drawAttributes.removeAll()
        _drawAttributes[NSFontAttributeName] = self.font
        _drawAttributes[NSParagraphStyleAttributeName] = _paragraphStyle
        _drawAttributes[NSForegroundColorAttributeName] = self.textColor

        _labelSize = labelns?.size(attributes: _drawAttributes) ?? CGSize.zero
        _size.width = _labelSize.width + self.insets.left + self.insets.right
        _size.height = _labelSize.height + self.insets.top + self.insets.bottom
        _size.width = max(minimumSize.width, _size.width)
        _size.height = max(minimumSize.height, _size.height)
    }
	
}

