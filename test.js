import test from 'ava';
import _ from 'lodash';
import ReadlineStub from './readline';
import fixtures from './fixtures';
import Input from '.';

test.beforeEach(t => {
	t.context.fixture = _.clone(fixtures.input);
	t.context.rl = new ReadlineStub();
});

test('should use raw value from the user', async t => {
	const prompt = new Input(t.context.fixture, t.context.rl);
	const input = prompt.run();
	t.context.rl.emit('line', 'Inquirer');
	const answer = await input;
	t.is(answer, 'Inquirer');
});

test('should output filtered value', async t => {
	t.context.fixture.filter = () => 'pass';
	const prompt = new Input(t.context.fixture, t.context.rl);
	const input = prompt.run();
	t.context.rl.emit('line', '');
	await input;
	t.truthy(t.context.rl.output.__raw__.includes('pass'));
});

test('should apply the provided transform to the value', async t => {
	t.context.fixture.transformer = value => value.split('').reverse().join('');
	const prompt = new Input(t.context.fixture, t.context.rl);
	const input = prompt.run();
	t.context.rl.emit('line', 'Inquirer');
	await input;
	t.truthy(t.context.rl.output.__raw__.includes('reriuqnI'));
});

test('should use the answers object in the provided transformer', async t => {
	t.context.fixture.transformer = (value, answers) =>
		answers.capitalize ? value.toUpperCase() : value;
	const answers = {
		capitalize: true
	};
	const prompt = new Input(t.context.fixture, t.context.rl, answers);
	const input = prompt.run();
	t.context.rl.emit('line', 'inquirer');
	await input;
	t.truthy(t.context.rl.output.__raw__.includes('INQUIRER'));
});

test('should use the flags object in the provided transformer', async t => {
	t.context.fixture.transformer = (value, answers, flags) => {
		const text = answers.capitalize ? value.toUpperCase() : value;
		if (flags.isFinal) {
			return text + '!';
		}

		return text;
	};

	const answers = {
		capitalize: true
	};

	const prompt = new Input(t.context.fixture, t.context.rl, answers);
	const input = prompt.run();
	t.context.rl.emit('line', 'inquirer');
	await input;
	t.truthy(t.context.rl.output.__raw__.includes('INQUIRER'));
});

test('should autosubmit', async t => {
	t.context.fixture.autoSubmit = value => value.length === 5;
	const prompt = new Input(t.context.fixture, t.context.rl);
	const input = prompt.run();
	t.context.rl.line = '12345';
	t.context.rl.input.emit('keypress');
	await input;
	t.truthy(t.context.rl.output.__raw__.includes('12345'));
});

