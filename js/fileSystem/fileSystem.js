const DIRECTORY = "directory";
const ROOT = ".";
const TRASH = "t."

class FileEntity {
	constructor(name, parent, bound) {
		this.name = name;
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
	let collected_returns = [];
	for(let i = 0; i < this.children.length; i ++) {
		collected_returns.push(f(this.children[i]));
	}
	return collected_returns;
};

FileEntity.prototype.unBind = function() {
	this.parent.children.splice(this.index, 1);
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


FileEntity.prototype.match = function(criteria) {
	if (!criteria) {
		return false;
	}
	let objectid_matched = true;  // defaults to true because of return mechanism
	let name_matched = true;
	let type_matched = true;
	if (criteria.selfObjectId) {
		if(this.bound.selfObjectId != criteria.selfObjectId) {
			objectid_matched = false;
		}
	}
	if (criteria.name) {
		if(this.name != criteria.name) {
			name_matched = false;
		}
	}
	if (criteria.type) {
		if(this.bound.type != criteria.type) {
			type_matched = false;
		}
	}
	return objectid_matched && name_matched && type_matched;
}

FileEntity.prototype.search = function (criteria) {
	let searchRes = [];
	this.forEachChild(function(c) {
		if (c.match(criteria)) {
			searchRes.push(c);
		}
		let curSearchRes = c.search(criteria);
		if (curSearchRes != []) {
			searchRes = join(curSearchRes, searchRes);
		}
	});
	return searchRes;
}


class FileSystem {
	constructor() {
		this.originNode = {
			name: ROOT,
			type: DIRECTORY,
			children: [],
			forEachChild: FileEntity.prototype.forEachChild,
			getPath: () => {ROOT},
			search: FileEntity.prototype.search
		}  // bypass the parent restrictions
		this.trashNode = {
			name: TRASH,
			type: DIRECTORY,
			children: [],
			forEachChild: FileEntity.prototype.forEachChild,
			getPath: () => {TRASH},
			search: FileEntity.prototype.search
		}  // bypass the parent restrictions
	}
}

FileSystem.prototype.addFile = function(name, parent, bound) {
	return new FileEntity(name, parent, bound);
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

FileSystem.prototype.search = function(criteria) {
	return this.originNode.search(criteria);
}

let fs = new FileSystem();
