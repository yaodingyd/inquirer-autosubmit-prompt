/**
 * Input prompt example
 */

'use strict';
const inquirer = require('inquirer');
inquirer.registerPrompt('input', require('.'));

const questions = [
	{
		type: 'input',
		name: 'first_name',
		message: 'What\'s your first name',
		autoSubmit: input => input.length === 6
	},
	{
		type: 'input',
		name: 'last_name',
		message: 'What\'s your last name',
		default() {
			return 'Doe';
		},
		autoSubmit: input => input.length === 3
	},
	{
		type: 'input',
		name: 'phone',
		message: 'What\'s your phone number',
		autoSubmit: input => input.length === 10,
		validate(value) {
			const pass = value.match(
				/^([01]{1})?[-.\s]?\(?(\d{3})\)?[-.\s]?(\d{3})[-.\s]?(\d{4})\s?((?:#|ext\.?\s?|x\.?\s?){1}(?:\d+)?)?$/i
			);
			if (pass) {
				return true;
			}

			return 'Please enter a valid phone number';
		}
	}
];

inquirer.prompt(questions).then(answers => {
	console.log(JSON.stringify(answers, null, '  '));
});
