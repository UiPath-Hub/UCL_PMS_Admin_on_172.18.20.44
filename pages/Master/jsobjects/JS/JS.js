export default {
	init:(inVERSION,inTYPE_NAME)=>{
		inVERSION = inVERSION===undefined || inVERSION ===""?Table_MT.triggeredRow.VERSION:inVERSION;
		inTYPE_NAME = inTYPE_NAME===undefined || inTYPE_NAME ===""?Table_MT.triggeredRow.TYPE_NAME:inTYPE_NAME;
		SELECT_ALL_BY_TYPE_NAME.run({TYPE_NAME:inTYPE_NAME});
		SELECT_ALL_TYPE_BY_VERSION.run({TYPE_NAME:inTYPE_NAME,VERSION:inVERSION}).then(()=>{
			let data = SELECT_ALL_TYPE_BY_VERSION.data;
			let ManageSelectList = data.map(({SYSTEM_VALUE,FIXED_VALUE,SYSTEM_INDEX,ACTIVE})=>({label:FIXED_VALUE,value:SYSTEM_VALUE,index:SYSTEM_INDEX}));
			Manage.setSelectedOptions(ManageSelectList);
			VERSION.setValue(parseInt(inVERSION)+1);
			
			storeValue("TYPE_NAME_MODAL",inTYPE_NAME);
			storeValue("CurrentVersion",{VERSION:inVERSION,ACTIVE:data[0]===undefined?true:data[0].ACTIVE}); //*
			storeValue("ManageSelectList",ManageSelectList.length>0?ManageSelectList:[{label:"",value:""}])	
			showModal(Modal_newVersion.name); //*
			let newRaw = ManageSelectList.map(({label,value})=>({value:label,label:`${label},${value}`}));
				storeValue("ManageSelectListRaw",newRaw.length>0?newRaw:[{label:"",value:""}]).then(()=>{
				SelectListRaw.setSelectedOptions(newRaw);
			});
			
		});
	},
	insert:()=>{
		let newManageSelectList = appsmith.store["ManageSelectList"];
		let labelExist = newManageSelectList.filter((ele)=>ele.label==NewElementName.text);
		if(labelExist.length > 0){ 
			return showAlert(`New element name "${NewElementName.text}" already exists.`,"error");
		}
		newManageSelectList = newManageSelectList.filter((ele)=>Manage.selectedOptionValues.includes(ele.value))
		newManageSelectList =  [...newManageSelectList.slice(0,parseInt(InsertIndex.text)-1),
														{label:NewElementName.text,value:NewElementValue.text},
														...newManageSelectList.slice(parseInt(InsertIndex.text)-1,newManageSelectList.length)]
		console.log(newManageSelectList);
		let newRaw = newManageSelectList.map(({label,value})=>({value:label,label:`${label},${value}`}));
		storeValue("ManageSelectList",newManageSelectList).then(()=>{
			Manage.setSelectedOptions(newManageSelectList);
			NewElementValue.setValue("");
			NewElementName.setValue("");
		});
		storeValue("ManageSelectListRaw",newRaw).then(()=>{
				SelectListRaw.setSelectedOptions(newRaw);
		});
		
	},
	isHasChange:()=>{
		let Current = appsmith.store["ManageSelectList"];
		Current = Current.map((ele)=>ele.value)
		//console.log(`${JSON.stringify(Current)} != ${JSON.stringify(Manage.selectedOptionValues)}`)
		return JSON.stringify(Current) != JSON.stringify(Manage.selectedOptionValues)?true:false
	},
	onElementChange:()=>{
		let Options = appsmith.store["ManageSelectList"];
		let Current = Manage.selectedOptionValues;
		let Before = appsmith.store["SelectedListBefore"];
		if( Before !== undefined){
			if(Before.length < Current.length){
				Current = Options.filter((ele)=>Current.includes(ele.value));
				console.log(Current)
				Manage.setSelectedOptions(Current);
				SelectListRaw.setSelectedOptions([]).then(()=>{
				SelectListRaw.setSelectedOptions(Manage.selectedOptionValues);
			})
			}else{
				SelectListRaw.setSelectedOptions(Manage.selectedOptionValues);
			}
		}
			//SelectListRaw.setSelectedOptions([]).then(()=>{
			//	SelectListRaw.setSelectedOptions(Manage.selectedOptionValues);
			//})

			
			
		storeValue("SelectedListBefore", Current);
		
	},
	newVersion:()=>{
		SELECT_ALL_TYPE_BY_VERSION.run({TYPE_NAME: appsmith.store["TYPE_NAME_MODAL"],VERSION:VERSION.text}).then((data)=>{
			if(data.length== 0){
				let data = Manage.selectedOptionLabels.map((ele,index)=>({
					TYPE_NAME:appsmith.store["TYPE_NAME_MODAL"] ,
					SYSTEM_VALUE:Manage.selectedOptionValues[parseInt( index)],
					FIXED_VALUE:ele,
					SYSTEM_INDEX:index+1,
					VERSION:VERSION.text,
					//ACTIVE: NewTYPE_NAME.text!==undefined && NewTYPE_NAME.text !== ""?1:0
				}));
				Promise.all(data.map((row)=>{
					SP_INSERT_MASTERLIST.run(row).then(()=>{return 1}).catch((error)=>{showAlert(`Error inserting ${JSON.stringify(row)}`,"error"); return 0;});
				})).then(()=>{
					//console.log("insert result:"+ insertResult.toString());
					SELECT_ALL_BY_TYPE_NAME.run({TYPE_NAME:appsmith.store["TYPE_NAME_MODAL"]});
				})
			}else{
				showAlert(`Version "${VERSION.text}" already exists`,"error");
			}
		})
		
	},
	test:()=>{
		return JSON.stringify( appsmith.store.ManageSelectList)
	}
}