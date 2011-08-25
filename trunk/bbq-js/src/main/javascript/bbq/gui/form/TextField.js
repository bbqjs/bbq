include(bbq.gui.form.FormField);
include(bbq.web.Browser);

/**
 * Supports the following options:
 *
 * options: {
 *      value: String                   // initial value
 * }
 */
bbq.gui.form.TextField = new Class.create(bbq.gui.form.FormField, {
	initialize: function($super, args) {
		try {
			$super(args);

			this.setRootNode("input");
			this.addClass("TextField");

			if(this.options.value) {
				this.getRootNode().value = this.options.value;
			}
		} catch(e) {
			Log.error("Error constructing TextField", e);
		}
	}
});
