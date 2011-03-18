include(bbq.gui.GUIWidget);
include(bbq.gui.error.NoFlash);
include(bbq.util.BBQUtil);

/**
 * Uses the SWFObject library to wrapper an embedded flash movie.
 * @class bbq.web.FlashEmbed
 * @extends bbq.gui.GUIWidget 
 */
bbq.web.FlashEmbed = new Class.create(bbq.gui.GUIWidget, {
	
	_flashObject: null,
	
	/**
	 * @param {Object} options
	 * @example
	 * Supports the following options:
	 * 
	 * options {
	 * 		swf: {
	 * 			path: string,					// Path to the flash movie
	 * 			id: string,						// The ID of the flash movie node - this must be specified
	 * 			width: int,						// Width of the flash movie
	 * 			height: int,						// Height of the flash movie
	 * 			flashVars: {					// Variables to pass to the movie in key: value pairs
	 * 				key: value,
	 * 				...
	 * 			}
	 * 		}
	 * 		
	 * }
	 * 
	 * Supports the following events:
	 * 
	 * onLoad
	 */
	initialize: function($super, options) {
		$super(options);
		
		if(Object.isUndefined(this.options.swf)) {
			this.options.swf = {};
		}
		
		if(Object.isUndefined(this.options.swf.flashVars)) {
			this.options.swf.flashVars = {};
		}
		
		if(!this.options.swf.id) {
			this.options.swf.id = BBQUtil.generateGUID().replace(/-/g, "");
		}
		
		this.options.swf.id += "_" + BBQUtil.generateGUID().replace(/-/g, "");
		
		if(typeof(bbq.web.FlashEmbed.instances[this.options.swf.id]) != "undefined") {
			Log.warn("Duplicate flash movie in page");
		}
		
		bbq.web.FlashEmbed.instances[this.options.swf.id] = this;
		
		this._flashObject = false;
		
		if(options.swf.path.search(/\?/) == -1) {
			options.swf.path += "?nocache=" + BBQUtil.generateGUID();
		} else {
			options.swf.path += "&nocache=" + BBQUtil.generateGUID();
		}
	},
	
	loaded: function() {
		return this._flashObject ? true : false;
	},
	
	/**
	 * @param {Node} node
	 */
	appendTo: function(node) {
		var so = new SWFObject(this.options.swf.path, this.options.swf.id, this.options.swf.width, this.options.swf.height, this.options.swf.version ? this.options.swf.version : 9);
		so.addParam("allowScriptAccess", "always");
		so.addParam("swliveconnect", "true");
		
		if(this.options.transparent) {
			so.addParam("wmode", "transparent");
		}
		
		if(this.options.swf.flashVars instanceof Object) {
			//Log.info("Setting flashVars on SWFObject");
			for(var key in this.options.swf.flashVars) {
				so.addVariable(key, this.options.swf.flashVars[key]);
			}
		}
		
		// pass pageObject id to Flash movie so it can call methods on us
		so.addVariable("pageObject", this.options.swf.id);
		
		var div = DOMUtil.createElement("div");
		so.write(div);
		
		// if there are no children of the div, this normally means Flash is not installed - prompt the user to install it
		if(!div.firstChild) {
			var errorNotification = new bbq.gui.error.NoFlash();
			errorNotification.appear();
		} else {
			node.appendChild(div.firstChild);
			
			this.rootNode = div.firstChild;
		}
	},
	
	/**
	 * @private
	 */
	_loaded: function() {
		//Log.info("Getting flash object from DOM with ID " + this.options.swf.id);
		
		if(!this._flashObject) {
			if($(this.options.swf.id)) {
				this._flashObject = $(this.options.swf.id);
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
		
		if(!this._flashObject) {
			Log.warn("method call on flashObject that does not exist (" + methodName + ")");
			
			if($(this.options.swf.id)) {
				Log.warn("Flash object is in the page though");
				this._flashObject = $(this.options.swf.id);
			}
		}
		
		if(this._flashObject[methodName]) {
			//Log.info("Found method " + methodName + " on Flash object - " + typeof(this._flashObject[methodName]));
			if(args) {
				return this._flashObject[methodName](args);
			}
			
			return this._flashObject[methodName]();
		}
		
		Log.warn("Could not find method " + methodName + " on Flash object");
	},
	
	getOption: function(key) {
		return this.options[key];
	}
});

bbq.web.FlashEmbed.instances = {};
