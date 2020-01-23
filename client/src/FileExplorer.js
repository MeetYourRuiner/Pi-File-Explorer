import React, { Component } from 'react';
import './styles/FileExplorer.css';
import { FileRow } from './FileRow';
import file_image from './images/file2.svg'
import folder_image from './images/folder2.svg'

export class FileExplorer extends Component {
	constructor(props) {
		super(props);
		this.state = {
			storage: [],
			loading: true,
			currentPath: this.getPath()
		}
		this.handleOpeningFolder = this.handleOpeningFolder.bind(this);
	}
	
	componentDidMount() {
		this.fetchStorage();
	}

	componentDidUpdate() {
		if (this.getPath() !== this.state.currentPath)
		{
			this.setState({currentPath: this.getPath()}, () => this.fetchStorage())
		}
	}

	getPath() {
		let temp = this.props.location.pathname;
		if (temp === '/')
			temp = '';
		return temp;
	}

	async fetchStorage() {
		this.setState({loading: true})
		let path = this.getPath();
		try
		{
			const response = await fetch('/api/storage' + path);
			const data = await response.json();
			this.setState({loading:false, storage: data});
		}
		catch(error)
		{
			console.log(error.message);
		}
	}

	handleOpeningFolder(folderName) {
		console.log("Push :" + this.state.currentPath + '/' + folderName);
		this.props.history.push(this.state.currentPath + '/' + folderName);
	}

	renderTable() {
		let data = this.state.storage;
		return (
			<table className="noselect">
				<thead>
                    <tr>
                        <th className="type"></th>
						<th className="name">Имя</th>
						<th className="size">Размер</th>
						<th className="mtime">Дата создания</th>
						{/*
							<th className="ctime">Дата изменения</th>
						*/}
                    </tr>
                </thead>
				<tbody>
				{data.map(file =>
							<FileRow key = {file.name} name = {file.name} isDirectory = {file.isDirectory} handler = {this.handleOpeningFolder}>
								<td className="type"><img className="type-image" alt="" src = {file.isDirectory ? folder_image : file_image}/></td>
								<td className="name">{file.name}</td>
								<td className="size">{file.isDirectory ? <p></p>: <p>{file.size} КБ</p>}</td>
								{/*
									<td>{new Date(file.ctime).toLocaleString()}</td>
								*/}
								<td className="mtime">{new Date(file.mtime).toLocaleString()}</td>
							</FileRow>
					)
				}
				</tbody>
			</table>
		);
	}

	render() {
		let contents = this.state.loading 
			? <p>Loading...</p>
			: this.renderTable();
		return (
			<div>
				{contents}
			</div>
		)
	}
}