class NoiseUtil {
	
	static Lerp(t, a, b){
		return a + t*(b-a);
	}

	// This returns the dot product between the 1D vector (x) and a 1D unit vector.
	static Grad1D(h, x){
		h = h & 1;
		if(h == 0)
			return x;
		else
			return -x;
	}

	// This returns the dot product between the 2D vector (x, y) and a 2D unit vector.
	static Grad2D(h, x, y){
		h = h & 3;
		if(h == 0)
			return x + y;
		else if(h == 1)
			return -x + y;
		else if(h == 2)
			return -x - y;
		else
			return x - y;
	}

	// This returns the dot product between the 3D vector (x, y, z) and a 3D unit vector.
	static Grad3D(h, x, y, z){
		h = h & 15;
		if(h === 0)
			return x + y;
		else if(h === 1)
			return -x + y;
		else if(h === 2)
			return -x - y;
		else if(h === 3)
			return x - y;
		else if(h === 4)
			return x + z;
		else if(h === 5)
			return -x + z;
		else if(h === 6)
			return -x - z;
		else if(h === 7)
			return x - z;
		else if(h === 8)
			return z + y;
		else if(h === 9)
			return -z + y;
		else if(h === 10)
			return -z - y;
		else if(h === 11)
			return z - y;
		else if(h === 12)
			return x + y;
		else if(h === 13)
			return z + y;
		else if(h === 14)
			return z - x;
		else
			return z - y;
	}

	static Fade(t){
		return 6*t**5 - 15*t**4 + 10*t**3;
	}

	static Shuffle(tab){
		for(let e = tab.length-1; e > 0; e--){
			let index = Math.round(Math.random()*(e-1)),
				temp  = tab[e];
			
			tab[e] = tab[index];
			tab[index] = temp;
		}
	}
	
	static MakePermutation(size){
		let P = [];
		for(let i = 0; i < size; i++){
			P.push(i);
		}
		NoiseUtil.Shuffle(P);
		for(let i = 0; i < size; i++){
			P.push(P[i]);
		}
		
		return P;
	}

};

class Noise {
	
	static Noise1D(x){
		let X  = Math.floor(x) & 255,
			xf = x-Math.floor(x),
			u  = NoiseUtil.Fade(xf);
		
		let gradLeft = this.P[X],
			gradRight = this.P[X+1];

		return NoiseUtil.Lerp(u, NoiseUtil.Grad1D(gradLeft, xf), NoiseUtil.Grad1D(gradRight, xf-1.0))
	}

	static Noise2D(x, y){
		let X  = Math.floor(x) & 255,
			Y  = Math.floor(y) & 255,
			xf = x-Math.floor(x),
			yf = y-Math.floor(y),
			u  = NoiseUtil.Fade(xf),
			v  = NoiseUtil.Fade(yf);

		let gradBottomLeft = Noise.P[Noise.P[X]+Y],
			gradBottomRight = Noise.P[Noise.P[X+1]+Y],
			gradTopLeft = Noise.P[Noise.P[X]+Y+1],
			gradTopRight = Noise.P[Noise.P[X+1]+Y+1];
		
		return NoiseUtil.Lerp(
			u,
			NoiseUtil.Lerp(v, NoiseUtil.Grad2D(gradBottomLeft, xf, yf), NoiseUtil.Grad2D(gradTopLeft, xf, yf-1.0)),
			NoiseUtil.Lerp(v, NoiseUtil.Grad2D(gradBottomRight, xf-1.0, yf), NoiseUtil.Grad2D(gradTopRight, xf-1.0, yf-1.0))
		)
	}

	static Noise3D(x, y, z){
		let X  = Math.floor(x) & 255,
			Y  = Math.floor(y) & 255,
			Z  = Math.floor(z) & 255,
			xf = x-Math.floor(x),
			yf = y-Math.floor(y),
			zf = z-Math.floor(z),
			u  = NoiseUtil.Fade(xf),
			v  = NoiseUtil.Fade(yf),
			w  = NoiseUtil.Fade(zf);

		let x0 = Noise.P[X],
			x1 = Noise.P[X+1],
			x0y0 = Noise.P[x0+Y],
			x0y1 = Noise.P[x0+Y+1],
			x1y0 = Noise.P[x1+Y],
			x1y1 = Noise.P[x1+Y+1],
			x0y0z0 = Noise.P[x0y0+Z],
			x0y0z1 = Noise.P[x0y0+Z+1],
			x0y1z0 = Noise.P[x0y1+Z],
			x0y1z1 = Noise.P[x0y1+Z+1],
			x1y0z0 = Noise.P[x1y0+Z],
			x1y0z1 = Noise.P[x1y0+Z+1],
			x1y1z0 = Noise.P[x1y1+Z],
			x1y1z1 = Noise.P[x1y1+Z+1];
		
		return NoiseUtil.Lerp(
			u,
			NoiseUtil.Lerp(
				v,
				NoiseUtil.Lerp(w, NoiseUtil.Grad3D(x0y0z0, xf, yf, zf), NoiseUtil.Grad3D(x0y0z1, xf, yf, zf-1.0)),
				NoiseUtil.Lerp(w, NoiseUtil.Grad3D(x0y1z0, xf, yf-1.0, zf), NoiseUtil.Grad3D(x0y1z1, xf, yf-1.0, zf-1.0))
			),
			NoiseUtil.Lerp(
				v,
				NoiseUtil.Lerp(w, NoiseUtil.Grad3D(x1y0z0, xf-1.0, yf, zf), NoiseUtil.Grad3D(x1y0z1, xf-1.0, yf, zf-1.0)),
				NoiseUtil.Lerp(w, NoiseUtil.Grad3D(x1y1z0, xf-1.0, yf-1.0, zf), NoiseUtil.Grad3D(x1y1z1, xf-1.0, yf-1.0, zf-1.0))
			)
		);
	}
};

Noise.P = NoiseUtil.MakePermutation(256);