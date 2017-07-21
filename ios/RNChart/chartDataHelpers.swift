//
//  chartDataHelpers.swift
//  ChartsExplorer
//
//  Created by Jose Padilla on 3/18/16.
//  Copyright © 2016 Facebook. All rights reserved.
//

import Foundation

var maximumDecimalPlaces: Int = 0;
var minimumDecimalPlaces: Int = 0;

//func getLineData(_ labels: [String], json: JSON!) -> LineChartData {
//    if !json["dataSets"].exists() {
//        return LineChartData();
//    }
//
//    let dataSets = json["dataSets"].arrayObject;
//    var sets: [LineChartDataSet] = [];
//
//    for set in dataSets! {
//        let tmp = JSON(set);
//        if tmp["values"].exists() {
//            let values = tmp["values"].arrayValue.map({$0.doubleValue});
//            let label = tmp["label"].exists() ? tmp["label"].stringValue : "";
//            var dataEntries: [ChartDataEntry] = [];
//
//            for i in 0..<values.count {
//                let dataEntry = ChartDataEntry(value: values[i], xIndex: i);
//                dataEntries.append(dataEntry);
//            }
//
//            let dataSet = LineChartDataSet(yVals: dataEntries, label: label);
//
//            if tmp["colors"].exists() {
//                let arrColors = tmp["colors"].arrayValue.map({$0.intValue});
//                dataSet.colors = arrColors.map({return RCTConvert.uiColor($0)});
//            }
//
//            if tmp["drawCircles"].exists() {
//                dataSet.drawCirclesEnabled = tmp["drawCircles"].boolValue;
//            }
//
//            if tmp["lineWidth"].exists() {
//                dataSet.lineWidth = CGFloat(tmp["lineWidth"].floatValue);
//            }
//
//            if tmp["circleColors"].exists() {
//                let arrColors = tmp["circleColors"].arrayValue.map({$0.intValue});
//                dataSet.circleColors = arrColors.map({return RCTConvert.uiColor($0)});
//            }
//
//            if tmp["circleHoleColor"].exists() {
//                dataSet.circleHoleColor = RCTConvert.uiColor(tmp["circleHoleColor"].intValue);
//            }
//
//            if tmp["circleRadius"].exists() {
//                dataSet.circleRadius = CGFloat(tmp["circleRadius"].floatValue);
//            }
//
//            if tmp["cubicIntensity"].exists() {
//                dataSet.cubicIntensity = CGFloat(tmp["cubicIntensity"].floatValue);
//            }
//
//            if tmp["drawCircleHole"].exists() {
//                dataSet.drawCircleHoleEnabled = tmp["drawCircleHole"].boolValue;
//            }
//
//            if tmp["drawCubic"].exists() {
//                dataSet.drawCubicEnabled = tmp["drawCubic"].boolValue;
//            }
//
//            if tmp["drawFilled"].exists() {
//                dataSet.drawFilledEnabled = tmp["drawFilled"].boolValue;
//            }
//
//            if tmp["drawHorizontalHighlightIndicator"].exists() {
//                dataSet.drawHorizontalHighlightIndicatorEnabled = tmp["drawHorizontalHighlightIndicator"].boolValue;
//            }
//
//            if tmp["drawVerticalHighlightIndicator"].exists() {
//                dataSet.drawVerticalHighlightIndicatorEnabled = tmp["drawVerticalHighlightIndicator"].boolValue;
//            }
//
//            if tmp["drawValues"].exists() {
//                dataSet.drawValuesEnabled = tmp["drawValues"].boolValue;
//            }
//
//            if tmp["fillAlpha"].exists() {
//                dataSet.fillAlpha = CGFloat(tmp["fillAlpha"].floatValue);
//            }
//
//            if tmp["fillColor"].exists() {
//                dataSet.fillColor = RCTConvert.uiColor(tmp["fillColor"].intValue);
//            }
//
//            if tmp["highlightColor"].exists() {
//                dataSet.highlightColor = RCTConvert.uiColor(tmp["highlightColor"].intValue);
//            }
//
//            if tmp["highlightEnabled"].exists() {
//                dataSet.highlightEnabled = tmp["highlightEnabled"].boolValue;
//            }
//
//            if tmp["highlightLineDashLengths"].exists() {
//                dataSet.highlightLineDashLengths = [CGFloat(tmp["highlightLineDashLengths"].floatValue)];
//            }
//
//            if tmp["highlightLineDashPhase"].exists() {
//                dataSet.highlightLineDashPhase = CGFloat(tmp["highlightLineDashPhase"].floatValue);
//            }
//
//            if tmp["highlightLineWidth"].exists() {
//                dataSet.highlightLineWidth = CGFloat(tmp["highlightLineWidth"].floatValue);
//            }
//
//            if tmp["lineDashLengths"].exists() {
//                dataSet.lineDashLengths = [CGFloat(tmp["lineDashLengths"].floatValue)];
//            }
//
//            if tmp["lineDashPhase"].exists() {
//                dataSet.lineDashPhase = CGFloat(tmp["lineDashPhase"].floatValue);
//            }
//
//            if tmp["lineWidth"].exists() {
//                dataSet.lineWidth = CGFloat(tmp["lineWidth"].floatValue);
//            }
//
//            if tmp["axisDependency"].exists() {
//                let value = tmp["axisDependency"].stringValue;
//                if value == "left" {
//                    dataSet.axisDependency = .left;
//                } else if value == "right" {
//                    dataSet.axisDependency = .right;
//                }
//            }
//
//            if tmp["valueTextFontName"].exists() {
//                dataSet.valueFont = UIFont(
//                    name: tmp["valueTextFontName"].stringValue,
//                    size: dataSet.valueFont.pointSize
//                    )!;
//            }
//
//            if tmp["valueTextFontSize"].exists() {
//                dataSet.valueFont = dataSet.valueFont.withSize(CGFloat(tmp["valueTextFontSize"].floatValue));
//            }
//
//            if tmp["valueTextColor"].exists() {
//                dataSet.valueTextColor = RCTConvert.uiColor(tmp["valueTextColor"].intValue);
//            }
//
//            if json["valueFormatter"].exists() {
//                if json["valueFormatter"]["minimumDecimalPlaces"].exists() {
//                    minimumDecimalPlaces = json["valueFormatter"]["minimumDecimalPlaces"].intValue;
//                }
//                if json["valueFormatter"]["maximumDecimalPlaces"].exists() {
//                    maximumDecimalPlaces = json["valueFormatter"]["maximumDecimalPlaces"].intValue;
//                }
//
//                if json["valueFormatter"]["type"].exists() {
//                    switch(json["valueFormatter"]["type"]) {
//                    case "regular":
//                        dataSet.valueFormatter = NumberFormatter();
//                        break;
//                    case "abbreviated":
//                        dataSet.valueFormatter = ABNumberFormatter(minimumDecimalPlaces: minimumDecimalPlaces, maximumDecimalPlaces: maximumDecimalPlaces);
//                        break;
//                    default:
//                        dataSet.valueFormatter = NumberFormatter();
//                    }
//                }
//
//                if json["valueFormatter"]["numberStyle"].exists() {
//                    switch(json["valueFormatter"]["numberStyle"]) {
//                    case "CurrencyAccountingStyle":
//                        if #available(iOS 9.0, *) {
//                            dataSet.valueFormatter?.numberStyle = .currencyAccounting;
//                        }
//                        break;
//                    case "CurrencyISOCodeStyle":
//                        if #available(iOS 9.0, *) {
//                            dataSet.valueFormatter?.numberStyle = .currencyISOCode;
//                        }
//                        break;
//                    case "CurrencyPluralStyle":
//                        if #available(iOS 9.0, *) {
//                            dataSet.valueFormatter?.numberStyle = .currencyPlural;
//                        }
//                        break;
//                    case "CurrencyStyle":
//                        dataSet.valueFormatter?.numberStyle = .currency;
//                        break;
//                    case "DecimalStyle":
//                        dataSet.valueFormatter?.numberStyle = .decimal;
//                        break;
//                    case "NoStyle":
//                        dataSet.valueFormatter?.numberStyle = .none;
//                        break;
//                    case "OrdinalStyle":
//                        if #available(iOS 9.0, *) {
//                            dataSet.valueFormatter?.numberStyle = .ordinal;
//                        }
//                        break;
//                    case "PercentStyle":
//                        dataSet.valueFormatter?.numberStyle = .percent;
//                        break;
//                    case "ScientificStyle":
//                        dataSet.valueFormatter?.numberStyle = .scientific;
//                        break;
//                    case "SpellOutStyle":
//                        dataSet.valueFormatter?.numberStyle = .spellOut;
//                        break;
//                    default:
//                        dataSet.valueFormatter?.numberStyle = .none;
//                    }
//                }
//
//                dataSet.valueFormatter?.minimumFractionDigits = minimumDecimalPlaces;
//                dataSet.valueFormatter?.maximumFractionDigits = maximumDecimalPlaces;
//            }
//
//            sets.append(dataSet);
//        }
//    }
//    return LineChartData(xVals: labels, dataSets: sets);
//}


func getBarData(_ labels: [String], json: JSON!) -> BarChartData {
    if !json["dataSets"].exists() {
        return BarChartData();
    }

    let dataSets = json["dataSets"].arrayObject;
    var sets: [BarChartDataSet] = [];

    for set in dataSets! {
        let tmp = JSON(set);
        if tmp["values"].exists() {
            let label = tmp["label"].exists() ? tmp["label"].stringValue : "";
            var dataEntries: [BarChartDataEntry] = [];

          if json["barType"].stringValue == "Group" {
            let values = tmp["values"].arrayValue.map({$0.doubleValue});
            
            for i in 0..<values.count {
              let dataEntry = BarChartDataEntry(x: Double(i), yValues: values)
              dataEntries.append(dataEntry);
            }
          } else if json["barType"].stringValue == "Stacked" {
            let values = tmp["values"].arrayObject as! [[Double]]
            
            for i in 0..<values.count {
              let dataEntry = BarChartDataEntry(x: Double(i), yValues: values[i])
              dataEntries.append(dataEntry)
            }
          }

            let dataSet = BarChartDataSet(values: dataEntries, label: label);

            if tmp["barShadowColor"].exists() {
                dataSet.barShadowColor = RCTConvert.uiColor(tmp["barShadowColor"].intValue);
            }

            // charts v3.0 doesn't support barSpace yet
            if tmp["barSpace"].exists() {
//                dataSet.barSpace = CGFloat(tmp["barSpace"].floatValue);
//              let data = BarChartData()
            }

            if tmp["highlightAlpha"].exists() {
                dataSet.highlightAlpha = CGFloat(tmp["highlightAlpha"].floatValue);
            }

            if tmp["highlightColor"].exists() {
                dataSet.highlightColor = RCTConvert.uiColor(tmp["highlightColor"].intValue);
            }

            if tmp["highlightLineDashLengths"].exists() {
                dataSet.highlightLineDashLengths = [CGFloat(tmp["highlightLineDashLengths"].floatValue)];
            }

            if tmp["highlightLineDashPhase"].exists() {
                dataSet.highlightLineDashPhase = CGFloat(tmp["highlightLineDashPhase"].floatValue);
            }

            if tmp["highlightLineWidth"].exists() {
                dataSet.highlightLineWidth = CGFloat(tmp["highlightLineWidth"].floatValue);
            }

            if tmp["stackLabels"].exists() {
                dataSet.stackLabels = tmp["stackLabels"].arrayValue.map({$0.stringValue});
            }

            if tmp["colors"].exists() {
                let arrColors = tmp["colors"].arrayValue.map({$0.intValue});
                dataSet.colors = arrColors.map({return RCTConvert.uiColor($0)});
            }

            if tmp["drawValues"].exists() {
                dataSet.drawValuesEnabled = tmp["drawValues"].boolValue;
            }

            if tmp["highlightEnabled"].exists() {
                dataSet.highlightEnabled = tmp["highlightEnabled"].boolValue;
            }

            if tmp["valueTextFontName"].exists() {
                dataSet.valueFont = UIFont(
                    name: tmp["valueTextFontName"].stringValue,
                    size: dataSet.valueFont.pointSize
                    )!;
            }

            if tmp["valueTextFontSize"].exists() {
                dataSet.valueFont = dataSet.valueFont.withSize(CGFloat(tmp["valueTextFontSize"].floatValue))
            }

            if tmp["valueTextColor"].exists() {
                dataSet.valueTextColor = RCTConvert.uiColor(tmp["valueTextColor"].intValue);
            }

            if tmp["axisDependency"].exists() {
                let value = tmp["axisDependency"].stringValue;
                if value == "left" {
                    dataSet.axisDependency = .left;
                } else if value == "right" {
                    dataSet.axisDependency = .right;
                }
            }

            if json["valueFormatter"].exists() {
                if json["valueFormatter"]["minimumDecimalPlaces"].exists() {
                    minimumDecimalPlaces = json["valueFormatter"]["minimumDecimalPlaces"].intValue;
                }
                if json["valueFormatter"]["maximumDecimalPlaces"].exists() {
                    maximumDecimalPlaces = json["valueFormatter"]["maximumDecimalPlaces"].intValue;
                }

                if json["valueFormatter"]["type"].exists() {
                    switch(json["valueFormatter"]["type"]) {
                    case "regular":
                      dataSet.valueFormatter = DefaultValueFormatter()
                    case "abbreviated":
                        dataSet.valueFormatter = ABNumberFormatter(minimumDecimalPlaces: minimumDecimalPlaces, maximumDecimalPlaces: maximumDecimalPlaces) as? IValueFormatter;
                    default:
                      dataSet.valueFormatter = DefaultValueFormatter()
                    }
                }

                if json["valueFormatter"]["numberStyle"].exists() {
                  let formatter = NumberFormatter()
                  formatter.maximumFractionDigits = maximumDecimalPlaces
                  formatter.minimumFractionDigits = minimumDecimalPlaces
                  formatter.zeroSymbol = ""
                  dataSet.valueFormatter = DefaultValueFormatter(formatter: formatter)
                    switch(json["valueFormatter"]["numberStyle"]) {
                    case "CurrencyAccountingStyle":
                        if #available(iOS 9.0, *) {
                          formatter.numberStyle = .currencyAccounting
                        }
                    case "CurrencyISOCodeStyle":
                        if #available(iOS 9.0, *) {
                          formatter.numberStyle = .currencyISOCode
                        }
                        break;
                    case "CurrencyPluralStyle":
                        if #available(iOS 9.0, *) {
                          formatter.numberStyle = .currencyPlural
                        }
                    case "CurrencyStyle":
                        formatter.numberStyle = .currency
                    case "DecimalStyle":
                      formatter.numberStyle = .decimal
                    case "NoStyle":
                        formatter.numberStyle = .none
                    case "OrdinalStyle":
                        if #available(iOS 9.0, *) {
                          formatter.numberStyle = .ordinal
                        }
                    case "PercentStyle":
                        formatter.numberStyle = .percent
                    case "ScientificStyle":
                      formatter.numberStyle = .scientific
                    case "SpellOutStyle":
                        formatter.numberStyle = .spellOut
                    default:
                      formatter.numberStyle = .none
                    }
                }
            }

            sets.append(dataSet);
        }
    }
//    return BarChartData(xVals: labels, dataSets: sets);
  let data = BarChartData(dataSets: sets)
  data.barWidth = Double(0.4)
  return data
}
