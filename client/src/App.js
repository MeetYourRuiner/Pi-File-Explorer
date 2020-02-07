import React from 'react';
import './App.css';
import {
	BrowserRouter as Router,
	Route,
} from "react-router-dom";
import FileExplorer from './FileExplorer';
import BackButton from './BackButton/BackButton';

function App() {
	return (
		<div className="wrapper">
			<Router>
				<BackButton/>
				<div className="App">
					<Route path="/:path?" component = {FileExplorer}/>
				</div>
			</Router>
		</div>	
	);
}

export default App;
