include(bbq.gui.form.FormField);

/**
 * Supports the following options:
 *
 * options: {
 *      options: [
 *          key: String
 *          value: Object
 *      ]
 * }
 */
bbq.gui.form.DropDown = new Class.create(bbq.gui.form.FormField, {
	initialize: function($super, args) {
		try {
			$super(args);

			this.setRootNode("select");
			this.addClass("DropDown");

			if (this.options.value) {
				this.getRootNode().value = this.options.value;
			}

			if(Object.isArray(this.options.options)) {
				this.options.options.each(function(option, index) {
					this.appendChild(DOMUtil.createElement("option", option.key, {value: index}));
				}.bind(this));
			}
		} catch(e) {
			Log.error("Error constructing TextField", e);
		}
	},

	_getRawValue: function() {
		var index = this.getRootNode().value;

		return this.options.options[index].value;
	}
});
