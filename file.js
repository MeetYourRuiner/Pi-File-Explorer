class FileInfo {
	constructor(filename, size, ctime, mtime, isDirectory) {
		this.name = filename;
		this.size = size;
		this.ctime = ctime;
		this.mtime = mtime;
		this.isDirectory = isDirectory;
	}
}

module.exports = FileInfo;