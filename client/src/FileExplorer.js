import React, { Component } from 'react';
import './styles/FileExplorer.css';
import { FileTable } from './FileTable';

export class FileExplorer extends Component {
	constructor(props) {
		super(props);
		this.state = {
			storage: [],
			refresh: false,
			currentPath: this.getPath(),
			sortKey: 'name',
			sortDirection: 1
		}
		this.onClickFolder = this.onClickFolder.bind(this);
		this.getPath = this.getPath.bind(this);
		this.onHeaderClick = this.onHeaderClick.bind(this);
		this.refreshStorage = this.refreshStorage.bind(this);
	}

	componentDidUpdate() {
		if (this.getPath() !== this.state.currentPath)
		{
			this.setState({currentPath: this.getPath()});
		}
	}

	refreshStorage() {
		this.setState({refresh: !this.state.refresh});
	}

	getPath() {
		let path = this.props.location.pathname;
		if (path === '/')
			path = '';
		return path;
	}

	onClickFolder(folderName) {
		console.log("Push: " + this.state.currentPath + '/' + folderName);
		this.props.history.push(this.state.currentPath + '/' + folderName);
	}

	onHeaderClick(e) {
		e.preventDefault();
		e.stopPropagation();
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
			<FileTable
			 	path = {this.getPath()}
				onClickFolder = {this.onClickFolder}
				onHeaderClick = {this.onHeaderClick}
				sortKey = {this.state.sortKey}
				sortDirection = {this.state.sortDirection}
				frefresh = {this.refreshStorage}
				refresh = {this.state.refresh}
			/>
		)
	}
}