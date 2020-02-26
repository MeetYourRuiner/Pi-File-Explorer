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

//	Получение содержимого папки
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

//	Скачивание файла
app.get("/api/download/?*/:file", async (request, response) => {
	try {
		let path;
		if (request.params[0] !== undefined)
				path = request.params[0];
		else
			path = "";
		const filename = request.params.file;
		response.download(storage + '/' + path + '/' + filename);
	} catch (err) {
		response.status(500).send("ERROR");
		console.log(err);	
	}
});

//	Удаление файла/папки
app.delete("/api/delete/?*/:file", async (request, response) => {
	try {
		let path;
		if (request.params[0] !== undefined)
			path = request.params[0];
		else 
			path = "";
		const filename = request.params.file;

		let stats = await fs.stat(storage + '/' + path +  '/' + filename);
		if (stats.isDirectory())
		{
			const removeRecursive = async (p) => {
				try {
					let files = await fs.readdir(p);
					for (let file of files)
					{
						let stat = await fs.stat(p + '/' + file);
						if (!stat.isDirectory())
							await fs.unlink(p +  '/' + file);
						else 
							await removeRecursive(p + '/' + file);
					}
					await fs.rmdir(p);
				} catch (err) {
					console.log('Не удалось удалить ' + p);
				}
				
			}

			await removeRecursive(storage + '/' + path +  '/' + filename);
		}
		else
		{
			await fs.unlink(storage + '/' + path +  '/' + filename);
		}
		response.send(`${filename} deleted`);
	} catch (err) {
		response.status(500).send("ERROR");
		console.log(err);	
	}
});

//	Загрузка файла
app.use(fileUpload());
app.post("/api/upload/?*", async (request, response) => {
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

//	Новая папка
app.post("/api/create/?*/:folder", async (request, response) => {
	let path;
	if (request.params[0] !== undefined)
		path = request.params[0];
	else 
		path = "";
	let folderName = request.params.folder;
	try {
		await fs.mkdir(storage + '/' + path + '/' + folderName);
		response.send(storage + '/' + path + '/' + folderName + ' created');
	} catch (err) {
		response.status(500).send("ERROR");
		console.log(err);
	}
});

//	Переименование
app.patch("/api/rename/?*/:oldName/:newName", async (request, response) => {
	let path;
	if (request.params[0] !== undefined)
		path = request.params[0];
	else 
		path = "";
	let toRename = request.params.oldName;
	let newName = request.params.newName;
	try {
		let fullPath = storage + '/' + path + '/';
		await fs.rename(fullPath + toRename, fullPath + newName);
		response.send(fullPath + toRename + ' renamed');
	} catch (err) {
		response.status(500).send("ERROR");
		console.log(err);
	}
});

app.listen(5000);