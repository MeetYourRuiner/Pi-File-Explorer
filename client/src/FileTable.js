import React, { Component } from 'react';
import { TableRow } from './TableRow'

export class FileTable extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isDragOver: false,
			EnterCounter: 0,
			loading: true,
			storage: []
		}
		this.sortFunc = this.sortFunc.bind(this);
	}
	
	componentDidMount() {
		this.fetchStorage();
	}

	componentDidUpdate(prevProps) {
		if (prevProps.path !== this.props.path)
			this.fetchStorage();
	}

	async fetchStorage() {
		this.setState({loading: true})
		let path = this.props.path;
		try	{
			const response = await fetch('/api/storage' + path);
			if (response.ok)
			{
				let data = await response.json();
				let storage = data.reduce((prev, curr) => {
					if (curr.isDirectory)
						prev.folders.push(curr);
					else
						prev.files.push(curr);
					return {
						files:prev.files,
						folders:prev.folders
					};
				}, {files:[],folders:[]});
				this.setState({loading:false, storage: storage});
			}
			else
			{
				console.log("Response.Code != 200");
			}
		} catch(error) {
			console.log(error.message);
		}
	}

	async dropHandler(e) {
		e.preventDefault();
		try	{
			if (e.dataTransfer.items) {
				const payload = new FormData();
				for (let i = 0; i < e.dataTransfer.files.length; i++) {
					payload.append("payload", e.dataTransfer.files[i]);
				}
				await fetch(`/api/storage${this.props.path}`, {
					method:'POST',
					body: payload
				});
				await this.props.fetchStorage();
			}
		} catch(error) {
			console.log(error.message);
		}
		this.setState({isDragOver: false, EnterCounter: 0});
	}

	dragoverHandler(e) {
		e.preventDefault();
	}

	dragleaveHandler(e) {
		e.preventDefault();
		let counter = this.state.EnterCounter;
		counter--;
		this.setState({EnterCounter: counter});
		if (counter === 0) 
			this.setState({isDragOver: false});
	}

	dragenterHandler(e) {
		e.preventDefault();
		this.setState({isDragOver: true});
		let counter = this.state.EnterCounter;
		counter++;
		this.setState({EnterCounter: counter});
	}

	sortFunc(a, b) {
		let factor = this.props.sortDirection;
		let result = 0;
		switch(this.props.sortKey)
		{
			case 'name':
				if (a.name < b.name)
					result = -1;
				if (a.name > b.name)
					result = 1;
				break;
			case 'size':
				if (a.size < b.size)
					result = -1;
				if (a.size > b.size)
					result = 1;
				break;
				case 'mtime':
				if (a.mtime < b.mtime)
					result = -1;
				if (a.mtime > b.mtime)
					result = 1;
				break;
			default:
				break;
		}
		return result * factor;
	}

	renderTable() {
		let storage = this.state.storage;
		return (
			<tbody>
					{storage.folders.map(f =>
						<TableRow key = {f.name} file = {f} onClickFolder = {this.props.onClickFolder}/>
					)}
					{storage.files
						.sort(this.sortFunc)
						.map(f =>
							<TableRow key = {f.name} file = {f}/>
					)}
			</tbody>
		);
	}

	render() {
		let classNames = "noselect drop-zone";
		let contents = this.state.loading
			? <p>Loading</p>
			: this.renderTable();
		const sortKey = this.props.sortKey;
		const sortDirection = this.props.sortDirection === 1 ? "⇑" : "⇓";
		if (this.state.isDragOver)
		{
			classNames+=" dragging";
		}
		return (
			<table className= {classNames} 
				onDrop = {(e) => this.dropHandler(e)} 
				onDragOver = {(e) => this.dragoverHandler(e)}
				onDragLeave = {(e) => this.dragleaveHandler(e)}
				onDragEnter = {(e) => this.dragenterHandler(e)}
			>
				<thead>
                    <tr>
                        <th className="type"/>
						<th className="name" onClick={(e) => this.props.onHeaderClick(e)}>
							Имя { sortKey === 'name' ? sortDirection : '' }
						</th>
						<th className="size" onClick={(e) => this.props.onHeaderClick(e)}>
							Размер { sortKey === 'size' ? sortDirection : '' }
						</th>
						<th className="mtime" onClick={(e) => this.props.onHeaderClick(e)}>
							Дата изменения { sortKey === 'mtime' ? sortDirection : '' }
						</th>
                    </tr>
                </thead>
				{contents}
			</table>
		)
	}
}