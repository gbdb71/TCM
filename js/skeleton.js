var _13Skel = {
	Init: function (tb, skipIndex) {
		if(tb.path != null)
		{
			var _cw = tb.size * 2;
			var _ch = tb.size * 3;
			
			tb.texture = _13Canv(_cw, _ch);
			
			var _ctx = tb.texture.getContext('2d');
			
			_ctx.translate(_cw / 2, _ch / 3); // paths goes -0.5 < x < 0.5, 0 < y < 1

			_13Each(tb.path, function(_cPath) {
				_13Path(_ctx, _cPath, tb.size);
			});
			
			tb.path = null;
			
			// SHADE ON Z
			if(tb.z != null)
			{
				_ctx.fillStyle = 'rgba(0,0,0,0.1)';
				_ctx.globalCompositeOperation = 'source-atop';
				
				_13Rep(tb.z, function () {
					_ctx.fillRect(-_cw / 2, -_ch / 2, _cw, _ch);
				});
			}
		}
	
		if(tb.link != null)
		{
			_13Each(tb.link, function(_tl) {
				_13Skel.Init(_tl, true);
			});
		}
		
		if(!skipIndex)
		{
			this._Index(tb);
		}
	},
	_Index: function (tb, rootBone) {
		if(rootBone == null) {
			rootBone = tb;
			tb.bones = {};
		}
		
		if(tb.name != null)
		{
			if(rootBone.bones[tb.name] == null) rootBone.bones[tb.name] = [];
			rootBone.bones[tb.name].push(tb);
		}
		
		if(tb.link != null)
		{
			_13Each(tb.link, function(_tl) {
				_13Skel._Index(_tl, rootBone);
			});
		}
	},
	Draw: function (tctx, tb) {
		tctx.save();
		tctx.translate(tb.x, tb.y);
		tctx.rotate(tb.rot);
		
		if(tb.scale != null)
		{
			tctx.scale(tb.scale.x, tb.scale.y);
		}
		
		tctx.translate(0, tb.size);
		
		_13Each(tb.link, function(_tl) {
			if(_tl.under) _13Skel.Draw(tctx, _tl);
		})
		
		tctx.translate(0, -tb.size);

		this._DrawBone(tctx, tb)
		
		tctx.translate(0, tb.size);
		
		_13Each(tb.link, function(_tl) {
			if(!_tl.under) _13Skel.Draw(tctx, _tl);
		})
		
		tctx.restore();
	},
	_DrawBone: function(tctx, tb) {
		if(tb.texture != null)
		{
			tctx.save();
			
			if(tb.alpha != null) tctx.globalAlpha = tb.alpha;
			if(tb.scale != null) tctx.scale(tb.scale, tb.scale);			

			tctx.drawImage(tb.texture, -tb.size, -tb.size);
			
			tctx.restore();
		}
	},
	Clone: function(tb) {
		var _retVal = _13ObjClone(tb);

		if(tb.path != null)
		{
			_retVal.path = [];
			_13Each(tb.path, function(_tp) {
				_retVal.path.push(_13ObjClone(_tp));
			});
		}
		
		if(tb.link != null)
		{
			_retVal.link = [];
			_13Each(tb.link, function(_tl) {
				_retVal.link.push(_13Skel.Clone(_tl));
			});
		}
		
		if(tb.bones != null)
		{
			this._Index(_retVal);
		}
		
		return _retVal;
	},
	AllBones: function(tb, onBone) {
		onBone(tb);
		
		if(tb.link != null)
		{
			_13Each(tb.link, function(_tl) {
				_13Skel.AllBones(_tl, onBone);
			});
		}
	},
	Average: function(tb, sb, tc) {
		
		tb.x = tb.x * tc + sb.x * (1 - tc);
		tb.y = tb.y * tc + sb.y * (1 - tc);
		tb.rot = tb.rot * tc + sb.rot * (1 - tc);
		
		if(tb.link != null)
		{
			_13Rep(tb.link.length, function(i) {
				_13Skel.Average(tb.link[i], sb.link[i], tc);
			});
		}
		
		return tb;
	}
};