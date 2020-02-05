import React, { Component } from 'react';
import fileImage from '../images/file.png'
import folderImage from '../images/folder.png'

export class TableRow extends Component {
	convertBytes(size) {
		const prefixes = ['B', 'KB', 'MB', 'GB'];
		let power = 0;
		while(size > 1024)
		{
			size = Math.floor(size/1024);
			power++;
		}
		return size + ' ' + prefixes[power];
	}

	render()
	{
		let file = this.props.file;
		let classNameRow = file.isDirectory ? 'folder' : 'file';
		let onClickRow = file.isDirectory ? () => this.props.onClickFolder(file.name) : null;
		return (
			<tr key = {this.props.name} className={classNameRow} onClick = {onClickRow}>
				<td className="type">
					<img className="type-image" alt="" src = {file.isDirectory ? folderImage : fileImage}/>
				</td>
				<td className="name">
					{file.name}
				</td>
				<td className="size">
					{file.isDirectory ? <p></p>: <p>{this.convertBytes(file.size)}</p>}
				</td>
				<td className="mtime">
					{new Date(file.mtime).toLocaleString()}
				</td>
			</tr>
		)
	}
}