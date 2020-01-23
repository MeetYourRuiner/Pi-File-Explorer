import React, { Component } from 'react';

export class FileRow extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isDirectory: this.props.isDirectory
		}
	}

	render() {
		if (this.props.isDirectory)
		{
			return (
				<tr key = {this.props.name} className="folder" onClick = {() => this.props.handler(this.props.name)}>
					{this.props.children}
				</tr>
			)
		}
		else
		{
			return (
				<tr key = {this.props.name}>
					{this.props.children}
				</tr>
			)
		}
	}
}