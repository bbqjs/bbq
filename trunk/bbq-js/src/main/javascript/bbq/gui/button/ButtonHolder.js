include(bbq.gui.GUIWidget);

/**
 * Holds bbq.gui.button.GUIButtons
 * @class bbq.gui.button.ButtonHolder
 * @extends bbq.gui.GUIWidget
 */
bbq.gui.button.ButtonHolder = Class.create(bbq.gui.GUIWidget, {
	_disabled: false,
	_selectedIndex: 0,
	_buttons: null,
	_buttonNames: null,
	
	/**
	 * Supports the following options:
	 * 
	 * options: {
	 * 		vertical: boolean				// Pass true if these buttons are orientated vertically, otherwise will be horiztonal
	 * 		ignoreKeyPresses: boolean		// Pass true to ignore key presses
	 * }
	 * 
	 */
	initialize: function($super, options) {
		$super(options);
		
		this.setRootNode("ul");
		this.addClass("ButtonHolder");

		this._buttonNames = new Hash();
		this._buttons = [];
	},

	render: function($super) {
		$super();

		this.empty();

		this._buttons.each(function(button) {
			this.appendChild(button);
		}.bind(this));
	},
	
	/**
	 * @param	{bbq.gui.button.GUIButton}	button
	 */
	addButton: function(button, buttonName) {
		var index = this._buttons.length;

		button.setIndex(index);
		button.buttonHolder = this;
		
		if(button.getRootNode().tagName.toLowerCase() != "li") {
			this.appendChild(DOMUtil.createTextElement("li", button));
		} else {
			this.appendChild(button);
		}
		
		if(buttonName) {
			this._buttonNames.set(buttonName, button);
		}

		this._buttons.push(button);
		
		return button;
	},
	
	/**
	 * Removes the down state on all child buttons
	 */
	clearDown: function() {
		this._buttons.invoke("clearDown");
	},
	
	/**
	 * Disables every child button
	 */
	setDisabled: function(disabled) {
		this._disabled = disabled;
		this._buttons.invoke("setDisabled", disabled);
		this._buttonNames.each(function(button) {
			button[1].setDisabled(disabled);
		})
		
		if(this._disabled) {
			this.clearDown();
			this.loseFocus();
		}
	},
	
	/**
	 * Returns a button.  Either pass in a button name as a string
	 * or a position index as an integer.
	 * 
	 * @param	{integer}	index
	 */
	getButton: function(index) {
		if(Object.isString(index)) {
			return this._buttonNames.get(index);
		}
		
		return this._buttons[index];
	},
	
	/**
	 * @return	Returns the index of the currently selected button
	 * @type {integer}
	 */
	getSelectedIndex: function() {
		return this._selectedIndex;
	},
	
	/**
	 * Sets the currently selected button index
	 * @param {integer} index
	 */
	setSelectedIndex: function(index) {
		this._selectedIndex = index;
	},
	
	/**
	 * @private
	 */
	_buttonClicked: function(button, event) {
		this.setSelectedIndex(button.getIndex());
		
		// only register for keypresses if an event was passed.  This may not always be the case - ie. if the button's buttonClicked method was invoked manually
		if(event) {
			FocusWatcher.setKeypressCallbackObject(this);
		}
	},
	
	/**
	 * Accepts focus if not disabled
	 */
	acceptFocus: function() {
		if(!this._disabled) {
			this.addClass("hasFocus");
		}
	},
	
	/**
	 * Loose focus
	 */
	loseFocus: function() {
		this.removeClass("hasFocus");
	},
	
	/**
	 * Processes key presses on the button holder
	 * @param {Event} event
	 */
	processKeypress: function(event) {
		if(!this.options.ignoreKeyPresses && !this._disabled) {
			var nextEntity = false;
			var index = this.getSelectedIndex();
			
			if(index != -1) {
				// process keypress
				if(this.options.vertical) {
					if(event.keyCode == Event.KEY_UP) { // previous button
						nextEntity = this.getButton(index - 1);
					} else if(event.keyCode == Event.KEY_DOWN) {  // next button
						nextEntity = this.getButton(index + 1);
					}
				} else {
					if(event.keyCode == Event.KEY_LEFT) { // previous button
						nextEntity = this.getButton(index - 1);
					} else if(event.keyCode == Event.KEY_RIGHT) {  // next button
						nextEntity = this.getButton(index + 1);
					}
				}
			}
			
			if(nextEntity) {
				nextEntity.buttonClicked();
			}
			
			return true;
		}
	}
});
