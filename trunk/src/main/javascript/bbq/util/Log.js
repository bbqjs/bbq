/** Log utility object */
var Log = {
	_logIt: function(message, type, nodate) {
		if(typeof(nodate) == "undefined") {
			var date = new Date();
			message = Log.padNumber(date.getHours()) + ":" + Log.padNumber(date.getMinutes()) + ":" + Log.padNumber(date.getSeconds()) + " - " + message;
		}
		
		if(typeof(window['console']) != "undefined") {
			if(console[type]) { // firebug
				console[type](message);
			} else if(console.log) { // generic console (Firefox, Safari)
				console.log(message);
			}
		}/* else {
			try {
				if(typeof(Log["IEDebugWindow"]) == "undefined") {
					Log.IEDebugWindow = Log.openIEDebugWindow();
					window.blur();
				}
				
				var output = Log.IEDebugWindow.document.getElementById("outputlog");
				
				var messagePara = Log.IEDebugWindow.document.createElement("p");
				messagePara.className = type;
				messagePara.appendChild(Log.IEDebugWindow.document.createTextNode(message));
				
				output.appendChild(messagePara);

			} catch(e) {
				
			}
		}*/
	},
	
	openIEDebugWindow: function() {
		var windowRef = window.top.debugWindow = window.open("", "Debug", "left=0,top=0,width=500,height=400,scrollbars=yes,status=yes,resizable=yes");
		windowRef.opener = self;
		windowRef.document.open();
		windowRef.document.write('<html><head><title>debug window</title><style type="text/css">body {margin: 0;} p {margin: 0; padding: 5px; border-bottom: 1px solid #BEBEBE; font: x-small Arial, Verdana; white-space: nowrap} p.debug {} p.error { color: #F00; background-color: #FFFFE0; } p.info { color: #03F; } p.warn { background-color: #0FF }</style></head><body><div id="outputlog"></div></body></html>');
		
		return windowRef;
	},

	debug: function(message) {
		Log._logIt(message, "debug");
	},

	info: function(message) {
		Log._logIt(message, "info");
	},

	warn: function(message) {
		Log._logIt(message, "warn");
	},

	error: function(message) {
		Log._logIt(message, "error");
	},
	
	dumpObject: function(object) {
		if(Object.isString(object)) {
			Log.info(object);
		} else {
			Log._logIt(object, "dir", true);
		}
	},
	
	/**
	 * Removes lines referencing prototype.js and anonymous closures from stack traces to make the output
	 * a bit more readable.  This of course makes the assumption that prototype.js is perfect.
	 * 
	 * @param	{Exception}	e								An exception object
	 * @param	{boolean}		doNotReplace		Pass true if you don't want the extra lines to be removed
	 */
	dumpException: function(e, doNotReplace) {
		if(typeof(e) == "string") {
			Log.error(e);
			return;
		}
		
		for(var key in e) {
			try {
				if(!doNotReplace && e[key].replace) {
					e[key] = e[key].replace(/^[apply|call](.)*$/gm, "");
					e[key] = e[key].replace(/^(.)*prototype\.js(.)*$/gm, "");
				}
				
				Log.error(key + " = " + e[key]);
			} catch(e) {
				
			}
		}
	},
	
	padNumber: function(number) {
		if(number < 10) {
			number = "0" + number;
		}
	
		return number;
	}
}