function _13AI(mob, player, timePassed)
{
	if(mob != player)
	{
		if(mob._lastAI == null) mob._lastAI = 0;
		
		mob._lastAI -= timePassed;
		
		if(mob._naction == null) mob._naction = _13ObjClone(mob.action, true);
		mob.action = mob._naction;
		var _act = mob._naction = _13ObjClone(mob.action, true);
		
		var _mpos = {
			x: player.pos.x + player.vel.x / 2,
			y: player.pos.y + player.vel.y / 2
		}
		
		_act.watch = {
			x : player.pos.x - mob.pos.x,
			y: player.pos.y - mob.pos.y
		}
		
		if(mob._lastAI < 0)
		{
			if(!mob.dead) {
				var _pldist = Math.abs(_mpos.x - mob.pos.x);
					
				if(_pldist < 500) {
					mob.awake = true;
				}
				
				if(mob.type == 'ranged')
				{
					// RANGED AI

					if(mob.awake && !mob.dead && !player.dead) {
						var _toofar = _pldist > 700;
						if(mob.didatk > 500 / mob.revmult || _toofar)
						{
							if(_act.move == null || _toofar) _act.move = { 
								x: _mpos.x + (player.facing ? -1 : 1) * (375 + _13RandBetween(0, 100)), 
								y: player.lastgy + _13RandBetween(-275, -230)
							}
							_act.attack = false;
						}
						else 
						{
							_act.move = null;
							_act.attack = true;
						}
					}
					else {
						_act.move = null;
						_act.attack = false;
					}
				}
				else {
					// MELEE AI
					
					_13ObjExtend(_act, {
						move: 0,
						shield: false,
						attack: false,
						jump: false
					});

					if(mob.awake && !mob.dead && !player.dead) {
						var _pldir = (_mpos.x < mob.pos.x) ? (-1) : (1);
				
						if(_pldist > 200) _act.move = _pldir;
						else if(_pldist < 150) _act.move = -_pldir;
						
						if(_pldist < 350) {
							if(mob.canshield && player.facing != mob.facing) {
								var _basech = 1.03 - (mob.revmult + mob.shnrg.c) * 0.1;
								if((player.isattack && mob.isshield) ||
									(player.isattack && Math.random() > _basech) || 
									(mob.isshield && Math.random() > 0.4) ||
									Math.random() > _basech) _act.shield = true;
							}
							
							if(!_act.shield && Math.random() > 0.7) _act.attack = true;
						}
						
						if(_act.move == -1 && mob.block.l || _act.move == 1 && mob.block.r) {
							mob.action.jump = true; // no delay in jumps
							mob.action.move = 0;
						}
					}
				}
				
				mob._lastAI = 150 / mob.revmult;
			}
		}
	}
}