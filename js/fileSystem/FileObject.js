const available_icons = ["ai", "avi", "css", "dbf", "doc", "dwg", "exe", "fla", "html", "iso", "js", "json", "mp3", "mp4", "pdf", "png", "ppt", "rtf", "svg", "txt", "xls", "xml", "zip", "directory"];
const icon_redirect = {
	"docx": "doc",
	"pptx": "ppt",
	"xlsx": "xls",
	"md": "rtf",
	"xhtml": "html",
};

class BoundFileObject {
	constructor (config) {
		this.url = config.url;
		this.size = config.size;
		this.createdAt = config.createdAt;
		this.modifiedAt = config.modifiedAt;
		this.user = config.user;
		this.permissions = config.permit;
		this.type = config.type;
		this.objectId = config.objectId;
		this.selfObjectId = config.selfObjectId;
		if(available_icons.indexOf(this.type) != -1) {
			this.icon = "assets/logos/File icons/"+this.type+".png";
		} else if (icon_redirect[this.type]) {
			this.icon = "assets/logos/File icons/"+icon_redirect[this.type]+".png";
		} else {
			this.icon = "assets/logos/File icons/generic.png";
		}
		this.config = config;
	}
}

BoundFileObject.prototype.permit = function (user) {
	if(this.permissions.user.id == user.id) return true;
	return false;
};
