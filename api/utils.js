module.exports = {
	copyObject: function(object) {
		return JSON.parse(JSON.stringify(object));
	},

	randomInt: function(low, high) {
    	return Math.floor(Math.random() * (high - low) + low);
	},

	formatDate: function(date) {
		return this._formatNumber(date.getDate()) + "/" + this._formatNumber(date.getMonth() + 1) + "/" + this._formatNumber(date.getFullYear());
	},

	_formatNumber: function(number) {
		return number < 10 ? "0" + number : number + "";
	},

	convertToDate: function(dateStr) {
		//"2016-06-14T23:24:55.125Z"
		var dateAndTime = dateStr.split("T");
		var dateParts = dateAndTime[0].split("-");
		dateParts[1] = parseInt(dateParts[1]) - 1;
		var timeParts = dateAndTime[1].split(":");
		var seconds = timeParts[2];
		var milli = seconds.substr(seconds.indexOf(".") + 1, 3);
		timeParts[2] = timeParts[2].substr(0, timeParts[2].indexOf("."));
		var date = new Date(dateParts[0], dateParts[1], dateParts[2], timeParts[0], timeParts[1], timeParts[2], milli);
		date = sumHour(date, -3);
		return date;
	},

	setTime: function(date, hour, minute) {
		return new Date(date.getFullYear(), date.getMonth(), date.getDate(), hour, minute, 0, 0);
	},

	sumMinutes: function(date, numberOfMinutes) {
		var newDate = new Date(date);
		newDate.setMinutes(date.getMinutes() + numberOfMinutes);
		return newDate;
	},

	sumDate: function(date, numberOfDays) {
		var newDate = new Date(date);
		newDate.setDate(date.getDate() + numberOfDays);
		return newDate;
	},

	sumMonths: function(date, numberOfMonths) {
		var newDate = new Date(date);
		newDate.setMonth(date.getMonth() + numberOfMonths);
		return newDate;
	},

	isDateLessThan: function(date1, date2) {
		return date1.getTime() < date2.getTime();
	},

	getLastDateOfMonth: function(year, month) {
		var lastDayOfMonth  = new Date(year, month, 1, 0, 0, 0, 0);
		lastDayOfMonth = this.sumMonths(lastDayOfMonth, 1);
		lastDayOfMonth = this.sumDate(lastDayOfMonth, -1);
		return lastDayOfMonth;
	}
}
