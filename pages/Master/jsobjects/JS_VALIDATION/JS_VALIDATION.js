export default {
	csvValidate:[],
	onSaveEdit:async()=>{
		
	},
	onSubmitNewRow:async()=>{
		await V1_INSERT_VALIDATION.run();
		await V0_SELECT_VALIDATION_FIELD.run();
	},
	onSaveUpdateRow:async()=>{
		await V2_UPDATE_VALIDATION.run();
		await V0_SELECT_VALIDATION_FIELD.run();
	}
	,
	onUploadCSV:async ()=>{
		if(!INSERT_FIELDS_VALIDATE_FILE.files[0].type.includes("csv"))return;
		if(INSERT_FIELDS_VALIDATE_FILE.files[0].data.length == 0)return;
		let SQLcolumnsNames = ["VALIDATION_ID","PAGE_NAME", "FIELD_NAME", "REQUIRED", "REGEX"];
		let newInsertTable=[];			
		let unknownCSVColumns = Object.keys(INSERT_FIELDS_VALIDATE_FILE.files[0].data[0]).filter((key)=>!SQLcolumnsNames.includes(key));
		
		await Promise.all( INSERT_FIELDS_VALIDATE_FILE.files[0].data.map(async (row)=>{
			let newRow = {};

			await Promise.all( SQLcolumnsNames.map(async (columnName)=>{
				if(row[columnName]!= undefined){
					newRow[columnName] = _.trim(row[columnName]);
				}else{
					newRow[columnName] = null;
				}
				
			}));
			await Promise.all(unknownCSVColumns.map(async(columnName)=>{
				newRow[`Unknown(${columnName})`] = row[columnName];
			}) )
			newInsertTable.push(newRow);
		}))
		await V0_SELECT_VALIDATION_FIELD.run();
		newInsertTable = await Promise.all(newInsertTable.map(async(row)=>{
			const oldData = V0_SELECT_VALIDATION_FIELD.data.filter((ele)=>ele.VALIDATION_ID==row.VALIDATION_ID);
			if(oldData.length >0 ){
				row.Trace = "Update"
				await Promise.all( Object.keys(row).map(async (key)=>{
					if(oldData[0][key.toString()]!=undefined && oldData[0]["VALIDATION_ID"]!=undefined){
						row[key+"(Present)"]=oldData[0][key.toString()]
						
					}
				}))
			}else{
				row.Trace = "Insert"
			}
			return row;
		}))
		this.csvValidate=newInsertTable;
		showModal(Modal_InsertCSV_FieldValidate.name);
	},
	onConfirmInsertCSV:async()=>{
		await Promise.all( this.csvValidate.filter((ele)=>ele.Trace == "Update").map(async (row)=>{
			await V2_UPDATE_VALIDATION.run(row);
		}))
		await Promise.all( this.csvValidate.filter((ele)=>ele.Trace == "Insert").map(async (row)=>{
			await V1_INSERT_VALIDATION.run(row);
		}))
		V0_SELECT_VALIDATION_FIELD.run();
		closeModal(Modal_InsertCSV_FieldValidate.name);
	},
	onDeleteFieldsValidationClick:()=>{
		showModal(Modal_ConfirmDelete.name);
	},
	onConfirmDeleteClick:async()=>{
		await V3_DELETE_VALIDATION.run();
		await V0_SELECT_VALIDATION_FIELD.run();
		closeModal(Modal_ConfirmDelete.name);
	}
}