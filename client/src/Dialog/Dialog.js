import React, { useState } from 'react';
import './Dialog.css';

function Dialog(props) {
	const {setDialogState} = props;
	if (!props.type)
	{
		return null;
	}

	const onSubmit = async (e, path, method, param = null) => {
		e.preventDefault();
		try {
			const response = await fetch(path, {
				method:method
			});
			if (response.ok)
			{
				console.log('Done');
				props.fetchStorage();
			}
			else
			{
				console.log("Response.Code != 200");
			}
		} catch(err) {
			console.log(err.message);
		} finally {
			setDialogState(null);
		}
	}

	const ConfirmDialog = (props) => {
		let { cancelText, okText, labelText } = props;
		return (
			<form 
				onSubmit={(e) => {onSubmit(e, path, method)}} 
				id="dialog"
			>
				<label>
					<b>{labelText}</b>
				</label>
				<p>
					<input id="ok" className="dialog-button" type="submit" value={okText} />
					<button onClick={() => setDialogState(null)} id="cancel" className="dialog-button">{cancelText}</button>
				</p>
			</form>
			);
	}

	const CreateFolderDialog = (props) => {
		const [textValue, setTextValue] = useState(null);
		const handleChange = (e) => {
			setTextValue(e.target.value);
		}
		let { cancelText, okText, labelText, placeholderText } = props;
		return (
			<form 
				onSubmit={(e) => {onSubmit(e, path + '/' + textValue, method)}} 
				id="dialog"
			>
					<label>
						<b>{labelText}</b>
					</label>
					<p><input type="text" placeholder={placeholderText} onChange={handleChange}/></p>
					<p>
						<input id="ok" className="dialog-button" type="submit" value={okText} />
						<button onClick={() => setDialogState(null)} id="cancel" className="dialog-button">{cancelText}</button>
					</p>
			</form>
			);
	}

	const RenameDialog = (props) => {
		const [textValue, setTextValue] = useState(null);
		const handleChange = (e) => {
			setTextValue(e.target.value);
		}
		let { cancelText, okText, labelText, placeholderText } = props;
		return (
			<form 
				onSubmit={(e) => {onSubmit(e, path + '/' + textValue, method)}} 
				id="dialog"
			>
					<label>
						<b>{labelText}</b>
					</label>
					<p><input type="text" placeholder={placeholderText} onChange={handleChange}/></p>
					<p>
						<input id="ok" className="dialog-button" type="submit" value={okText} />
						<button onClick={() => setDialogState(null)} id="cancel" className="dialog-button">{cancelText}</button>
					</p>
			</form>
			);
	}

	let path, method;
	let content = null;

	switch (props.type)
	{
		case 'delete':
			path = '/api/delete' + props.data;
			method = 'DELETE';
			content = <ConfirmDialog okText={'Ок'} cancelText={'Отмена'} labelText={'Удалить ' + props.data + '?'}/>;
			break;
		case 'folder':
			path = '/api/create' + props.data; // + folderName
			method = 'POST';
			content = <CreateFolderDialog okText={'Создать'} cancelText={'Отмена'} labelText={'Новая папка'} placeholderText={'Имя папки...'}/>;
			break;
		case 'rename':
			path = '/api/rename' + props.data; // + folderName
			method = 'PATCH';
			content = <RenameDialog okText={'Ок'} cancelText={'Отмена'} labelText={'Переименовать ' + props.data} placeholderText={'Новое имя...'}/>;
			break;
		default:
			break;
	}

	return (
		<div id="dialog-wrapper" onClick={(e) => {if (e.target.id === "dialog-wrapper") setDialogState(null)}}>
				{content}
		</div>			
	);
}

export default Dialog;

