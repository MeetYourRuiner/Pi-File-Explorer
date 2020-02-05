import React from 'react';
import './App.css';
import {
	BrowserRouter as Router,
	Route,
} from "react-router-dom";
import { FileExplorer } from './FileExplorer';
import BackComponent from './BackComponent/BackComponent';

function App() {
	return (
		<div className="wrapper">
			<Router>
				<BackComponent/>
				<div className="App">
					<Route path="/:path?" component = {FileExplorer}/>
				</div>
			</Router>
		</div>	
  );
}

export default App;
