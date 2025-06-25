export default {
	LoadPage:async ()=>{
		await clearStore();
		await JS_Account.mappingAccount();
		
	},
	StoreCheck:()=>{
		return appsmith.store
	}
}