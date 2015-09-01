function _13Game() {
	
	var _allCanvas = [];
	
	_13Rep(2, function() {
		var _canvas = _13Canv(1920, 1080);
		_allCanvas.push(_canvas);
		
		document.body.appendChild(_canvas);
	});
	
	/*** SCALE HANDLING ***/
	
	var _scaleRatio = 1;
	
	window.onresize = function () {
		_scaleRatio = window.innerHeight / 1080;
		
		_13Each(_allCanvas, function(_cvs) {
			_cvs.style.height = 1080 * _scaleRatio;
			_cvs.style.width = 1920 * _scaleRatio;
			_cvs.style.display = 'block';
			_cvs.style.left = (window.innerWidth / 2 - _cvs.offsetWidth / 2) + 'px';
		});
	}
	
	window.onresize();
	
	/*** INPUT HANDLING ***/

	var _keyPressed = [];
	var _mousePos = { x: 0, y: 0};
	var _mousePressed = { l: false, r: false };
	
	document.body.addEventListener('keydown', function(eventObj){
		_keyPressed[eventObj.keyCode] = true;
	});
	
	document.body.addEventListener('keyup', function(eventObj){
		_keyPressed[eventObj.keyCode] = false;
	});
	
	document.body.addEventListener('mousemove', function(eventObj){
		_mousePos.x = (eventObj.clientX - _allCanvas[1].offsetLeft) / _scaleRatio;
		_mousePos.y = (eventObj.clientY - _allCanvas[1].offsetTop) / _scaleRatio;
	});
	
	document.body.addEventListener('mousedown', function(eventObj){
		switch(eventObj.button)
		{
			case 0: _mousePressed.l = true; break;
			case 2: _mousePressed.r = true; break;
		}
	});
	
	document.body.addEventListener('mouseup', function(eventObj){
		switch(eventObj.button)
		{
			case 0: _mousePressed.l = false; break;
			case 2: _mousePressed.r = false; break;
		}
	});
	
	_allCanvas[1].addEventListener('click', function() {
		if(_world.status == 0) {
			_world.status = 1;
			_13MediaSounds.rev.play();
		}
	});
	
	var _camOffset = { x: 0, y: -150 };
	
	/*** WORLD INIT ***/
	
	_13MediaGen();
	
	var _ctx = _allCanvas[0].getContext('2d');
	_ctx.drawImage(_13MediaTextures.landscape, 0, 0);
	
	var _ctx = _allCanvas[1].getContext('2d');
	
	

	var _world = new _13World();
	
	var _player = _13WorldGen(_world);
	
	/*** MAIN CYCLE ***/
	
	var _updTime = 30;

	_13HUD(_ctx, _player, _world);
	
	setInterval(function () {
		if(_world.status > 0)
		{
			var _act = {
				move: 0,
				jump: _keyPressed[38] || _keyPressed[87],
				attack: _mousePressed.l,
				shield: _mousePressed.r,
				watch: {
					x : _mousePos.x / 1920 - 0.5,
					y: (_mousePos.y + _camOffset.y) / 1080 - 0.5
				}
			}
			
			if(_keyPressed[37] || _keyPressed[65]) {
				_act.move --;
			}
			if(_keyPressed[39] || _keyPressed[68]) {
				_act.move ++;
			}
			
			_player.action = _act;
		

			_world.update(_updTime);
			
			var _camPos = { x: _player.pos.x + _camOffset.x, y:  _player.pos.y + _camOffset.y - _player.h * 0.5 }; // adding player height to center on player
			
			_world.render(_ctx, _camPos);
			
			if(_player.dead) _world.status = 2;
			
			_13HUD(_ctx, _player, _world);
		}
	}, _updTime);
}

function _13HUD(_ctx, _player, _world) {
	if(_world.status == 1)
	{
		_ctx.save();
		
		_ctx.translate(760, 0);
		
		var _topd = 54;
		
		_ctx.fillStyle = 'black';
		
		if(_player.revpow != null) {
			_topd = 81;

			_ctx.save();
			_ctx.fillRect(-2, 0, 404, 34);
			
			_13Rep(20, function(i) {
				if(Math.floor(_world.adv * 20) > i) _ctx.fillStyle = 'white';
				else _ctx.fillStyle = '#444444';
				
				_ctx.fillRect(20 * i, 2, 16, 30);
			});

			_ctx.restore();
		}
		
		_ctx.translate(100, 1080 - _topd);

		_ctx.fillRect(-2, 0, 204, 81);	

		_ctx.fillStyle = 'red';
		_ctx.fillRect(0, 2, 200 * _player.health.perc, 50);	

		if(_player.revpow != null)
		{
			_ctx.fillStyle = 'white';
			_ctx.fillRect(0, 54, 200 * _player.revpow.perc, 25);
		}	

		_ctx.restore();
	}
	else
	{
		var _text = [ // intro
			'Developed for JS13K by morazor',
			'[click to start]',
			'The Cursed',
			[ 'Mir', 'Ror' ],
			[ 'A valiant knight', 'A vicious villain' ],
			[ 'To break free from the curse', 'The mirror has been shattered' ],
			[ 'Fight with valour', 'Slay the nemesis' ]
		]
		
		if(_world.status == 2) // game over
		{
			_text = [ 
				'',
				'[reload to play again]',
				'You have died, fighting for the right to be',
				[ 'Your', 'Self' ]
			]
		}
		else if(_world.status == 3) // finished
		{
			_text = [ 
				'',
				'[reload to play again]',
				'You are finally free to live your life',
				[ 'Your', 'Way']
			]
		}
	
		_ctx.save();
		_ctx.beginPath();
		
		_ctx.fillStyle = 'rgba(0,0,0,' + (_world.status == 0 ? 1 : 0.5) + ')';
		_ctx.fillRect(0, 0, 1920, 1080);

		_ctx.fillStyle = '#bbbbbb';
		
		_ctx.translate(960, 1080);
		
		_ctx.textAlign = 'center';
		
		_ctx.font = '24px monospace';
		_ctx.fillText(_text[0], 0, -20);
		
		_ctx.translate(0, -240);
		
		_ctx.fillText(_text[1], 0, -20);

		_ctx.textBaseline = 'middle';
		
		if(_world.status == 0) _ctx.font = '80px serif';
		else _ctx.font = '40px serif';
		
		_ctx.translate(0, -450);

		_ctx.fillText(_text[2], 0, -100);
		
		_13Each(_text, function(_ctext, i) {
			if(i > 2) {
				_ctx.save();
				
				var _ch = (i > 3 ? 36 : 136)
				
				_ctx.fillRect(-1, -_ch / 2, 2, _ch);
				
				_ctx.font = _ch + 'px serif';

				_ctx.fillStyle = 'white';
				_ctx.textAlign = 'right';
				
				_ctx.strokeStyle = 'black';
				_ctx.lineWidth = 0.5;
				
				_13Each(_text[i], function (_ct, j) {
					if(j > 0) {
						_ctx.scale(-1, 1);
						if(_world.status != 3) _ctx.fillStyle = 'red';
					}
					
					_ctx.fillText(_text[i][j], -20, 0);
					if(i > 3) _ctx.strokeText(_text[i][j], -20, 0);
				});
				
				_ctx.restore();
				_ctx.translate(0, (i > 3 ? _ch : _ch * 1.5));
			}
		});
		
		_ctx.restore();
	}
}