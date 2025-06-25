export default {
	onEditPermission:async ()=>{
		await SELECT_ALL_PERMISSIONS_BY_RID.run();
		await resetWidget(Modal_AssignPermissions.name,true);
		showModal(Modal_AssignPermissions.name);
	},
	onDisabledAssignPermissionsButton:()=>{
		//let Disabled = false;
		if(SELECT_ALL_PERMISSIONS_BY_RID.data != undefined){
			let PreData = JSON.stringify(SELECT_ALL_PERMISSIONS_BY_RID.data.map((ele)=>ele.value))
			let PresentData = JSON.stringify(MSelect_Permissions.selectedOptionValues);
			return PreData===PresentData;
		}else{
			return false;
		}
	}
	,
	onAssignPermissions:()=>{
		SP_ASSIGN_PERMISSIONS.run().then(()=>{
			let data = SP_ASSIGN_PERMISSIONS.data[0];
			if(data == undefined)return;
			if(data.RESULT_CODE != undefined && data.RESULT_CODE === "DONE"){
				showAlert("Assign succeess.","succeess");
			}else if(data.RESULT_MESSAGES != undefined){
				showAlert("Assign failure. Error:"+data.RESULT_MESSAGES ,"error");
			}
			SELECT_ALL_PERMISSIONS_BY_RID.run().then(()=>{
				resetWidget(Modal_AssignPermissions.name,true);
				closeModal(Modal_AssignPermissions.name);
			})
		})
	},
	onNewRole:()=>{
		SP_INSERT_ROLE.run().then(()=>{
			let response = SP_INSERT_ROLE.data[0];
			if(response != undefined && response.RESULT_CODE === "DONE"){ 
				showAlert("Insert succeess","succeess");

			}
			else{
				showAlert("Insert error:"+response.RESULT_MESSAGES,"error");
			}
			SP_SELECT_ROLES.run();
		})
	},
	onUpdateRole:()=>{
		SP_UPDATE_ROLE.run().then(()=>{
			let response = SP_UPDATE_ROLE.data[0];
			if(response != undefined && response.RESULT_CODE === "DONE"){ 
				showAlert("Update succeess","Succeess");

			}
			else{
				showAlert("Update error:"+response.RESULT_MESSAGES,"error");
			}
			SP_SELECT_ROLES.run();
		})
	},
	onDeleteRole:()=>{
		SP_DELETE_ROLE.run().then(()=>{
			let response = SP_DELETE_ROLE.data[0];
			if(response != undefined && response.RESULT_CODE === "DONE"){ 
				showAlert("Delete succeess","succeess");

			}
			else{
				showAlert("Delete error:"+response.RESULT_MESSAGES,"error");
			}
			SP_SELECT_ROLES.run();
			closeModal(Modal_ConfirmDeleteR.name);
		})
	},
	test:()=>{
		return appsmith.store
	}
}