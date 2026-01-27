export default {
	getData:async(entity)=>{
		if(typeof entity != 'object') return;
		if(entity.data == undefined)
			await entity.run();
		return entity.data;
	},
	CATALOG:{
		PRODUCT_TYPE_TH:{run:async()=>await DD_PRODUCT_TYPE.run(),data:DD_PRODUCT_TYPE.data,customName:"PRODUCT_TYPE(M)",spliter:true,splittedArrayPosition:0,splitWith:"/"},
		UNIT_TH: {run:async()=>await DD_UNIT.run(),data:DD_UNIT.data,customName:"UNIT(M)",spliter:true,splittedArrayPosition:0,splitWith:"/"},
		FLOOR_NO: {run:async()=>await DD_FLOOR.run(),data:DD_FLOOR.data,customName:"FLOOR(M)"},
	},
	INVENTORY:{
		FLOOR_NO: {run:async()=>await DD_FLOOR.run(),data:DD_FLOOR.data,customName:"FLOOR(M)"},
		ZONE: {run:async()=>await DD_ZONE.run(),data:DD_ZONE.data,customName:"ZONE(M)"},
		UOM: {run:async()=>await DD_UOM.run(),data:DD_UOM.data,customName:"UOM(M)",spliter:true,splittedArrayPosition:0,splitWith:"/"},
		STATUS: {run:async()=>await DD_STATUS.run(),data:DD_STATUS.data,customName:"STATUS(M)"},
		CT: {run:async()=>await DD_CT.run(),data:DD_CT.data,customName:"CT(M)"},
	},
	PROFILE:{
		FREQUENCY_TYPE: {run:async()=>await DD_FREQUENCY_TYPE.run(),data:DD_FREQUENCY_TYPE.data,customName:"FREQUENCY_TYPE(M)"},
	},
	COMPANY: {
		COMPANY_TYPE_NAME: {run:async()=>await DD_COMPANY_TYPE.run(),data:DD_COMPANY_TYPE.data,customName:"COMPANY_TYPE(M)"},
		STATUS: {run:async()=>await DD_STATUS.run(),data:DD_STATUS.data,customName:"STATUS(M)"},
		COMPANY_BUSINESS_TYPE: {run:async()=>await DD_COMPANY_BUSINESS_TYPE.run(),data:DD_COMPANY_BUSINESS_TYPE.data,customName:"COMPANY_BUSINESS_TYPE(M)"},
		TITLE_PREFIX:{run:async()=>await DD_TITLE_PREFIX.run(),data:DD_TITLE_PREFIX.data,customName:"TITLE_PREFIX(M)"},
		SUFFIX: {run:async()=>await DD_SUFFIX.run(),data:DD_SUFFIX.data,customName:"SUFFIX(M)"},
		COMPANY_BRANCH_TYPE: {run:async()=>await DD_BRANCH_TYPE.run(),data:DD_BRANCH_TYPE.data,customName:"BRANCH_TYPE(M)"},

		/* ---------- Billing ---------- */
		BILLING_COMPANY_TYPE_NAME: {run:async()=>await DD_COMPANY_TYPE.run(),data:DD_COMPANY_TYPE.data,customName:"COMPANY_TYPE(M)"},
		BILLING_TITLE_PREFIX: {run:async()=>await DD_TITLE_PREFIX.run(),data:DD_TITLE_PREFIX.data,customName:"TITLE_PREFIX(M)"},
		BILLING_SUFFIX: {run:async()=>await DD_SUFFIX.run(),data:DD_SUFFIX.data,customName:"SUFFIX(M)"},
		BILLING_BRANCH_TYPE: {run:async()=>await DD_BRANCH_TYPE.run(),data:DD_BRANCH_TYPE.data,customName:"BRANCH_TYPE(M)"},
		BILLING_COMPANY_BUSINESS_TYPE: {run:async()=>await DD_COMPANY_BUSINESS_TYPE.run(),data:DD_COMPANY_BUSINESS_TYPE.data,customName:"COMPANY_BUSINESS_TYPE(M)"},
	}
}