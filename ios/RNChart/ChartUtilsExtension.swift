//
//  ChartUtilsExtension.swift
//  ZSKQ
//
//  Created by Andy Wu on 4/1/17.
//  Copyright © 2017 Facebook. All rights reserved.
//

import Foundation

extension ChartUtils {

	/// draw no data icon
	open class func drawImage(context: CGContext, image: UIImage, rect: CGRect) {
		NSUIGraphicsPushContext(context)
		
		image.draw(in: rect)
		
		NSUIGraphicsPopContext()
	}
}
