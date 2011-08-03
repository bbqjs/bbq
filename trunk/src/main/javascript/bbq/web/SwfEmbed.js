include(bbq.gui.GUIWidget);
include(bbq.gui.error.NoFlash);
include(bbq.util.BBQUtil);

/**
 * Uses the SWFObject library to wrapper an embedded flash movie.
 * @class bbq.web.SwfEmbed
 * @extends bbq.gui.GUIWidget 
 */
bbq.web.SwfEmbed = new Class.create(bbq.gui.GUIWidget, {
	// unique identifier used by the movie to call methods on us
	_id: null,
	_hasLoaded: false,

	/**
	 * @param {Object} options
	 * @example
	 * Supports the following options:
	 * 
	 * options {
	 * 		swf: string							// Path to the flash movie
	 * 		attributes: Object,				// Attributes to set on the Object node
	 * 		variables: {						// Variables to pass to the movie in key: value pairs
	 * 			key: value,
	 * 			...
	 * 		},
	 * 		nocache: boolean				// Whether or not to append a cache buster
	 *		wmode: string					// Specify the wmode to use
	 * }
	 * 
	 * Supports the following events:
	 * 
	 * onLoad
	 */
	initialize: function($super, options) {
		$super(options);
		
		this._id = BBQUtil.generateGUID().replace(/-/g, "");

		bbq.web.SwfEmbed.instances[this._id] = this;
		
		if(options.nocache) {
			options.swf += "?nocache=" + BBQUtil.generateGUID();
		}
		
		this.setRootNode(DOMUtil.createElement("object", this.options.attributes));
		this.getRootNode().id = this._id;

		if(Browser.InternetExplorer) {
			this.getRootNode().classid = "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000";
			this.getRootNode().appendChild(DOMUtil.createElement("param", {name: "movie", value: this.options.swf}));
		} else {
			this.getRootNode().type = "application/x-shockwave-flash";
			this.getRootNode().data = this.options.swf;
		}

		this._addParams(this.getRootNode());
		this._addVars(this.getRootNode());
	},

	loaded: function() {
		return this._hasLoaded;
	},
	
	/**
	 * @param {Node} node
	 */
	render: function() {
		if(!Browser.Flash) {
			var errorNotification = new bbq.gui.error.NoFlash();
			errorNotification.appear();
			
			return;
		}
	},
	
	_addParams: function(toNode) {
		var params = {};
		params["allowScriptAccess"] = "always";
		params["swliveconnect"] = "true";
		
		if(this.options.wmode) {
			params["wmode"] = this.options.wmode;
		}
		
		for(var key in params) {
			toNode.appendChild(DOMUtil.createElement("param", {name: key, value: params[key]}));
		}
	},
	
	_addVars: function(toNode) {
		var flashVars = {};
		
		if(this.options.variables instanceof Object) {
			//Log.info("Setting flashVars on SWFObject");
			for(var key in this.options.variables) {
				flashVars[key] = this.options.variables[key];
			}
		}
		
		// pass pageObject id to Flash movie so it can call methods on us
		var tag = DOMUtil.createElement("param", {name: "FlashVars", value: "pageObject=" + this._id});
		
		for(var key in flashVars) {
			tag.value += "&" + key + "=" + encodeURIComponent(flashVars[key]);
		}
		
		toNode.appendChild(tag);
	},
	
	/**
	 * @private
	 */
	_loaded: function() {
		//Log.info("Getting flash object from DOM with ID " + this.options.swf.id);
		
		if(!this._hasLoaded) {
			if($(this._id)) {
				this._hasLoaded = true;
				//Log.info("notifying onLoad listeners");
				this.notifyListeners("onLoad");
			} else {
				//Log.info("DOM node not loaded yet");
				setTimeout(this._loaded.bind(this), 500);
			}
		}
	},
	
	/**
	 * @param {string} methodName
	 * @param {Object} args
	 */
	callFlashFunction: function(methodName, args) {
		//Log.info("Calling flash function " + methodName + " with args " + Object.toJSON(args));
		
		if(this.rootNode[methodName]) {
			//Log.info("Found method " + methodName + " on Flash object - " + typeof(this._flashObject[methodName]));
			if(args) {
				return this.rootNode[methodName](args);
			}
			
			return this.rootNode[methodName]();
		}
		
		Log.warn("Could not find method " + methodName + " on Flash object");
	}
});

bbq.web.SwfEmbed.instances = {};
