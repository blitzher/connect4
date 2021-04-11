
function get(command, shard) {
	switch (command.target) {
		case 'board': return {
			valid: true,
			body: shard.board,
		};
		default: return {
			valid: false,
			body: `Invalid get target: ${command.target}`,
		};
	}
}

function manage(message, shard) {
	/* Try to parse as JSON
	 * return invalid if it could not be parsed */
	let command;
	try {
		command = JSON.parse(message);
	} catch (e) {
		if (e instanceof SyntaxError) {
			return {
				valid: false,
				body: 'Command could not be parsed as JSON',
			}
		}
		return {
			valid: false,
			body: e.message,
		}
	}

	/* Command must have a type property, which is a string */
	if (!command.type || typeof command.type !== 'string') {
		return {
			valid: false,
			body: `No command type!`,
		}
	}

	switch (command.type) {
		case 'get':
			return get(command, shard);

		default:
			return {
				valid: false,
				body: `Invalid command type: ${command.type}`,
			};

	}


}

module.exports = manage;