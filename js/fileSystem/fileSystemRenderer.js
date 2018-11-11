function render(node, target) {
	$(target).empty();
	node.forEachChild(function(x) {
		$(target).append(x.renderSmall());
	})
}

$(function(){
	FileEntity.prototype.renderSmall = function () {
		const source = document.getElementById("file-entity-template-short").innerHTML;
		const template = Handlebars.compile(source);
		const context = {
			entity: this
		};
		return template(context);
	}

	FileEntity.prototype.renderMeta = function () {
		const source = document.getElementById("file-entity-template-metadata").innerHTML;
		const template = Handlebars.compile(source);
		const context = {
			entity: this,
			path: this.getPath(),
			permission: this.bound.permit(SYSENV.curUser)
		};
		return template(context);
	}
});
