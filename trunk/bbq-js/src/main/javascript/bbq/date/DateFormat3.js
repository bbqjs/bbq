include(bbq.date.DateFormat);

/**
 * @class bbq.date.DateFormat1 represents US dates
 * @extends bbq.date.DateFormat
 * 
 */
bbq.date.DateFormat3 = new Class.create(bbq.date.DateFormat, {
	_dateSeperator: "-",
	_timeSeperator: ":",
	
	_getDate: function(options) {
		return options.date.getFullYear() + this._dateSeperator + (options.date.getMonth() + 1) + this._dateSeperator + options.date.getDate();
	},
	
	getOrder: function(options) {
		if(options.shortDate) {
			return ["Year", "DateSeperator", "Month", "DateSeperator", "Day"];
		}
		
		return ["Year", "DateSeperator", "Month", "DateSeperator", "Day", "BreakableSpace", "Hour", "TimeSeperator", "Minute"];
	}
});
