import React, { Component } from 'react';
import { withRouter } from "react-router";
import './ContextMenu.css';

class ContextMenu extends Component {
	async onDownload() {
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

	render() {
		const { x, y, target } = this.props;
		let styles = {
			'position': 'absolute',
			'top': y + 'px',
			'left': x + 'px'
		}
		return (
			<div className="context-menu noselect" style = {styles} ref={this.props.setContextMenuRef}>
				<ul>
					<li>Новая папка</li>
					{!target.isDirectory && <li onClick = {() => this.onDownload()}>Скачать</li>}
					<li>Переименовать</li>
					<li>Печать</li>
					<li>Удалить</li>
				</ul>
			</div>
		);
	}
}

export default withRouter(ContextMenu);