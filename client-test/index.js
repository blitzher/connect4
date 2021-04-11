import * as blzwrz from "blzwrz-client"

blzwrz.connect({ id : 1 }, (shard) => {
	shard.send({type:'get', target:'player', 'id':'abcdef'}, (board) => {
		console.log(board);
		});
});
