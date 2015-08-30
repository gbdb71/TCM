function _13AI(mob, world, timePassed)
{
	var _pl = world.player;
	
	if(mob != _pl)
	{
		if(mob._lastAI == null) mob._lastAI = 0;
		
		mob._lastAI -= timePassed;
		
		if(mob._naction == null) mob._naction = _13ObjClone(mob.action, true);
		mob.action = mob._naction;
		var _act = mob._naction = _13ObjClone(mob.action, true);
		
		_act.watch = {
			x : _pl.pos.x - mob.pos.x,
			y: _pl.pos.y - mob.pos.y
		}
		
		if(mob._lastAI < 0)
		{
			if(!mob.dead) {
				var _pldist = Math.abs(_pl.pos.x - mob.pos.x);
					
				if(_pldist < 500) {
					mob.awake = true;
				}
				
				if(mob.type == 'ranged')
				{
					// RANGED AI

					if(mob.awake && !mob.dead && !_pl.dead) {
						if(mob.didatk > 500 / mob.revmult)
						{
							if(_act.move == null) _act.move = { 
								x: _pl.pos.x + (_pl.facing ? -1 : 1) * (400 + _13RandBetween(0, 100)), 
								y: _pl.lastgy + _13RandBetween(-300, -250)
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

					if(mob.awake && !mob.dead && !_pl.dead) {
						var _pldir = (_pl.pos.x < mob.pos.x) ? (-1) : (1);
				
						if(_pldist > 200) _act.move = _pldir;
						else if(_pldist < 150) _act.move = -_pldir;
						
						if(_pldist < 350) {
							if(mob.canshield && _pl.facing != mob.facing) {
								if((_pl.isattack && mob.isshield) ||
									(_pl.isattack && Math.random() > 0.8) || 
									(mob.isshield && Math.random() > 0.5) ||
									Math.random() > 0.9) _act.shield = true;
							}
							
							if(!_act.shield && Math.random() > 0.7) _act.attack = true;
						}
						
						if(_act.move == -1 && mob.block.l || _act.move == 1 && mob.block.r) {
							mob.action.jump = true; // no delay in jumps
							mob.action.move = 0;
						}
					}
				}
				
				mob._lastAI = 200 / mob.revmult;
			}
		}
	}
}