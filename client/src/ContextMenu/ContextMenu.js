import React, { Component } from 'react';
import './ContextMenu.css';

export class ContextMenu extends Component {
	constructor(props) {
		super(props);
		this.state = {
			visible: false
		}
	}

	render() {
		let x = this.props.x;
		let y = this.props.y;
		let styles = {
			'position': 'absolute',
			'top': y + 'px',
			'left': x + 'px'
		}
		return (
			<div className="context-menu noselect" style = {styles} ref={this.props.setContextMenuRef}>
				<ul>
					<li>Новая папка</li>
					<li>Скачать</li>
					<li>Переименовать</li>
					<li>Печать</li>
					<li>Удалить</li>
				</ul>
			</div>
		);
	}
}