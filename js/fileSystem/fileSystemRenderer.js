function render(node, target) {
	$(target).empty();
	node.forEachChild(function(x) {
		let element = $(x.renderSmall());
		if(x.bound.type != "directory") {
			$(element).draggable();
		} else {
			$(element).droppable({
				drop: function(event, ui) {
					alert("dropped!");
				}
			});
		}
		$(target).append(element);
	})
}

$(function(){
	FileEntity.prototype.renderSmall = function () {
		const source = document.getElementById("file-entity-template-short").innerHTML;
		const template = Handlebars.compile(source);
		const context = {
			entity: this
		};
		let element = template(context);
		return element;
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
