include(bbq.ajax.AJAXRequest);
include(bbq.gui.error.ServerError);

/**
 * Supports the following options {
 *		doNotEscapeArgs: boolean		// if true, passed args will not be escaped
 * }
 *
 * @class bbq.ajax.JSONRequest is a subclass of bbq.ajax.AJAXRequest
 * @extends bbq.ajax.AJAXRequest
 */
bbq.ajax.JSONRequest = Class.create(bbq.ajax.AJAXRequest, {
	
	initialize: function($super, options) {
		// override content type
		options.contentType = "application/json";
		
		$super(options);
	},
	
	/**
	 * @param	{String}		handlerName
	 * @param	{Object}		args
	 */
	_callHandler: function($super, handlerName, args) {
		var serverResponse = args[0];
		var json = {};
		
		try {
			if(serverResponse.responseText != "") {
				json = serverResponse.responseText.evalJSON(true);
				this._descapeResponse(json);
			}
		} catch(e) {
			Log.error("Error de-escaping JSON", e);
		}
		
		$super(handlerName, [serverResponse, json]);
	},
	
	/**
	 * Pre-encodes passed parameters so that encodeURI does not fall over deep within Prototype
	 * 
	 * @param {Object} args The arguments to encode
	 * 
	 * @return void
	 */
	_escapeArguments: function(args) {
		if(!args || Object.isFunction(args) || Object.isNumber(args)) {
			return;
		}
		
		if(Object.isArray(args)) {
			for(var i = 0; i < args.length; i++) {
				if(Object.isString(args[i])) {
					args[i] = encodeURIComponent(args[i]);
				} else {
					this._escapeArguments(args[i]);
				}
			}
		} else if(Object.isHash(args)) {
			args.keys().each(function(key) {
				if(Object.isString(args.get(key))) {
					args.set(key, encodeURIComponent(args.get(key)));
				} else {
					this._escapeArguments(args.get(key));
				}
			}.bind(this));
		} else {
			for(var key in args) {
				if(Object.isString(args[key])) {
					args[key] = encodeURIComponent(args[key]);
				} else {
					this._escapeArguments(args[key]);
				}
			}
		}
	},
	
	_descapeResponse: function(args) {
		if(!args || Object.isFunction(args) || Object.isNumber(args)) {
			return;
		}
		
		if(Object.isArray(args)) {
			for(var i = 0; i < args.length; i++) {
				if(Object.isString(args[i])) {
					args[i] = unescape(args[i]);
				} else {
					this._descapeResponse(args[i]);
				}
			}
		} else if(Object.isHash(args)) {
			args.keys().each(function(key) {
				if(Object.isString(args.get(key))) {
					args.set(key, unescape(args.get(key)));
				} else {
					this._descapeResponse(args.get(key));
				}
			}.bind(this));
		} else {
			for(var key in args) {
				if(Object.isString(args[key])) {
					args[key] = unescape(args[key]);
				} else {
					this._descapeResponse(args[key]);
				}
			}
		}
	},
	
	_getPostBody: function() {
		if(!this.options.doNotEscapeArgs) {
			this._escapeArguments(this.options.args);
		}
		
		return Object.toJSON(this.options.args);
	},
	
	_createRequestHeaders: function() {
		return {
			"Accept": "application/json;charset=UTF-8"
		};
	}
});
