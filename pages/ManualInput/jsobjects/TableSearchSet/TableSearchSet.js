export default {
	getData:async(entity,parameter)=>{
		//console.log(entity.columnDetail);
		if(typeof entity != 'object') return;
		//console.log(entity.columnDetail);
		await entity.run(parameter);
		//console.log('load '+entity.columnDetail);
		return entity.data;
	},
	INVENTORY:{
		PRODUCT_NAME_TH:{run:async(PRODUCT_NAME_TH)=>{await SEARCH_CATALOG.run({PRODUCT_NAME_TH:PRODUCT_NAME_TH})},data:SEARCH_CATALOG.data,columnDetail:"PRODUCT_ID",
										 additionalDetail:[
											 {columnName:"PRODUCT_NAME_EN",AS:"PRODUCT_NAME_EN(S)"},
											 {columnName:"PRODUCT_TYPE_TH",AS:"PRODUCT_TYPE_TH(S)"},
											 {columnName:"PRODUCT_TYPE_EN",AS:"PRODUCT_TYPE_EN(S)"},
											 {columnName:"PRODUCT_CODE",AS:"PRODUCT_CODE(S)"}]
										},
		SUB_INVENTORY_NAME:{run:async(INVENTORY_NAME)=>{await SEARCH_INVENTORY.run({INVENTORY_NAME:INVENTORY_NAME})},data:SEARCH_INVENTORY.data,columnDetail:"INVENTORY_ID",
												additionalDetail:[{columnName:"INVENTORY_ID",AS:"SUB_INVENTORY"}]
											 },
	},
	PROFILE:{
		COMPANY_NAME_TH:{run:async(COMPANY_NAME_TH)=>{await SEARCH_COMPANY.run({COMPANY_NAME_TH:COMPANY_NAME_TH})},data:SEARCH_COMPANY.data,columnDetail:"COMPANY_ID"},
		FORMULA_ID:{run:async(FORMULA_ID)=>{await SEARCH_FORMULA.run({INVENTORY_NAME:FORMULA_ID})},data:SEARCH_FORMULA.data,columnDetail:"FORMULA_ID"},
		INVENTORY_NAME:{run:async(INVENTORY_NAME)=>{await SEARCH_INVENTORY.run({INVENTORY_NAME:INVENTORY_NAME})},data:SEARCH_INVENTORY.data,columnDetail:"INVENTORY_ID",
										additionalDetail:[
											{columnName:"PRODUCT_NAME_TH",AS:"PRODUCT_NAME_TH(S)"},
											{columnName:"PRODUCT_TYPE_TH",AS:"PRODUCT_TYPE_TH(S)"},
											{columnName:"PRODUCT_TYPE_EN",AS:"PRODUCT_TYPE_EN(S)"}
										]},
	},
	COMPANY:{
		PRIORITY_CONTACT_ID:{run:async(COMPANY_CONTACT_ID)=>{await SEARCH_CONTACT.run({COMPANY_CONTACT_ID:COMPANY_CONTACT_ID})},data:SEARCH_CONTACT.data,columnDetail:"COMPANY_CONTACT_ID"},
	}

}