export default {
	CATALOG:{run:async(params)=>await _01_INSERT_CATALOG.run(params),data:_01_INSERT_CATALOG.data},
	INVENTORY:{run:async(params)=>await _02_INSERT_INVENTORY.run(params),data:_02_INSERT_INVENTORY.data},
	PROFILE:{run:async(params)=>await _03_INSERT_PROFILE .run(params),data:_03_INSERT_PROFILE.data},
	COMPANY:{run:async(params)=>await _03_INSERT_COMPANY .run(params),data:_03_INSERT_COMPANY.data},
}