include(bbq.gui.button.IconButton);

/**
 * @class bbq.gui.button.AddButton 
 * @extends bbq.gui.button.IconButton 
 */
bbq.gui.button.AddButton = Class.create(bbq.gui.button.IconButton, {
	/**
	 * @param {Object} options
	 * @example
	 * Todo an example
	 */
	initialize: function($super, options) {
		$super(options);
		
		this.addClass("AddButton");
	}
});
