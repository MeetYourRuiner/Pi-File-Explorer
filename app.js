const express = require("express");
const FileInfo = require('./file');
const fileUpload = require('express-fileupload');
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

app.use(fileUpload());
app.post("/api/storage/?*", async (request, response) => {
	let path;
		if (request.params[0] !== undefined)
			path = request.params[0];
		else 
			path = "";
	if (request.files)
	{
		try {
			const payload = request.files.payload;
			if (Array.isArray(payload))
			{
				for (let file of payload)
				{
					file.mv(storage + '/' + path + '/' + file.name, (err, result) => {if (err) console.log(err)});
				}
				response.send("Uploaded");
			}
			else
			{
				payload.mv(storage + '/' + path + '/' + payload.name, (err, result) => {if (err) console.log(err)});
				response.send("Uploaded");
			}
		} catch (err) {
			response.status(500).send("ERROR");
			console.log(err);
		}
	}
	else 
	{
		response.status(400).send("Not a file");
	}
});

app.listen(5000);