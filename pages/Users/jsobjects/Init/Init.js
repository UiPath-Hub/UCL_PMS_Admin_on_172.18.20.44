export default {
	LoadPage:async ()=>{
		await clearStore();
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