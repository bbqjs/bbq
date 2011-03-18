include(bbq.date.DateFormat);

/**
 * @class bbq.date.DateFormat1 represents US dates
 * @extends bbq.date.DateFormat
 * 
 */
bbq.date.DateFormat1 = new Class.create(bbq.date.DateFormat, {
	_dateSeperator: "/",
	_timeSeperator: ":",
	
	_getDate: function(options) {
		return (options.date.getMonth() + 1) + this._dateSeperator + options.date.getDate() + this._dateSeperator + options.date.getFullYear();
	},
	
	getOrder: function(options) {
		if(options.shortDate) {
			return ["Month", "DateSeperator", "Day", "DateSeperator", "Year"];
		}
		
		return ["Month", "DateSeperator", "Day", "DateSeperator", "Year", "BreakableSpace", "Hour", "TimeSeperator", "Minute"];
	}
});
