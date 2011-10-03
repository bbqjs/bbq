include(bbq.gui.form.FormField);
include(bbq.gui.form.transformer.BooleanValueTransformer);

bbq.gui.form.CheckBox = new Class.create(bbq.gui.form.FormField, {
	initialize: function($super, args) {
		try {
			$super(args);

			this.addClass("CheckBox");
			this.setAttribute("type", "checkbox");
			this.setValueTransformer(new bbq.gui.form.transformer.BooleanValueTransformer());
		} catch(e) {
			Log.error("Error constructing CheckBoxField", e);
		}
	},

	_setRawValue: function(value) {
		return this.getRootNode().checked = value ? true : false;
	}
});
