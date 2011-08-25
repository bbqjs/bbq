include(bbq.gui.form.FormField);
include(bbq.gui.form.transformer.BooleanValueTransformer);

bbq.gui.form.CheckBoxField = new Class.create(bbq.gui.form.FormField, {
	initialize: function($super, args) {
		try {
			$super(args);

			this.setAttribute("type", "checkbox");
			this.setValueTransformer(new bbq.gui.form.transformer.BooleanValueTransformer());
		} catch(e) {
			Log.error("Error constructing CheckBoxField", e);
		}
	}
});
