export default {
	onEditRoles:async ()=>{
		await SP_SELECT_ROLES_DROPDOWN.run();
		await SP_SELECT_ALL_ROLES_BY_EO.run();
		if(SP_SELECT_ALL_ROLES_BY_EO.data != undefined && SP_SELECT_ALL_ROLES_BY_EO.data[0].ERROR == undefined){
			await this.getAccountProperties(SP_SELECT_ALL_ROLES_BY_EO.data);
			await resetWidget(Modal_AssignRoles.name,true);
			showModal(Modal_AssignRoles.name);
		}else if(SP_SELECT_ALL_ROLES_BY_EO.data != undefined && SP_SELECT_ALL_ROLES_BY_EO.data[0].ERROR == 0){
			this.hanbleDuplicateAccountOnPMS()
		}

	},
	hanbleDuplicateAccountOnPMS:()=>{
		SELECT_FOR_DUPLICATED_ACCOUNT.run({id: SP_SELECT_ALL_ROLES_BY_EO.data[0].ID,email: SP_SELECT_ALL_ROLES_BY_EO.data[0].EMAIL}).then(()=>{
			this.getAccountProperties(SELECT_FOR_DUPLICATED_ACCOUNT.data);
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
	getAssignedRoles:async(data)=>{
		//data = SP_SELECT_ALL_ROLES_BY_EO.data
		if(data == undefined)return;
		let list = [];
		if(data[0].TOTAL_RECORDS > 0){
			 list = await Promise.all(data.filter((ele)=>ele.TOTAL_RECORDS!==0).map((ele)=>({label:ele.ROLE_NAME,value:ele.ROLE_ID})))
		}
		Default_Account.ROLES_AND_GROUPS = list;
	},
	getAccountProperties:async (data)=>{
		//data = SP_SELECT_ALL_ROLES_BY_EO.data
		let update = (root)=>{
			let keys = Object.keys(root).filter((key)=>Default_Account[key] !== undefined);
			keys.forEach((key)=>{
				if(Default_Account[key].data !== undefined && root[key] != undefined){
					let data = root[key].data==undefined?root[key]:root[key].data;
					Default_Account[key].data=data;
				}
			})
		} 
		if(data == undefined)return [];
		if(appsmith.store[Configs.Default_Account]==undefined) await storeValue(Configs.Default_Account,Default_Account);
		if(data[0].ACCOUNT_EXIST!==0){
			update(data[0])
		}else{
			update(appsmith.store[Configs.Default_Account])
		}
		await this.getAssignedRoles(data);
	},
	onDisabledUpdateAccountButton:()=>{
		//let Disabled = false;
		if(SP_SELECT_ALL_ROLES_BY_EO.data != undefined){
			let MAXY = Inp_MAXIMUM_SESSIONS.text === Default_Account.MAXIMUM_SESSIONS.data;
			let SESY = Inp_SESSION_TIMEOUT_HOUR.text === Default_Account.SESSION_TIMEOUT_HOUR.data;
			let KICKY = Swi_KICK_OLDEST_SESSION_OUT.isSwitchedOn === Default_Account.KICK_OLDEST_SESSION_OUT.data;
			let STARTP = Inp_StartPage.text === Default_Account.START_PAGE.data;
			let PreData = JSON.stringify(Default_Account.ROLES_AND_GROUPS.map((ele)=>ele.value));
			let PresentData = JSON.stringify(MSelect_Roles.selectedOptionValues);
			return PreData===PresentData && MAXY&&SESY&&KICKY && STARTP;
		}else{
			return false;
		}
	},
	onUpdateAccountButton:()=>{
		SP_ASSIGN_ACCOUNT_ROLES.run().then(()=>{
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
			
		})
	
	},
	mappingAccount:async (Callback)=>{
		await Find_Users.run();
		await SELECT_ALL_MAPPING.run();
		if(Find_Users.data != undefined && SELECT_ALL_MAPPING.data != undefined/* && SELECT_ALL_MAPPING.data[0].TOTAL_RECORED != 0*/){
			let Map = [];
			await Promise.all(Find_Users.data.map((row)=>{
				let SQL_DATA = SELECT_ALL_MAPPING.data.filter((sqlrow)=>sqlrow.PMS_OBJECT_ID===row._id && sqlrow.EMAIL===row.email)
				if(SQL_DATA.length >0){
					Map.push({...row,MappingTo:SQL_DATA[0].ID,"Start page":SQL_DATA[0].START_PAGE});
					//console.log("Map")
				}else{
					Map.push({...row})
					//console.log("Unmap")
				}
			}))
			Modified_TableData.Account = Map;
		}
		if(typeof Callback === 'function') Callback();
	}
}