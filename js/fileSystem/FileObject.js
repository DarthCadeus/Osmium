class FileObject {
	constructor (config) {
		this.url = config.url;
		this.size = config.size;
		this.createdAt = config.createdAt;
		this.modifiedAt = config.modifiedAt;
		this.user = config.user;
		this.permissions = config.permit;
	}
}

FileObject.prototype.permit = function (user) {
	if(this.permissions.user) return true;
	return false;
};
