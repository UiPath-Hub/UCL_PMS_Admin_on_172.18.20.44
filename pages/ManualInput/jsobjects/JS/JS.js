export default {
	parseBoolean:(value)=>{
		if (typeof value !== "string") return false;

		return ["true", "1"].includes(
			value.trim().toLowerCase()
		);
	},
	onEditTableData:(currentIndex)=>{
		console.log(currentIndex)
		return currentIndex;
		//TableData.PROFILE[]
	},
	on_confirmClick:async ()=>{
		await SP_HANDLE_TOKEN.run();
		if(SP_HANDLE_TOKEN.data && SP_HANDLE_TOKEN.data[0].TOTAL_RECORD > 0 && SP_HANDLE_TOKEN.data[0].RESULT_CODE == undefined){
			//let SESSION = {TOKEN:"",PERMISSIONS:[],EMAIL:Input1.text};
			if(SP_HANDLE_TOKEN.data[0].TOKEN == '' || SP_HANDLE_TOKEN.data[0].TOKEN == null){
				showAlert("Create session error.");
			}else{
				//SESSION.TOKEN = SP_HANDLE_TOKEN.data[0].TOKEN;
				//SESSION.START_PAGE = SP_HANDLE_TOKEN.data[0].START_PAGE;
				//SESSION.PERMISSIONS = SP_HANDLE_TOKEN.data.map((ele)=>ele.PERMISSION_ID);
				AppState.CurrentSession.email = Input1.text;
				AppState.CurrentSession.SessionToken = SP_HANDLE_TOKEN.data[0].TOKEN;
				AppState.CurrentSession.tenant = Select_TENANT.selectedOptionValue;
				AppState.CurrentSession.permissions =  SP_HANDLE_TOKEN.data.map((ele)=>ele.PERMISSION_ID);
				//await storeValue("userSession",SESSION,false);
			}

		}else{
			if(SP_HANDLE_TOKEN.data[0].RESULT_CODE){
				showAlert(SP_HANDLE_TOKEN.data[0].RESULT_CODE,"error");
			}else{
				showAlert("No any permissions assigned. Please, contact admin.","error");
			}
		}
	},
	LogSession:()=>{
		if(AppState.CurrentSession.SessionToken == ""){
			AppState.CurrentSession.visibility = true;
		}else{
			AppState.CurrentSession = {...AppState.CurrentSessionDefault};
		}

	},
	downloadTemplateTable:(tableName)=>{
		if(typeof tableName != 'string')return;
		if(TableColumn[tableName] == undefined){console.log("unknown table name"); return;}
		let listColumn = Object.values(TableColumn[tableName]);
		download("\uFEFF"+listColumn.join(","), tableName+'.CSV', 'text/csv');
	},
	convertCSVToDataTable:async(fileWidget,tableName)=>{
		if(typeof tableName != 'string')return;
		TableData[tableName] = [];
		if(TableColumn[tableName] == undefined){console.log("unknown table name"); return;}
		let fileData = fileWidget.files[0];
		if(fileData){
			if(fileData.data.length > 0){
				//let dataTable = [];
				let r = 0
				//await Promise.all( 
				//fileData.data.map(async(CSVRows)=>{
				while(fileData.data[r]!== undefined){
					let CSVRows = fileData.data[r];
					let dataRow = {};
					let n = 0;
					let thisTableColumn = Object.values(TableColumn[tableName]);
					//await Promise.all( 
					while(thisTableColumn[n] !== undefined){
						let columnName = thisTableColumn[n]
						console.log('columnName ' + columnName);
						//Object.values(TableColumn[tableName]).forEach(async (columnName)=>{
						if(Object.keys(CSVRows).includes(columnName)){
							const data = _.trim(CSVRows[columnName]??"")
							if(data!=""){
								//console.log(data);
								let dropDownValidateCheck = TableDropdown[tableName]!==undefined?TableDropdown[tableName][columnName]:undefined;
								let searchSetCheck = TableSearchSet[tableName]!==undefined? TableSearchSet[tableName][columnName]:undefined;
								if(dropDownValidateCheck !== undefined){
									let dropdownData = await TableDropdown.getData(dropDownValidateCheck);
									dropdownData = dropdownData.map((f)=>{
										let i = f.SYSTEM_VALUE;
										//split?
										if(i !== undefined && dropDownValidateCheck.spliter === true && 
											 dropDownValidateCheck.splitWith !== undefined && 
											 dropDownValidateCheck.splittedArrayPosition !== undefined){
											i = i.split(dropDownValidateCheck.splitWith)??[];
											if(i.length > dropDownValidateCheck.splittedArrayPosition){
												i = i[dropDownValidateCheck.splittedArrayPosition]
											}
										}

										return {full:f.SYSTEM_VALUE,specific:i};
									});
									console.log(dropdownData);
									let matching = dropdownData.find(i=>i.specific===data);
									dataRow[dropDownValidateCheck.customName] = matching!== undefined?matching.full:"Master Not found";
									dataRow[columnName]=data;
								}else if(searchSetCheck !== undefined){
									let searchData = await TableSearchSet.getData(searchSetCheck,_.trim(data));
									console.log('searchData '+JSON.stringify(searchData));
									if(searchData && searchData.length === 1){
										dataRow[searchSetCheck.columnDetail] = searchData[0][searchSetCheck.columnDetail]??"column not found";
										if(searchSetCheck.additionalDetail){
											await Promise.all(
												searchSetCheck.additionalDetail.map(async ({ columnName, AS }) => {
													if (searchData[0][columnName] !== undefined) {
														dataRow[AS] = searchData[0][columnName]
													}
												})
											)
										}
									}else if(searchData==undefined||searchData.length === 0){
										dataRow[searchSetCheck.columnDetail] = `Not found`;
									}else{
										dataRow[searchSetCheck.columnDetail] = "Count > 1";
									}
									dataRow[columnName]=data;
								}
								else{
									dataRow[columnName]=data;
								}

							}

						}else{
							//showAlert(columnName+" missing.","alert"); 
						}
						//})
						n++;
					} //while end
					//) //promise end
					if(Object.keys(dataRow).length>0){
						//dataTable.push(dataRow);
						TableData[tableName].push(dataRow);
					}
					//})) //first promise end

					r++;
				} //first while end
				//console.log(dataTable);
				//TableData[tableName] = dataTable;
				return TableData[tableName];
			}else{
				showAlert(`No rows detected or the header not found.`);
			}
		}
	},
	InsertToSQL:async(tableName)=>{
		let failueRow = [];
		let query = TableInsertQuery[tableName];
		let tableData = TableData[tableName];

		const pushHistory = (row)=>{if(TableDataInsertHistory[tableName]!==undefined) TableDataInsertHistory[tableName].push(row);};
		if(query === undefined || tableData === undefined)return;			

		while(tableData.length >= 1){
			let row = tableData.pop();
			if(row){
				//try{
				let data = await query.run(row);
				console.log(data);
				if(data[0] && data[0].RESULT_CODE === "ERROR"){
					row.ERROR = query.data[0].RESULT_MESSAGES;
					failueRow.push(row); 
				}else{
					row.ERROR = "-"
					pushHistory(row);
				}
				/*}catch(error){
					console.log("catch error");
					if(typeof error === 'object' && Object.keys(error).length >0){
						row.ERROR = JSON.stringify(error??"");
					}
					row.ERROR = error??"Error";
					failueRow.push(row); 
				}*/
			}
		}
		console.log(failueRow);
		failueRow = failueRow.filter(i=>i!=undefined);
		if(failueRow.length>0){
			showAlert("Some data row was import unsuccessfully.","error");
		}
		TableData[tableName] = failueRow;

	},
}