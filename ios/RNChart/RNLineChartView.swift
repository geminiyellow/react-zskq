//  Created by xudong wu on 24/02/2017.
//  Copyright wuxudong
//

class RNLineChartView: RNBarLineChartViewBase {
	
	// MARK: - Properties

    let _chart: AWLineChartView;
    let _dataExtract : LineDataExtract;
	
	// MARK: - Initializers
    
    override init(frame: CoreGraphics.CGRect) {
		self._chart = AWLineChartView(frame: frame)
		self._chart.clipWithViewportRect = false
        self._dataExtract = LineDataExtract()
        
        super.init(frame: frame);
        
        self._chart.delegate = self
        self.addSubview(_chart);
    }
    
    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
	
	// MARK: - RNChartViewBase

	override func setData(_ data: NSDictionary) {
		super.setData(data)
		chart._indicesToHighlight.removeAll()
		chart.defaultHighlighted = true
		chart.highlightValue(x: 0, y: 0, dataSetIndex: 0)
	}
	
	// MARK: - Accesorries
	
	override var chart: AWLineChartView {
		return _chart
	}
	
	override var dataExtract: DataExtract {
		return _dataExtract
	}
	
}
