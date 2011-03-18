/**
 * DateFormatter represents the date format
  */
DateFormatter = {
	_dateFormatter: null,
	
	/**
	 * @param {mixed} dateFormatter
	 */
	setDateFormatter: function(dateFormatter) {
		this._dateFormatter = dateFormatter;
	},
	
	/**
	 *@param {mixed} options
	 *@example
	 * Supports the following options:
	 * 
	 * options: {
	 * 		date: Date						// the date to display
	 * 		withStrings: boolean	// whether to display "Today", etc
	 * 		shortDate: boolean		// if true, hours and minutes will be omitted
	 * }
	 */
	getFormattedDate: function(options) {
		if(typeof(options) == "undefined") {
			options = {};
		}
		
		options.date = DateFormatter._normaliseDate(options.date);
		
		if(options["shortDate"]) {
			return this._dateFormatter.getShortDate(options);
		}
		
		return this._dateFormatter.getLongDate(options);
	},
	
	getOrder: function(options) {
	 	if(typeof(options) == "undefined") {
			options = {};
		}
	 	
	 	return this._dateFormatter.getOrder(options);
	},
	
	getDateSeperator: function() {
	 	return this._dateFormatter.getDateSeperator();
	},
	
	getTimeSeperator: function() {
	 	return this._dateFormatter.getTimeSeperator();
	},
	
	/**
	 * Pass in a Date object, a timestamp (ie. an integer) or nothing at all and get a Date object back.  If nothing is passed the current date is returned.
	 * 
	 * @param {mixed}
	 * @return {Date} 
	 */
	_normaliseDate: function(date) {
		if(!date) {
			return new Date();
		}
		
		return date instanceof Date ? date : new Date(date);
	}
}