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

	async onDelete() {
		this.props.toggleVisibility();
		try {
			const { location, target } = this.props;
			let path = location.pathname;
			const response = await fetch('/api/storage' + path + '/' + target.name, {
				method:'DELETE'
			});
			if (response.ok)
			{
				console.log('Deleted');
			}
			else
			{
				console.log("Response.Code != 200");
			}
		} catch(err) {
			console.log(err.message);
		}
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
					<li>Новая папка</li>
					{ targetType === 2 && <li onClick = {() => this.onDownload()}>Скачать</li>}
					{ targetType > 0 && <li>Переименовать</li> }
					{ targetType === 2 && <li>Печать</li> }
					{ targetType > 0 && <li onClick = {() => this.onDelete()}>Удалить</li> }
				</ul>
			</div>
		);
	}
}

export default withRouter(ContextMenu);