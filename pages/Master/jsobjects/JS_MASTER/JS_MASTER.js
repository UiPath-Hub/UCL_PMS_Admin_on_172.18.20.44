export default {
	init:async(inVERSION,inTYPE_NAME)=>{
		inVERSION = inVERSION===undefined || inVERSION ===""?Table_MT.triggeredRow.VERSION:inVERSION;
		inTYPE_NAME = inTYPE_NAME===undefined || inTYPE_NAME ===""?Table_MT.triggeredRow.TYPE_NAME:inTYPE_NAME;
		SELECT_ALL_BY_TYPE_NAME.run({TYPE_NAME:inTYPE_NAME});
		await SELECT_ALL_TYPE_BY_VERSION.run({TYPE_NAME:inTYPE_NAME,VERSION:inVERSION})
			let data = SELECT_ALL_TYPE_BY_VERSION.data;
			let ManageSelectList = data.map(({SYSTEM_VALUE,FIXED_VALUE,ACTIVE,MASTER_LIST_ID})=>({MASTER_LIST_ID:MASTER_LIST_ID,label:FIXED_VALUE,value:SYSTEM_VALUE}));
			//Manage.setSelectedOptions(ManageSelectList);
			//VERSION.setValue(parseInt(inVERSION)+1);

			await storeValue("TYPE_NAME_MODAL",inTYPE_NAME);
			await storeValue("CurrentVersion",{VERSION:inVERSION,ACTIVE:data[0]===undefined?true:data[0].ACTIVE}); //*
			await storeValue("ManageSelectList",ManageSelectList.length>0?ManageSelectList:[]);
			await resetWidget("Modal_EditMaster",true);
			this.cancelNewVersion()
			showModal(Modal_EditMaster.name); //*
			//
			

	},
	update:async(items)=>{
		if(sel_editMasterVersion.isDisabled){
			//new version
			await Promise.all( items.map(async (item,index)=>{
					const insertEntity={TYPE_NAME:inp_editMasterTypeName.text,
															SYSTEM_VALUE:item.value,
															FIXED_VALUE:item.label,
															SYSTEM_INDEX:index,
															VERSION:inp_New_Version_Name.text,
															ACTIVE:inp_editMasterIsActive.text
														 };
					await SP_INSERT_MASTERLIST.run(insertEntity);
				
			}))
			
			this.init(inp_New_Version_Name.text,inp_editMasterTypeName.text);
		}else{
			const IDExists = await items.map((item)=>item.MASTER_LIST_ID);
			let deleteItems = appsmith.store.ManageSelectList;
			deleteItems = await deleteItems.filter((item)=>!IDExists.includes(item.MASTER_LIST_ID));
			await Promise.all( items.map(async (item,index)=>{
				if(_.trim( item.MASTER_LIST_ID)==""||item.MASTER_LIST_ID==null){
					//insert
					const insertEntity={TYPE_NAME:inp_editMasterTypeName.text,
															SYSTEM_VALUE:item.value,
															FIXED_VALUE:item.label,
															SYSTEM_INDEX:index,
															VERSION:sel_editMasterVersion.selectedOptionValue,
															ACTIVE:inp_editMasterIsActive.text
														 };
					await SP_INSERT_MASTERLIST.run(insertEntity);
				}else{
					//update
					const updateEntity={SYSTEM_VALUE:item.value,FIXED_VALUE:item.label,SYSTEM_INDEX:index,MASTER_LIST_ID:item.MASTER_LIST_ID};
					await M0_UPDATE_MASTER.run(updateEntity);
				}
			}))
			await Promise.all(deleteItems.map(async(item)=>{
				//delete
				await M1_DELETE_MASTER.run({MASTER_LIST_ID:item.MASTER_LIST_ID});
			}))
			
		}
		showAlert("อัพเดทแล้วจ้าาาาาาาาาาาาาาาาาาาาาาาาาาาาาาาาาาาาาาา","success")
		
	},
	newVersion:async ()=>{
		await SELECT_ALL_BY_TYPE_NAME.run({TYPE_NAME:inp_editMasterTypeName.text})
		if(SELECT_ALL_BY_TYPE_NAME.data.map((ele)=>ele.VERSION).includes(inp_New_Version_Name.text)){
			showAlert("Duplicated version name found.","error");
			return;			
		}
		if(_.trim(inp_New_Version_Name.text)==""){
			showAlert("New version name is required.","error");
			return;
		}
		inp_editMasterIsActive.setValue("false");
		sel_editMasterVersion.setDisabled(true);

	},
	cancelNewVersion:()=>{
		inp_editMasterIsActive.setValue(appsmith.store.CurrentVersion.ACTIVE);
		sel_editMasterVersion.setDisabled(false);

	}
}