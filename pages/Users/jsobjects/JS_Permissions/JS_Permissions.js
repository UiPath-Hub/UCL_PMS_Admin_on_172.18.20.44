export default {
	onNewPermission:()=>{
		SP_INSERT_PERMISSION.run().then(()=>{
					let response = SP_INSERT_PERMISSION.data[0];
					if(response != undefined && response.RESULT_CODE === "DONE"){ 
						showAlert("Insert succeess","succeess");
						
					}
					else{
						showAlert("Insert error:"+response.RESULT_MESSAGES,"error");
					}
			SP_SELECT_PERMISSIONS.run();
		})
		/*
		SELECT_BY_PID_PERMISSION.run({PERMISSION_ID:Table_Permissions.newRow.PERMISSION_ID}).then(()=>{
			let data = SELECT_BY_PID_PERMISSION.data;
			if(data != undefined && data.length === 0){
				
			}else if(data != undefined && data.length === 1){
				showAlert("The Permission ID exists.")
			}
		})*/
	},
	onUpdatePermission:()=>{
		//SP_UPDATE_PERMISSION.run().then(()=>{
					let response = SP_UPDATE_PERMISSION.data[0];
					if(response != undefined && response.RESULT_CODE === "DONE"){ 
						showAlert("Update succeess","succeess");
						
					}
					else{
						showAlert("Update error:"+response.RESULT_MESSAGES,"error");
					}
			SP_SELECT_PERMISSIONS.run();
		//})
	},
	onDeletePermission:()=>{
			let response = SP_DELETE_PERMISSION.data[0];
			if(response != undefined && response.RESULT_CODE === "DONE"){ 
				showAlert("Delete succeess","succeess");
			}
			else{
				showAlert("Delete error:"+response.RESULT_MESSAGES,"error");
			}
			SP_SELECT_PERMISSIONS.run();
	}
}