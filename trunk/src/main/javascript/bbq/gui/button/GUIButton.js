include(bbq.gui.GUIWidget);
include(bbq.util.BBQUtil);

/**
 * 
 * GUIButton
 * 
 * This class creates a standards compliant button that should be used in conjunction with a ButtonHolder object.  It
 * is based around the HTML list element an contains an anchor tag.
 * 
 * @class bbq.gui.button.GUIButton
 * @extends bbq.gui.GUIWidget
 * 
 */
bbq.gui.button.GUIButton = Class.create(bbq.gui.GUIWidget, {
	_index: 0,
	_anchor: null,
	disabled: false,
	buttonHolder: null,
	buttonIsDown: false,
	
	/**
	 * Constructor!
	 * 
	 * Supports the following options: 
	 * options: {
	 * 		buttonText: String,
	 * 		startDisabled: boolean,
	 * 		startDown: boolean,
	 * 		rememberDownState: boolean,
	 * 		toggleButton: boolean,
	 * 		onclick: Function,
	 * 		onmouseout: Function,
	 * 		onmouseover: Function,
	 * 		onmousedown: Function,
	 * 		onmouseup: Function
	 * }
	 * @param {mixed} options
	 */
	initialize: function($super, options) {
		$super(options);
		
		this.setRootNode("li");
		this.addClass("GUIButton");
		
		this._anchor = DOMUtil.createTextElement("a", (this.options.buttonText ? this.options.buttonText : " "), {
			href: this.options.anchor ? this.options.anchor : ".", 
			title: (this.options.toolTip ? this.options.toolTip : "")
		});
		
		this.appendChild(this._anchor);
		
		if(this.options.startDisabled) {
			this.setDisabled(true);
		} else {
			this.setDisabled(false);
		}
		
		if(this.options.startDown) {
			this.setDown(true);
		} else {
			this.setDown(false);
		}
		
		this._anchor.onclick = this.buttonClicked.bindAsEventListener(this);
		this._anchor.onmouseout = this.mouseOut.bindAsEventListener(this);
		this._anchor.onmouseover = this.mouseOver.bindAsEventListener(this);
		this._anchor.onmousedown = this.mouseDown.bindAsEventListener(this);
		this._anchor.onmouseup = this.mouseUp.bindAsEventListener(this);
	},
	
	getAnchor: function() {
		return this._anchor;
	},
	
	/**
	 * Button clicked handler function
	 * @param {Event} event
	 */
	buttonClicked: function(event) {
		if(event && this.options.onclick) {
			Event.stop(event);
		}
		
		BBQUtil.clearFocus(event);
		
		if(this._processCallback("onclick", event)) {
			if(this.buttonHolder) {
				this.buttonHolder._buttonClicked(this, event);
				this.buttonHolder.clearDown();
			}
			
			if(this.options.rememberDownState) {
				this.setDown(true);
			}
			
			if(this.options.toggleButton) {
				this.setDown(this.buttonIsDown);
			}
		}
		
		if(this.options.onclick) {
			return false;
		}
	},
	
	/**
	 * Mouse out handler function
	 * @param {Event} event
	 */
	mouseOut: function(event) {
		if(!this.disabled) {
			this.removeClass("buttonOver");
			this._processCallback("onmouseout", event);
		}
	},
	
	/**
	 * Mouse over handler function
	 * @param {Event} event
	 */
	mouseOver: function(event) {
		if(!this.disabled) {
			this.addClass("buttonOver");
			this._processCallback("onmouseover", event);
		}
	},
	
	/**
	 * Mouse down handler function
	 * @param {Event} event
	 */
	mouseDown: function(event) {
		if(!this.disabled) {
			this.addClass("buttonDown");
			this._processCallback("onmousedown", event);
		}
	},
	
	/**
	 * Mouse up handler function
	 * @param {Event} event
	 */
	mouseUp: function(event) {
		if(!this.disabled) {
			this.removeClass("buttonDown");
			this._processCallback("onmouseup", event);
		}
	},
	
	/**
	 * @private
	 * Calls any callback method if defined and the button is enabled.
	 * 
	 * @return	boolean	true if we were able to callback, false otherwise
	 * @type mixed
	 */
	_processCallback: function(callback, event) {
		try {
			if(!this.disabled && this.options[callback] && this.options[callback] instanceof Function) {
				var output = this.options[callback].call(this, event, this);
				
				this.notifyListeners(callback, event);
				
				if(typeof(output) == "undefined") {
					return true;
				}
				
				return output;
			}
		} catch(e) {
			Log.dumpException(e);
		}
		
		return false;
	},
	
	/**
	 * Down state setter
	 * @param {boolean} down
	 */
	setDown: function(down) {
		this.buttonIsDown = down;
		
		if(this.buttonIsDown) {
			if(this.buttonHolder) {
				this.buttonHolder.clearDown();
				this.buttonHolder.setSelectedIndex(this.getIndex());
			}
			
			this.addClass("buttonDown");
		} else {
			this.removeClass("buttonDown");
		}
	},
	
	/**
	 * Clears button down state
	 */
	clearDown: function() {
		this.removeClass("buttonDown");
	},
	
	/**
	 * Checks if button is down.
	 * @return {boolean}
	 */
	isDown: function() {
		return this.buttonIsDown;
	},
	
	/**
	 * Button disabled status setter
	 * @param {boolean} disabled
	 */
	setDisabled: function(disabled) {
		this.disabled = disabled;
		this[(this.disabled ? "add" : "remove") + "Class"]("buttonDisabled");
		this[(this.disabled ? "remove" : "add") + "Class"]("buttonEnabled");
	},
	
	isDisabled: function() {
		return this.disabled;
	},
	
	/**
	 * sets the function to call on click event
	 * @param {Function} callback
	 */
	setOnClick: function(callback) {
		this.options["onclick"] = callback;
	},
	
	/**
	 * Button index getter.
	 * @return {integer}
	 */
	getIndex: function() {
		return this._index;
	},
	
	/**
	 * Button index setter
	 * @param {integer} index
	 */
	setIndex: function(index) {
		this._index = index;
	},
	
	setText: function(text) {
		DOMUtil.emptyNode(this._anchor);
		this.anchor.appendChild(document.createTextNode(text));
	}
});
