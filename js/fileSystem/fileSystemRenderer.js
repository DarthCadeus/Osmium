let renderRegister = {
	registered: [],
	register: function (f) {
		this.registered.push(f);
	}
}

function render(node, target) {
	$(target).empty();
	node.forEachChild(function(x) {
		let element = $(x.renderSmall());
		$(element).draggable({
			containment: "parent"
		});
		if(x.bound.type == "directory") {
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

						let sourceObject = targ[0].bound.source;
						sourceObject.parent = {
							selfObjectId: x.bound.selfObjectId
						};

						console.log(sourceObject);
						let f = AV.Object.createWithoutData('FileManager', targ[0].bound.selfObjectId);
						f.set("FileObject", sourceObject);
						f.save().catch(function(err){
							console.error(err);
						});

					}
				}
			});
			$(element).click(function(){
				CUR_DIR = x;
				render(x, target);
			})
		}
		$(target).append(element);
		let collectedReturns = [];
		for(let func of renderRegister.registered) {
			collectedReturns.push(func());
		}
		return collectedReturns;
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
