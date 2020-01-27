import React, { Component } from 'react';
import file_image from './images/file2.png'
import folder_image from './images/folder2.png'

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
		let trClassName = file.isDirectory ? 'folder' : 'file';
		let trOnClick = file.isDirectory ? () => this.props.onClickFolder(file.name) : undefined;
		return (
			<tr key = {this.props.name} className={trClassName} onClick = {trOnClick}>
				<td className="type">
					<img className="type-image" alt="" src = {file.isDirectory ? folder_image : file_image}/>
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