export default {
	LoadPage:async ()=>{
		await clearStore();
		if(!Default_Account.DefaultOverwrite){
			storeValue(Configs.Default_Account,Default_Account);
		}
		await Promise.all([
			
			JS_Account.mappingAccount(),
			SP_SELECT_ROLES.run(),
			SP_SELECT_PERMISSIONS.run()
		])
		
	},
	StoreCheck:()=>{
		return appsmith.store
	}
}