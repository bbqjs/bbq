include(bbq.gui.error.NotLoggedIn);
include(bbq.gui.error.ServerError);
include(bbq.util.BBQUtil);

/**
 * Wrapper for Prototype Ajax class.
 * 
 * Adds extras such as an independent server timeout and error handling
 * @class bbq.ajax.AJAXRequest
 * 
 */
bbq.ajax.AJAXRequest = Class.create({
	onSuccess: null,
	onFailure: null,
	onException: null,
	onComplete: null,
	timeOut: null,
	interval: null,
	url: null,
	options: null,
	
	/**
	 * Constructor
	 * 
	 * @param	{Object} options	The URL to send the request to
	 * 
	 * @example
	 * Supports the following options:
	 * options {
	 * 		url:	String						// where to send the request to
	 * 		method: String						// post or get
	 * 		args: Object						// key->value pairs to convert to query string
	 * 		onsuccess: Function
	 * 		onfaliure: Function
	 * 		onexception: Function
	 * }
	 */
	initialize: function(options) {
		this.options = options;
		
		if(!this.options.method) {
			this.options.method = "post";
		}
		
		if(!this.options.args) {
			this.options.args = {};
		}
		
		if(!this.options.headers) {
			this.options.headers = {};
		}
		
		this.sendRequest();
	},
	
	getPostBody: function() {
		return this.options.postBody;
	},
	
	/**
	 * Sends the request via the specified method
	 * 
	 * @return	void
	 */
	sendRequest: function() {
		try {
			var requestHeaders = this._createRequestHeaders();
			
			for(var key in requestHeaders) {
				this.options.headers[key] = requestHeaders[key];
			}
			
			var request = new Ajax.Request(this.options.url, {
				method: this.options.method, 
				postBody: this.getPostBody(),
				onSuccess: this.onSuccess.bind(this), 
				onFailure: this.onFailure.bind(this), 
				onExcepton: this.onException.bind(this),
				requestHeaders: this.options.headers,
				contentType: this.options.contentType
			});
			
			if(typeof(firebug) != "undefined" && firebug.watchXHR instanceof Function) {
				// enable firebug lite to watch the ajax call status
				request.transport._name = this.options.method.toUpperCase() + ' ' + this.options.url;
				firebug.watchXHR(request.transport);
			}
			
			// get time out data from server configuration
			if(typeof(ServerConfig) != "undefined" && ServerConfig["timeout"]) {
				this.timeOut = ServerConfig["timeout"];
			} else {
				this.timeOut = 30;
			}
			
			// check timeout every second
			this.interval = setInterval(this.checkTimeOut.bind(this), 1000);
			
			if(typeof(NotificationArea) != "undefined") {
				NotificationArea.startLoad();
			}
		} catch(e) {
			Log.dumpException(e);
		}
	},
	
	_createRequestHeaders: function() {
		return {
			
		};
	},
	
	/**
	 * @access	protected
	 * @param {String} handlerName
	 * @param {Object} args
	 */
	_callHandler: function(handlerName, args) {
		try {
			if(typeof(NotificationArea) != "undefined") {
				NotificationArea.stopLoad();
			}
			
			clearInterval(this.interval);
			
			if(this.options[handlerName] && this.options[handlerName] instanceof Function) {
				this.options[handlerName].apply(this, args);
			} else if(this.options["onAnything"] && this.options["onAnything"] instanceof Function) {
				this.options["onAnything"].apply(this, args);
			}
		} catch(e) {
			Log.dumpException(e);
		}
	},
	
	/**
	 * @param {Object} serverResponse
	 */
	onSuccess: function(serverResponse) {
		try {
			var responseType = serverResponse.getResponseHeader("X-bbq-responseType");
			var code = "error" + responseType;
			var handler = bbq.ajax.AJAXRequest.errorHandlers[code];
			
			if(handler && handler instanceof Function) {
				handler.call(this, this, serverResponse);
			} else {
				this._callHandler("onSuccess", $A(arguments));
			}
		} catch(e) {
			Log.dumpException(e);
		}
	},
	
	onFailure: function() {
		try {
			Log.error('Request to ' + this.options.method.toUpperCase() + ' ' + this.options.url + " failed");
			this._callHandler("onFaliure", $A(arguments));
		} catch(e) {
			Log.dumpException(e);
		}
	},
	
	onException: function() {
		try {
			Log.error('Request to ' + this.options.method.toUpperCase() + ' ' + this.options.url + " threw exception");
			this._callHandler("onException", $A(arguments));
		} catch(e) {
			Log.dumpException(e);
		}
	},
	
	/**
	 * Checks to see if the timer has reached 0.  If so the server request has timed out.
	 * 
	 * @return	void
	 */
	checkTimeOut: function() {
		if(this.timeOut == 0) {
			this.timedOut();
			clearInterval(this.interval);
		} else {
			this.timeOut--;
		}
	},
	
	/**
	 * Shows the user a warning
	 * 
	 * @return	void
	 */
	timedOut: function() {
		Log.warn("Ajax call to " + this.options.url + " timed out");
		
		if(typeof(NotificationArea) != "undefined" && typeof(Language) != "undefined" && Language.get instanceof Function) {
			NotificationArea.stopLoad();
			NotificationArea.setMessage(
				Language.get("bbq.ajax.AJAXRequest.ajaxtimeoutheader"), 
				Language.get("bbq.ajax.AJAXRequest.ajaxtimeoutmessage"), 
				"error"
			);
			NotificationArea.setMessage(
				Language.get("bbq.ajax.AJAXRequest.reloadpageheader"), 
				Language.get("bbq.ajax.AJAXRequest.reloadpagemessage"), 
				"error"
			);
		}
	}
});

/**
 * Add custom error handlers to this map.  Error handlers should
 * be a function with the following signature:
 * 
 * <code>
 * function(bbq.ajax.AJAXRequest, serverResponse);
 * </code>
 */
bbq.ajax.AJAXRequest.errorHandlers = [];
bbq.ajax.AJAXRequest.errorHandlers["error-100"] = function(request, response) {
	var errorMessage = new bbq.gui.error.ServerError({
		url: request.options.url,
		args: request.options.args,
		serverResponse: BBQUtil.urlDecode(serverResponse.getResponseHeader("X-bbq-responseMessage"))
	});
	errorMessage.appear();
};
bbq.ajax.AJAXRequest.errorHandlers["error-99"] = function(request, response) {
	var errorMessage = new bbq.gui.error.NotLoggedIn();
	errorMessage.appear();
};