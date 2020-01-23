const express = require("express");
const FileInfo = require('./file');
const fs = require("fs").promises;

const app = express();

const storage = "Storage";

app.use(function(request, response, next){
	let now = new Date();
    let hour = now.getHours();
    let minutes = now.getMinutes();
    let seconds = now.getSeconds();
    let data = `${hour}:${minutes}:${seconds} ${request.method} ${request.url}`;
    console.log(data);
    next();
});

app.get("/api/storage/?*", async (request, response) => {
	try {
		console.log("Дошло");
		let path;
		if (request.params[0] !== undefined)
			path = request.params[0];
		else 
			path = "";
		let filenames = await fs.readdir(storage + '/' + path);
		let files = [];
		for (let name of filenames){
			let stats = await fs.stat(storage + '/' + path +  '/' + name);
			files.push(new FileInfo(name, stats["size"], stats["ctime"], stats["mtime"], stats.isDirectory()))
		}
		response.json(files);
	} catch (err) {
		response.status(500).send("ERROR");
		console.log(err);
	}
});

app.listen(5000);