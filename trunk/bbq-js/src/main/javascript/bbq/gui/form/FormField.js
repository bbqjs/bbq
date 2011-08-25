include(bbq.gui.GUIWidget);
include(bbq.util.Log);

/**
 * Supports the following options:
 *
 * options: {
 *      validateOnBlur: boolean
 * }
 *
 * Dispatches the following notifications:
 *
 * onError
 */
bbq.gui.form.FormField = new Class.create(bbq.gui.GUIWidget, {
	_behaviours: null,
	_preTransformValidators: null,
	_postTransformValidators: null,
	_transformer: null,

	initialize: function($super, args) {
		try {
			$super(args);

			this._behaviours = [];
			this._preTransformValidators = [];
			this._postTransformValidators = [];

			this.setRootNode("input");
			this.addClass("FormField");
		} catch(e) {
			Log.error("Error constructing FormField", e);
		}
	},

	/**
	 * Returns the value contained within this field.
	 */
	getValue: function() {
		this.removeClass("FormField_error");

		var value = this.getRootNode().value;

		// run pre-transform validators
		this._preTransformValidators.each(function(validator) {
			var result = validator.validate(value);

			if(result) {
				this.addClass("FormField_error");

				throw {error: result, field: this};
			}
		}.bind(this));

		// if we have a value transformer, transform the value
		if (this._transformer) {
			value = this._transformer.transform(value);
		}

		// run post transform validators
		this._postTransformValidators.each(function(validator) {
			var result = validator.validate(value);

			if (result) {
				this.addClass("FormField_error");

				throw {error: result, field: this};
			}
		}.bind(this));

		// return our value
		return value;
	},

	addValidator: function(validator) {
		if(!validator) {
			Log.error("Invalid validator!");

			return;
		}

		if(!validator.validate) {
			Log.error("Validator should implement a validate method");

			return;
		}

		if (validator.isPostTransformValidator && validator.isPostTransformValidator()) {
			this._postTransformValidators.push(validator);
		} else {
			this._preTransformValidators.push(validator);
		}
	},

	addBehaviour: function(behaviour) {
		if (!behaviour) {
			Log.error("Invalid behaviour!");
		}

		if (!behaviour.setField) {
			Log.error("Behaviour should implement a setField method");

			return;
		}

		behaviour.setField(this);

		this._behaviours.push(behaviour);
	},

	setValueTransformer: function(transformer) {
		if (!transformer) {
			Log.error("Invalid transformer!");
		}

		if (!transformer.transform) {
			Log.error("Transformer should implement a transform method");

			return;
		}
		
		this._transformer = transformer;
	}
});
