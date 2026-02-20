export default {
	getData:async(entity,parameter)=>{
		//console.log(entity.columnDetail);
		if(typeof entity != 'object') return;
		//console.log(entity.columnDetail);
		let data = await entity.run(parameter);
		//console.log('load '+entity.columnDetail);
		return data;
	},
	INVENTORY:{
		PRODUCT_NAME_TH:{
			run:async(PRODUCT_NAME_TH)=>{
				return await SEARCH_CATALOG.run({PRODUCT_NAME_TH:PRODUCT_NAME_TH});
				//return SEARCH_CATALOG.data;
			},
			data:SEARCH_CATALOG.data,
			columnDetail:"PRODUCT_ID",
			additionalDetail:[
				{columnName:"PRODUCT_NAME_EN",AS:"PRODUCT_NAME_EN(S)"},
				{columnName:"PRODUCT_TYPE_TH",AS:"PRODUCT_TYPE_TH(S)"},
				{columnName:"PRODUCT_TYPE_EN",AS:"PRODUCT_TYPE_EN(S)"},
				{columnName:"PRODUCT_CODE",AS:"PRODUCT_CODE(S)"}]
		},
		SUB_INVENTORY_NAME:{
			run:async(INVENTORY_NAME)=>{
				return await SEARCH_INVENTORY.run({INVENTORY_NAME:INVENTORY_NAME});
				//return SEARCH_INVENTORY.data;
			},
			data:SEARCH_INVENTORY.data,
			columnDetail:"INVENTORY_ID",
			additionalDetail:[{columnName:"INVENTORY_ID",AS:"SUB_INVENTORY"}]
		},
	},
	PROFILE:{
		COMPANY_NAME_TH:{
			run:async(COMPANY_NAME_TH)=>{
				return  await SEARCH_COMPANY.run({COMPANY_NAME_TH:COMPANY_NAME_TH}); 
				//return data;//SEARCH_COMPANY.data
			},
			data:SEARCH_COMPANY.data,columnDetail:"COMPANY_ID"},
		FORMULA_ID:{
			run:async(FORMULA_ID)=>{
				return await SEARCH_FORMULA.run({FORMULA_ID:FORMULA_ID});
				//return SEARCH_FORMULA.data;
			},
			data:SEARCH_FORMULA.data,columnDetail:"FORMULA_NAME"},
		INVENTORY_NAME:{
			run:async(INVENTORY_NAME)=>{
				return await SEARCH_INVENTORY.run({INVENTORY_NAME:INVENTORY_NAME});
				//return SEARCH_INVENTORY.data;
			},
			data:SEARCH_INVENTORY.data,
			columnDetail:"INVENTORY_ID",
			additionalDetail:[
				{columnName:"PRODUCT_NAME_TH",AS:"PRODUCT_NAME_TH(S)"},
				{columnName:"PRODUCT_TYPE_TH",AS:"PRODUCT_TYPE_TH(S)"},
				{columnName:"PRODUCT_TYPE_EN",AS:"PRODUCT_TYPE_EN(S)"}
			]},
	},
	COMPANY:{
		PRIORITY_CONTACT_ID:{
			run:async(COMPANY_CONTACT_ID)=>{
				return await SEARCH_CONTACT.run({COMPANY_CONTACT_ID:COMPANY_CONTACT_ID});
				//return SEARCH_CONTACT.data;
			},
			data:SEARCH_CONTACT.data,
			columnDetail:"COMPANY_CONTACT_ID"},
	},
	THIRD_PARTY_PROFILE:{
		FORMULA_ID:this.PROFILE.FORMULA_ID,
		INVENTORY_NAME:this.PROFILE.INVENTORY_NAME,
		
		COMPANY_NAME_TH:{
			run:async(COMPANY_NAME_TH)=>{
				return  await SEARCH_THIRD_PARTY.run({COMPANY_NAME_TH:COMPANY_NAME_TH}); 
			},
			data:SEARCH_THIRD_PARTY.data,columnDetail:"COMPANY_ID"},
		
	},
}