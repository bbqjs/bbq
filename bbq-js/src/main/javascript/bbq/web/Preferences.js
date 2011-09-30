/**
 * User preferences mechanism.
 * 
 * Uses HTML5 sessionStorage where available otherwise
 * falls back to cookies.
 * 
 * <code>
 * var foo = {bar: "baz"};
 * 
 * Preferences.set("wibble", foo);
 * 
 * ... time passes ...
 * 
 * var foo = Preferences.get("wibble");
 * 
 * alert(foo.bar);
 * 
 * </code>
 */
Preferences = {
	/**
	 * Holds a Preferences implementation.  Should support three methods:
	 * 
	 * set(key:String, value:String):Void
	 * get(key:String):String
	 * del(key:String)
	 * 
	 * Value will be JSON encoded prior to being set and decocde after get.
	 */
	implementation: null,
	
	/**
	 * Pass in a value to persist under the passed key
	 */
	set: function(key, value) {
		if(value) {
			this.implementation.set(key, Object.toJSON(value));
		} else {
			this.implementation.del(key);
		}
	},
	
	/**
	 * Pass in a key to retrieve the stored value
	 */
	get: function(key) {
		var value = this.implementation.get(key);
		
		// if a string returned, decode it
		if(Object.isString(value)) {
			return value.evalJSON(true);
		}
		
		return value;
	},
	
	/**
	 * Deletes the value stored under the passed key
	 */
	del: function(key) {
		this.implementation.del(key);
	},
	
	/**
	 * Preferences implementation that uses HTML5 storage.
	 * 
	 * Used when the browser supports it.
	 */
	_sessionStorage: {
		set: function(key, value) {
			sessionStorage.setItem(key, value);
		}, 
		
		get: function(key) {
			return sessionStorage.getItem(key);
		}, 
		
		del: function(key) {
			sessionStorage.removeItem(key);
		}
	},
	
	/**
	 * Preferences implementation that uses cookie storage.
	 * 
	 * Used when the browser doesn't support HTML5.
	 */
	_cookies: {
		set: function(key, value) {
			Cookie.set(key, value);
		}, 
		
		get: function(key) {
			return Cookie.get(key);
		}, 
		
		del: function(key) {
			Cookie.del(key);
		}
	}
};

// set preferences implementation according to browser support
if(window.sessionStorage) {
	// use HTML5 session storage
	Preferences.implementation = Preferences._sessionStorage;
} else {
	// fallback to cookies
	Preferences.implementation = Preferences._cookies;
}