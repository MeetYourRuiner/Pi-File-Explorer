import React, { Component } from 'react';
import FileTable from './FileTable/FileTable';

export class FileExplorer extends Component {
	constructor(props) {
		super(props);
		this.state = {
			sortKey: 'name',
			sortDirection: 1
		}
		this.onHeaderClick = this.onHeaderClick.bind(this);
	}

	onHeaderClick(e) {
		e.preventDefault();
		if (e.target.className === this.state.sortKey)
		{
			let factor = this.state.sortDirection;
			factor *= -1;
			this.setState({sortDirection: factor});
		}
		else
		{
			this.setState({sortKey: e.target.className, sortDirection: 1});
		}
	}

	render() {
		return (
			<div>
				<FileTable
					onHeaderClick = {this.onHeaderClick}
					sortKey = {this.state.sortKey}
					sortDirection = {this.state.sortDirection}
				/>
			</div>
		)
	}
}

export default FileExplorer;