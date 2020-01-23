import React from 'react';
import './styles/App.css';
import {
	BrowserRouter as Router,
	Route,
} from "react-router-dom";
import { FileExplorer } from './FileExplorer';
import BackComponent from './BackComponent';

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
