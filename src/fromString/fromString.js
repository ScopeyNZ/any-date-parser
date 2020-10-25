function fromString(parser, defaultLocale) {
	return function fromStringFunction(string, locale = defaultLocale) {
		const parsed = parser.attempt(string, locale);
		if (parsed.invalid) {
			return parsed;
		}
		const date = new Date();
		// default to current year, month and day
		if (typeof parsed.year === 'number') {
			date.setUTCFullYear(parsed.year);
		}
		if (typeof parsed.month === 'number') {
			date.setUTCMonth(parsed.month - 1);
		}
		if (typeof parsed.day === 'number') {
			date.setUTCDate(parsed.day);
		}
		// default to first unit for time components
		date.setUTCHours(parsed.hour || 0);
		date.setUTCMinutes(parsed.minute || 0);
		date.setUTCSeconds(parsed.second || 0);
		date.setUTCMilliseconds(parsed.millisecond || 0);
		if (typeof parsed.offset === 'number') {
			return new Date(date - parsed.offset * 60 * 1000);
		}
		return date;
	};
}

module.exports = fromString;
