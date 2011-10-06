include(bbq.gui.GUIWidget);
include(bbq.util.Log);

/**
 * Supports the following options:
 *
 * options: {
 *      value:  Object      // an initial value
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

			if(!Object.isUndefined(this.options.value)) {
				this.setValue(this.options.value);
			}

			if(this.options.onChange) {
				this.registerListener("onChange", this.options.onChange);
			}
		} catch(e) {
			Log.error("Error constructing FormField", e);
		}
	},

	setRootNode: function($super, rootNode) {
		$super(rootNode);

		this.getRootNode().onchange = this._dispatchEvent.bind(this, "onChange");
	},

	_getRawValue: function() {
		return this.getRootNode().value;
	},

	_setRawValue: function(value) {
		return this.getRootNode().value = value;
	},

	_dispatchEvent: function(event) {
		this.notifyListeners(event);
	},

	/**
	 * Returns the value contained within this field.
	 */
	getValue: function() {
		var value = this._getRawValue();

		return this._validateAndTransform(value);
	},

	_validateAndTransform: function(value) {
		this.removeClass("FormField_error");

		var error = null;

		// run pre-transform validators
		this._preTransformValidators.each(function(validator) {
			var result = validator.validate(value);

			if(result) {
				error = {error: result, field: this};

				this.addClass("FormField_error");
				this.notifyListeners("onError", error);

				throw error;
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
				error = {error: result, field: this};

				this.addClass("FormField_error");
				this.notifyListeners("onError", error);

				throw error;
			}
		}.bind(this));

		// return our value
		return value;
	},

	setValue: function(value) {
		this._setRawValue(value);

		this._validateAndTransform(value);
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
