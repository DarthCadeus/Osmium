const DIRECTORY = "directory";
const ROOT = ".";
const TRASH = "t."

class FileEntity {
	constructor(name, type, parent, bound) {
		this.name = name;
		this.type = type;
		this.parent = parent;
		parent.children.push(this);
		this.index = parent.children.length - 1;
		this.children = [];
		this.bound = bound;
	}
}

FileEntity.prototype.isdir = function() {
	return this.type == DIRECTORY;
};

FileEntity.prototype.forEachChild = function(f) {
	for(let i = 0; i < this.children.length; i ++) {
		f(this.children[i]);
	}
};

FileEntity.prototype.unBind = function() {
	parent.children.pop(this.index);
	this.index = undefined;
	this.parent = undefined;
	return this;
};

FileEntity.prototype.bind = function(parent) {
	this.parent = parent;
	parent.children.push(this);
	this.index = parent.children.length - 1;
	return this;
};

FileEntity.prototype.getPath = function() {
	return this.parent.getPath() + "/" + this.name;
}

class FileSystem {
	constructor() {
		this.originNode = {
			name: ROOT,
			type: DIRECTORY,
			children: [],
			forEachChild: FileEntity.prototype.forEachChild,
			getPath: () => {ROOT}
		}  // bypass the parent restrictions
		this.trashNode = {
			name: TRASH,
			type: DIRECTORY,
			children: [],
			forEachChild: FileEntity.prototype.forEachChild,
			getPath: () => {TRASH}
		}  // bypass the parent restrictions
	}
}

FileSystem.prototype.addFile = function(name, type, parent) {
	return new FileEntity(name, type, parent);
};

FileSystem.prototype.removeFile = function(name, parent) {
	let removed = false;
	parent.forEachChild(function(x) {
		if(x.name == name) {
			x.bind(this.trashNode);
			removed = true;
		}
	});
	return removed;
};

FileSystem.prototype.forEachChild = function(f) {
	this.originNode.forEachChild(f);
}

let fs = new FileSystem();
