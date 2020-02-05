import React from 'react';
import { withRouter } from 'react-router-dom';
import back_image from '../images/back.svg';
import './BackComponent.css';

function BackComponent(props) {
	const handleClick = () => {
		if (props.location.pathname !== '/')
			props.history.goBack();
	}

	return (
		<div className = "noselect Back" onClick = {handleClick}>
			<img className = "back-image" alt = "" src = {back_image}/>
		</div>
	);
}

export default withRouter(BackComponent)