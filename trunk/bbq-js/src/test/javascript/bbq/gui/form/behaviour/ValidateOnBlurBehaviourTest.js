include(bbq.gui.form.behaviour.ValidateOnBlurBehaviour);
include(bbq.gui.form.EmailField);

test = new Test.Unit.Runner({

	testShim: function() {
		with (this) {
			var behaviour = new bbq.gui.form.behaviour.ValidateOnBlurBehaviour();
			var field = new bbq.gui.form.EmailField();

			field.addBehaviour(behaviour);

			// focus and blur field
			field.getRootNode().focus();
			field.getRootNode().blur();
			this.assertEqual(true, field.hasClass("FormField_error"));

			// try with a valid email
			field.getRootNode().focus();
			field.getRootNode().value = "foo@bar.com";
			field.getRootNode().blur();
			this.assertEqual(false, field.hasClass("FormField_error"));

			// try with an invalid email
			field.getRootNode().focus();
			field.getRootNode().value = "foo";
			field.getRootNode().blur();
			this.assertEqual(true, field.hasClass("FormField_error"));
		}
	}
});
