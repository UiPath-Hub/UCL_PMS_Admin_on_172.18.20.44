export default {
	CONST_NO_MAPPING:"No mapping",
	CONST_USER_TYPE:"User",
	CONST_GROUP_TYPE:"Group",
	onSelected_Group:async(GROUP_ID)=>{
		await SELECT_SETTING_BY_ACID.run({ID:GROUP_ID});
		await SP_SELECT_ALL_ROLES_BY_GID.run({ID:GROUP_ID});
		
		if(SELECT_SETTING_BY_ACID.data?.length > 0)
			await this.getAccountProperties(SELECT_SETTING_BY_ACID.data[0],Default_GroupSetting)
		
		if(SP_SELECT_ALL_ROLES_BY_GID.data[0]?.ERROR == undefined)
			await this.getAssignedRoles(SP_SELECT_ALL_ROLES_BY_GID.data,Default_GroupSetting);
		
	},
	onEditRoles:async (e)=>{
		if(e===Configs.TableUserTrigger){
			//new, edit, user|group
			Configs.TriggeredUserSetting = Table_Users.triggeredRow
		}else{
			//new group
			Configs.TriggeredUserSetting = {
				"isEnabled": "",
				"name": "",
				"_id": "",
				"email": "",
				"mappingTo": "",
				"Start page": "",
				"IN_GROUP": "",
				"Type": this.CONST_GROUP_TYPE,
				"Group": "",
				"lastActiveAt": ""
			};
		}
		await SP_SELECT_ROLES_DROPDOWN.run();
		const awaitList=[];
		if(!(Configs.TriggeredUserSetting?.mappingTo)|| Configs.TriggeredUserSetting?.mappingTo ===  this.CONST_NO_MAPPING){
			//No data, Running a query is a waste of time.
			Configs.TriggeredUserSetting.mappingTo = "";
			const data = appsmith.store[Configs.Default_Account]||{};
			const defaultAccountInitValue = Object.entries(data).reduce((acc, [key, value]) => {
				acc[key] = value.data;
				return acc;
			}, {});
			
			awaitList.push(this.getAccountProperties(defaultAccountInitValue,Default_Account))
		}else{
			//already map, have data in server.
			await SP_SELECT_ALL_ROLES_BY_EO.run();
			await SELECT_SETTING_BY_ACID.run({ID:Configs.TriggeredUserSetting.mappingTo});

			if(SP_SELECT_ALL_ROLES_BY_EO.data[0]?.ERROR == undefined){
				awaitList.push(this.getAssignedRoles(SP_SELECT_ALL_ROLES_BY_EO.data,Default_Account));
			}
			if(SELECT_SETTING_BY_ACID.data[0]?.TOTAL_RECORED!=0){
				let allAccountValue = {...SELECT_SETTING_BY_ACID.data[0]};
				if(SELECT_ALL_MAPPING.data.map(i=>(i.ID)).includes(Configs.TriggeredUserSetting.mappingTo))
					allAccountValue = {...allAccountValue,...SELECT_ALL_MAPPING.data.filter(i=>i.ID===Configs.TriggeredUserSetting.mappingTo)[0]}
				awaitList.push( this.getAccountProperties(allAccountValue,Default_Account))
			}
		}


		/*if(SP_SELECT_ALL_ROLES_BY_EO.data != undefined && SP_SELECT_ALL_ROLES_BY_EO.data[0].ERROR == 0){
			this.hanbleDuplicateAccountOnPMS();
		}*/
		await Promise.all(awaitList);
		if(Default_Account.IN_GROUP_ID.data){
			await this.onSelected_Group(Default_Account.IN_GROUP_ID.data);
		}
		await resetWidget(Modal_AssignRoles.name,true);
		showModal(Modal_AssignRoles.name);		

	},
	hanbleDuplicateAccountOnPMS:()=>{
		SELECT_FOR_DUPLICATED_ACCOUNT.run({id: SP_SELECT_ALL_ROLES_BY_EO.data[0].ID,email: SP_SELECT_ALL_ROLES_BY_EO.data[0].EMAIL}).then(()=>{
			this.getAccountProperties(SELECT_FOR_DUPLICATED_ACCOUNT.data,Default_Account);
			resetWidget(Modal_AccountDataError.name,true).then(()=>{
				showModal(Modal_AccountDataError.name);
			});

		});
	},
	onResetOldAccount:async()=>{
		await DELETE_OLD_ACCOUNT.run();
		await closeModal(Modal_AccountDataError.name);
		this.onEditRoles()
	},
	onIntegrateOldAccount:async()=>{
		await UPDATE_ACCOUNT_INTEGRATION.run();
		await closeModal(Modal_AccountDataError.name);
		this.onEditRoles()
	}
	,
	getAssignedRoles:async(data,DefaultObject)=>{
		//data = SP_SELECT_ALL_ROLES_BY_EO.data
		if(data == undefined)return;
		let list = [];
		if(data[0].TOTAL_RECORDS > 0){
			list = await Promise.all(data.filter((ele)=>ele.TOTAL_RECORDS!==0).map((ele)=>({label:ele.ROLE_NAME,value:ele.ROLE_ID})))
		}
		DefaultObject.ROLES_AND_GROUPS.data = list;
	},
	getAccountProperties:async (data,DefaultObject)=>{
		if(data == undefined)return [];
		//data = SP_SELECT_ALL_ROLES_BY_EO.data

		let keys = Object.keys(DefaultObject);
		console.log(keys);
		keys.forEach((key)=>{
			if(DefaultObject[key].data !== undefined && data[key] !== undefined){
				DefaultObject[key].data=data[key];
			}
		})
		
		/*if(appsmith.store[Configs.Default_Account]==undefined) await storeValue(Configs.Default_Account,Default_Account);
		if(data[0].ACCOUNT_EXIST!==0){
			update(data[0])
		}else{
			update(appsmith.store[Configs.Default_Account])
		}*/
		//await this.getAssignedRoles(data);
	},
	onDisabledUpdateAccountButton:()=>{
		//let Disabled = false;
		if(SP_SELECT_ALL_ROLES_BY_EO.data != undefined){
			let MAXY = Inp_MAXIMUM_SESSIONS.text === Default_Account.MAXIMUM_SESSIONS.data;
			let SESY = Inp_SESSION_TIMEOUT_HOUR.text === Default_Account.SESSION_TIMEOUT_HOUR.data;
			let KICKY = Swi_KICK_OLDEST_SESSION_OUT.isSwitchedOn === Default_Account.KICK_OLDEST_SESSION_OUT.data;
			let STARTP = Inp_StartPage.text === Default_Account.START_PAGE.data;
			let PreData = JSON.stringify(Default_Account.ROLES_AND_GROUPS.data.map((ele)=>ele.value));
			let PresentData = JSON.stringify(MSelect_Roles.selectedOptionValues);
			return (PreData===PresentData && MAXY&&SESY&&KICKY && STARTP )
		}else{
			return false
		}
	},
	onUpdateAccountButton:async ()=>{
		await SP_ASSIGN_ACCOUNT_ROLES.run()

		let data = SP_ASSIGN_ACCOUNT_ROLES.data[0];
		if(data == undefined)return;
		if(data.RESULT_CODE != undefined && data.RESULT_CODE === "DONE"){
			showAlert("Update succeess.","succeess");
		}else if(data.RESULT_MESSAGES != undefined){
			showAlert("Update failure. Error:"+data.RESULT_MESSAGES ,"error");
		}
		this.mappingAccount(()=>{
			resetWidget(Modal_AssignRoles.name,true);
			closeModal(Modal_AssignRoles.name);
		})
	},
	mappingAccount: async (Callback) => {
		// --- Run initial queries to fetch user and mapping data ---
		await Find_Users.run();
		await SELECT_ALL_MAPPING.run();

		// --- Initialize an array to hold the final mapped data ---
		// Renamed from 'Map' to 'userMappings' to avoid conflict with the built-in Map object.
		const userMappings = [];

		if (Find_Users.data && SELECT_ALL_MAPPING.data) {
			// --- Create a lookup map for efficient data retrieval ---
			// This uses the native JavaScript Map constructor.
			const sqlDataMap = new Map();
			SELECT_ALL_MAPPING.data.forEach(sqlrow => {
				sqlDataMap.set(sqlrow.EMAIL, sqlrow);
			});

			// --- Map individual users from the Find_Users query ---
			Find_Users.data.forEach(row => {
				const sqlrow = sqlDataMap.get(row.email);
				userMappings.push({
					...row,
					"mappingTo": sqlrow?.ID || this.CONST_NO_MAPPING,
					"Start page": sqlrow?.START_PAGE || "Default(Home)",
					"IN_GROUP": sqlrow?.IN_GROUP || false,
					"Type": sqlrow ? this.CONST_USER_TYPE : "-",
					"Group": sqlrow?.GROUP_NAME || "-",
					"IS_GROUP": sqlrow?.IS_GROUP||false
				});
			});

			// --- Map user groups from the SELECT_ALL_MAPPING query ---
			SELECT_ALL_MAPPING.data
				.filter(row => Boolean(row.IS_GROUP)) // Filter for rows that are groups
				.forEach(sqlrow => {
				userMappings.push({
					"name": sqlrow.EMAIL,
					"email": "-",
					"mappingTo": sqlrow?.ID,
					"Start page": sqlrow?.START_PAGE || "Default(Home)",
					"IN_GROUP": false,
					"Type": this.CONST_GROUP_TYPE,
					"Group": "-"
				});
			});

			// --- Update the table data with the newly created mappings ---
			Modified_TableData.Account = userMappings;
		}

		// --- Execute callback if it's a function and return the results ---
		if (typeof Callback === 'function') {
			Callback();
		}
		return userMappings;
	}

}