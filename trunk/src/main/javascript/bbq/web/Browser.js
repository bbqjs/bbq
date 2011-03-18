/**
 * @class Browser
 * @constructor
 */
Browser = {
	InternetExplorer: false,
	Opera: false,
	Safari: false,
	Mozilla: false,
	Ajax: false,
	DOM: false,
	version: 0,
	
	/** find out which broswer we are running */
	detect: function() {
		
		if(window.opera) {
			Browser.Opera = true;
			
			if(window.XMLHttpRequest) {
				Browser.version = 8;
			} else if(document.getElementById) {
				Browser.version = 7;
			}
		} else if((document.childNodes) && (!document.all) && (!navigator.taintEnabled) && (!navigator.accentColorName)) {
			Browser.Safari = true;
			
			if(window.devicePixelRatio) {
				Browser.version = 3;
			} else {
				Browser.version = 2; // probably
			}
		} else if(document.getElementById && !document.all) {
			Browser.Mozilla = true;
			
			if(navigator.registerProtocolHandler) {
				Browser.version = 3;
			} else if(window.Iterator) {
				Browser.version = 2;
			} else if(Array.every) {
				Browser.version = 1.5;
			} else if(window.getComputedStyle) {
				Browser.version = 1;
			}
		} else if(document.getElementById && document.all) {
			Browser.InternetExplorer = true;
			
			if(document.querySelectorAll) {
				Browser.version = 8;
			} else if(window.XMLHttpRequest) {
				Browser.version = 7;
			} else if(document.compatMode && document.all) {
				Browser.version = 6;
			} else if(window.createPopup) {
				Browser.version = 5.5;
			} else if(window.attachEvent) {
				Browser.version = 5;
			} else if(document.all) {
				Browser.version = 4;
			}
		}
		
		// does it support AJAX
		if(window.XMLHttpRequest) {
			Browser.Ajax = true;
		} else if(window.ActiveXObject) {
			try {
				requestObject=new ActiveXObject("Msxml2.XMLHTTP");
				this.Ajax = true;
			} catch (e) {
				try {
					requestObject=new ActiveXObject("Microsoft.XMLHTTP");
					Browser.Ajax = true;
				} catch (oc) {}
			}
		}
		
		// how about the DOM
		if(document.getElementById && $$("body")[0].appendChild) {
			Browser.DOM = true;
		}
		
		DOMUtil.addClass(document.body, Browser.getBrowserName());
	},
	/** get the browser name */
	getBrowserName: function() {
		if(Browser.InternetExplorer) {
			return "Internet Explorer";
		} else if(Browser.Opera) {
			return "Opera";
		} else if(Browser.Safari) {
			return "Safari";
		} else if(Browser.Mozilla) {
			return "Mozilla";
		}
		
		return "No idea";
	}
}