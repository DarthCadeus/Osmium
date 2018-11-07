const available_icons = ["ai", "avi", "css", "dbf", "doc", "dwg", "exe", "fla", "html", "iso", "js", "json", "mp3", "mp4", "pdf", "png", "ppt", "rtf", "svg", "txt", "xls", "xml", "zip"];
const icon_redirect = {
	"docx": "doc",
	"pptx": "ppt",
	"xlsx": "xls",
	"md": "rtf",
	"xhtml": "html"
};

class FileObject {
	constructor (config) {
		this.url = config.url;
		this.size = config.size;
		this.createdAt = config.createdAt;
		this.modifiedAt = config.modifiedAt;
		this.user = config.user;
		this.permissions = config.permit;
		this.type = config.type;
		if(this.type in available_icons) {
			this.icon = "assets/logos/File icons/"+this.type+".png";
		} else if (icon_redirect[this.type]) {
			this.icon = "assets/logos/File icons/"+icon_redirect[this.type]+".png";
		} else {
			this.icon = "assets/logos/File icons/generic.png";
		}
	}
}

FileObject.prototype.permit = function (user) {
	if(this.permissions.user == user) return true;
	return false;
};
