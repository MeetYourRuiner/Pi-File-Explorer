import React, { Component } from 'react';
import { withRouter } from "react-router";
import './ContextMenu.css';

class ContextMenu extends Component {
	async onDownload() {
		this.props.toggleVisibility();
		try {
			const { location, target } = this.props;
			const response = await fetch('api/download' + location.pathname + '/' + target.name);
			if (response.ok)
			{
				let blob = await response.blob();
				const url = window.URL.createObjectURL(new Blob([blob]));
				const link = document.createElement('a');
				link.href = url;
				link.setAttribute('download', target.name);
				document.body.appendChild(link);
				link.click();
				link.parentNode.removeChild(link);

				console.log('Downloaded');
			}
			else
			{
				console.log("Response.Code != 200");
			}
		} catch(err) {
			console.log(err.message);
		}
	}

	onCreateFolder() {
		this.props.toggleVisibility();
		const { location, setDialogState } = this.props;
		let path = location.pathname;
		setDialogState('folder', path);
	}

	onDelete() {
		this.props.toggleVisibility();
		const { location, target, setDialogState } = this.props;
		let path = location.pathname + '/' + target.name;
		setDialogState('delete', path);
	}

	onPrint() {
		this.props.toggleVisibility();
		const { location, target, setDialogState } = this.props;
		let path = location.pathname + '/' + target.name;
		setDialogState('print', path);
	}

	onRename() {
		this.props.toggleVisibility();
		const { location, target, setDialogState } = this.props;
		let path = location.pathname + '/' + target.name;
		setDialogState('rename', path);
	}

	render() {
		const { x, y, target } = this.props;
		let targetType;
		if (target.name === 'header')
		{
			targetType = 0; // HEADER
		}
		else 
		{
			targetType = target.isDirectory
				? 1			// DIRECTORY
				: 2;		// FILE
		}
		let styles = {
			'position': 'absolute',
			'top': y + 'px',
			'left': x + 'px'
		}
		return (
			<div className="context-menu noselect" style = {styles} ref={this.props.setContextMenuRef}>
				<ul>
					<li onClick = {() => this.onCreateFolder()}>Новая папка</li>
					{ targetType === 2 && <li onClick = {() => this.onDownload()}>Скачать</li>}
					{ targetType > 0 && <li onClick = {() => this.onRename()}>Переименовать</li> }
					{ targetType === 2 && <li onClick = {() => this.onPrint()}>Печать</li> }
					{ targetType > 0 && <li onClick = {() => this.onDelete()}>Удалить</li> }
				</ul>
			</div>
		);
	}
}

export default withRouter(ContextMenu);