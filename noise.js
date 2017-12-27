var Noise = {};

Noise.P = NoiseUtil.makePermutation(256);

Noise.noise1D = function(x){
	var X  = Math.floor(x) & 255,
		xf = x-Math.floor(x),
		u  = NoiseUtil.fade(xf);
	
	var A = this.P[X]
	var B = this.P[X+1]

	return NoiseUtil.lerp(u, NoiseUtil.grad1D(A, xf), NoiseUtil.grad1D(B, xf-1.0))
}

Noise.noise2D = function(x, y){
	var X  = Math.floor(x) & 255,
		Y  = Math.floor(y) & 255,
		xf = x-Math.floor(x),
		yf = y-Math.floor(y),
		u  = NoiseUtil.fade(xf),
		v  = NoiseUtil.fade(yf);

	var A = Noise.P[X],
		B = Noise.P[X+1],
		AA = A+Y,
		BB = B+Y;
	
	return NoiseUtil.lerp(
		u,
		NoiseUtil.lerp(v, NoiseUtil.grad2D(AA, xf, yf), NoiseUtil.grad2D(AA+1, xf, yf-1.0)),
		NoiseUtil.lerp(v, NoiseUtil.grad2D(BB, xf-1.0, yf), NoiseUtil.grad2D(BB+1, xf-1.0, yf-1.0))
	)
}