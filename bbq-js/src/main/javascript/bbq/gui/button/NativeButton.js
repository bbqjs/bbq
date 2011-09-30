include(bbq.gui.button.GUIButton);

/** 
 * 
 * NativeButton
 * 
 * This class is similar to the GUIButton class but uses a standard browser submit input button as its
 * base. It supports the following options:
 * 
 * {
 * 		buttonText: string,	// the text contatined in the anchor tag and tool tip
 * 		onclick: function,		// onclick callback
 * 		onmouseover:	function,	// onmouseover callback
 * 		onmouseout:	 function,	// onmouseout callback
 * 		callbackObject: object,	// an object passed as an argument to the above callback functions
 * 		rememberDownState: boolean,	// whether or not to add the class buttonDown after clicking
 * 		buttonID: string,			// Unique HTML ID for button
 * 		startDisabled: boolean			// whether or not this button should start off disabled
 * }
 * 
 * @class bbq.gui.button.NativeButton
 * @extends bbq.gui.button.GUIButton 
 */
bbq.gui.button.NativeButton = Class.create(bbq.gui.button.GUIButton, {
	/**
	 * Supports the same options as bbq.gui.button.GUIButton
	 * @param {mixed} options
	 * @example 
	 * Todo an example
	 */
	initialize: function($super, options) {
		$super(options);
		
		this.setRootNode("li");
		this.addClass("NativeButton");
		
		this._anchor = DOMUtil.createSubmitInputNode((options.buttonText ? options.buttonText : " "), {onclick: function(){this.blur(); return false}});
		this.appendChild(this._anchor);
		
		if(options.startDisabled) {
			this.setDisabled(true);
		} else {
			this.setDisabled(false);
		}
		
		this._anchor.onclick = this.buttonClicked.bindAsEventListener(this);
		this._anchor.onmouseout = this.mouseOut.bindAsEventListener(this);
		this._anchor.onmouseover = this.mouseOver.bindAsEventListener(this);
		this._anchor.onmousedown = this.mouseDown.bindAsEventListener(this);
		this._anchor.onmouseup = this.mouseUp.bindAsEventListener(this);
	},
	
	/**
	 * @param {boolean} disabled
	 */
	setDisabled: function(disabled) {
		this.disabled = disabled;
		this._anchor.disabled = this.disabled;
	},
	
	/**
	 * Overridden as it's not really necessary with this type of button
	 */
	setDown: function() {
		
	},
	
	setText: function(text) {
		this._anchor.value = text;
	}
});
