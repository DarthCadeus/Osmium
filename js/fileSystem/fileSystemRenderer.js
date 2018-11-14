function render(node, target) {
	$(target).empty();
	node.forEachChild(function(x) {
		let element = $(x.renderSmall());
		if(x.bound.type != "directory") {
			$(element).draggable({
				containment: "parent"
			});
		} else {
			$(element).droppable({
				drop: function(event, ui) {
					let targ = fs.search({selfObjectId: ui.draggable.attr("objectid")});
					if(targ.length == 0) {
						console.error("no entity with the object id found");
					} else {
						if(targ.length > 1)
						console.warn("multiple entities with a single id found");
						targ[0].unBind();
						targ[0].bind(x);
						render(node, target);
					}
				}
			});
			$(element).click(function(){
				render(x, target);
			})
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
