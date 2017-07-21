module.exports = {
	// 获取团队类型labels
	getTeamTypeLabels(teamTypeData) {
		let labels = [];
		if (teamTypeData) {
			for (let item of teamTypeData) {
				labels.push(item.label);
			}
		}
		return labels;
	},
	// 根据团队类型label获取组织Id
	getTeamTypeId(teamTypeLabel, teamTypeData) {
		let id;
		if (teamTypeData) {
			for (let item of teamTypeData) {
				if (teamTypeLabel === item.label) {
					id = item.value;
					break;
				}
			}
		}
		return id;
	},
	// 获取组织指标IndicatorName
	getPointerTypeNames(pointerTypeData) {
		let indicatorNames = [];
		if (pointerTypeData) {
			for (let item of pointerTypeData) {
				indicatorNames.push(item.IndicatorName);
			}
		}
		return indicatorNames;
	},
    // 获取指标类型Id
    getPointerTypeId(pointerType, pointerTypeData) {
        let indicatorId;
        if (pointerTypeData) {
            for (let item of pointerTypeData) {
                if (pointerType === item.IndicatorName)
                indicatorId = item.IndicatorId;
            }
        }
        return indicatorId;
    },
	// 获取考勤期labels
	getPeriodTypeLabels(periodTypeData) {
			let labels = [];
			if (periodTypeData) {
					for (let item of periodTypeData) {
							labels.push(item.label);
					}
			}
			return labels;
	},
	// 获取考核期Id
	getPeriodTypeId(periodTypeLabel, periodTypeData) {
		let id;
		if (periodTypeData) {
			for (let item of periodTypeData) {
				if (periodTypeLabel === item.label) {
					id = item.value;
					break;
				}
			}
		}
		return id;
	},
  // 组织指标
  organizeData:{
      teamType:[
          {
              value:"org001",
              label:"业务发展中心/Business Development Center"
          },
          {
              value:"org002",
              label:"售前部"
          },
          {
              value:"org003",
              label:"售后部"
          },
          {
              value:"org004",
              label:"客户成功中心/Customer Success Center"
          },
          {
              value:"org005",
              label:"客户发展部/Account Development Dept."
          },
          {
              value:"org006",
              label:"客户服务部/Customer Service Dept."
          },
          {
              value:"org007",
              label:"实施交付一部/Service Delivery Dept.Ⅰ"
          },
          {
              value:"org008",
              label:"实施交付二部/Service Delivery Dept.Ⅱ"
          },
          {
              value:"org009",
              label:"销售中心/Sales Center"
          },
          {
              value:"org010",
              label:"华南区销售部"
          },
          {
              value:"org011",
              label:"华北区销售部"
          },
          {
              value:"org012",
              label:"华东销售部"
          },
          {
              value:"org013",
              label:"华东区销售一部"
          },
          {
              value:"org014",
              label:"华东区销售二部"
          }
      ],
      pointerType:[
          {
              IndicatorId:"3d03d5df-765a-4bb4-a180-024641e8d1c2",
              IndicatorName:"个人指标3"
          },
          {
              IndicatorId:"6d381d73-1fc9-4ee4-934b-0d05f3fd8a04",
              IndicatorName:"个人指标1"
          },
          {
              IndicatorId:"7c6cfe9e-3207-4c4c-b759-302513525289",
              IndicatorName:"个人指标4"
          },
          {
              IndicatorId:"aa6861a2-f137-49e2-9ce0-65dd3ad211a8",
              IndicatorName:"个人指标2"
          },
          {
              IndicatorId:"b1eb4db1-a851-4b0c-ab79-e9e40e7f846f",
              IndicatorName:"个人指标5"
          }
      ]
  },
  lineChartData: {
    complete: [
        {
            x: '201701',
            y: 100,
        },
        {
            x: '201702',
            y: 300,
        },
        {
            x: '201703',
            y: 200,
        },
        {
            x: '201704',
            y: 500,
        },
        {
            x: '201705',
            y: 400,
        },
    ],
    target: [
        {
            x: '201701',
            y: 200,
        },
        {
            x: '201702',
            y: 500,
        },
        {
            x: '201703',
            y: '400',
        },
        {
            x: '201704',
            y: 200,
        },
        {
            x: '201705',
            y: 100,
        },
    ],
  },
};