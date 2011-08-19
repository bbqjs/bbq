include(bbq.date.DateFormat);

/**
 * @class bbq.date.DateFormat0 represents UK dates
 * @extends bbq.date.DateFormat
 * 
 */
bbq.date.DateFormat0 = new Class.create(bbq.date.DateFormat, {
	_dateSeperator: "/",
	_timeSeperator: ":",
	
	_getDate: function(options) {
		return options.date.getDate() + this._dateSeperator + (options.date.getMonth() + 1) + this._dateSeperator + options.date.getFullYear();
	},
	
	getOrder: function(options) {
		if(options.shortDate) {
			return ["Day", "DateSeperator", "Month", "DateSeperator", "Year"];
		}
		
		return ["Day", "DateSeperator", "Month", "DateSeperator", "Year", "BreakableSpace", "Hour", "TimeSeperator", "Minute"];
	}
});
