const LocaleHelper = require('../LocaleHelper/LocaleHelper.js');

class Format {
	constructor({ template, units, regex, handler }) {
		if (!Array.isArray(units) && typeof handler !== 'function') {
			throw new Error(
				'Format instance must receive a "units" array or "handler" function'
			);
		}
		if (typeof template !== 'string' && !(regex instanceof RegExp)) {
			throw new Error(
				'Format instance must receive a "template" string or "regex" RegExp'
			);
		}
		this.template = template;
		this.units = units;
		this.regex = regex;
		this.handler = handler;
		this.regexByLocale = {};
	}
	attempt(string, locale) {
		const matches = this.getMatches(string, locale);
		if (matches) {
			const dt = this.toDateTime(matches, locale);
			if (dt && !dt.invalid) {
				return dt;
			}
		}
		return null;
	}
	getRegExp(locale = 'en-US') {
		if (this.template) {
			if (!this.regexByLocale[locale]) {
				this.regexByLocale[locale] = LocaleHelper.factory(locale).compile(
					this.template
				);
			}
			// console.log({ tpl: this.template, regex: this.regexByLocale[locale] });
			return this.regexByLocale[locale];
		}
		return this.regex;
	}
	getMatches(string, locale) {
		return string.match(this.getRegExp(locale));
	}
	toDateTime(matches, locale) {
		if (this.units) {
			const object = LocaleHelper.factory(locale).getObject(
				this.units,
				matches
			);
			return object;
		}
		return this.handler(matches, locale);
	}
}

module.exports = Format;
