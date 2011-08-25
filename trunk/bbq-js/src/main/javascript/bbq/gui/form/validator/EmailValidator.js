include(bbq.util.BBQUtil);

bbq.gui.form.validator.EmailValidator = new Class.create({

	initialize: function() {

	},

	validate: function(value) {
		if(!BBQUtil.isValidEmail(value)) {
			return "email.invalid";
		}
	}
});
