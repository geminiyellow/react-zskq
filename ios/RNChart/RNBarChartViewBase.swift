//  Created by xudong wu on 24/02/2017.
//  Copyright wuxudong
//

class RNBarChartViewBase: RNBarLineChartViewBase {
	// MARK: - Properties
    fileprivate var barChart: BarChartView {
        get {
            return chart as! BarChartView
        }
    }
	
	// MARK: - RNChartViewBase
	override func setData(_ data: NSDictionary) {
		super.setData(data)
		barChart.highlightPerTapEnabled = false
		barChart.highlightPerDragEnabled = false
		barChart.setVisibleXRange(minXRange: 4.0, maxXRange: 4.0)
        barChart.animate(yAxisDuration: 1.0)
	}
	
	// MARK: -
    func setDrawValueAboveBar(_ enabled: Bool) {
        barChart.drawValueAboveBarEnabled = enabled
    }

    func setDrawBarShadow(_ enabled: Bool) {
        barChart.drawBarShadowEnabled = enabled
    }
	
	/// 设置条形图可滑动
	func setSlide(_ times: Double) {
        if UIDevice.current.orientation == UIDeviceOrientation.portrait {
            barChart.setVisibleXRange(minXRange: 4.0, maxXRange: 4.0)
        } else {
            barChart.setVisibleXRange(minXRange: 8.0, maxXRange: 8.0)
        }
        barChart.animate(yAxisDuration: 1.0)
	}
	
}
