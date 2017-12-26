var NoiseUtil = {};

NoiseUtil.lerp = function(t, a, b){
	return a + t*(b-a);
}

NoiseUtil.grad1D = function(h, x){
	h = h & 1;
	if(h == 0)
		return x;
	else
		return -x;
}

NoiseUtil.grad2D = function(h, x, y){
	h = h & 3;
	if(h == 0)
		return x + y;
	else if(h == 1)
		return -x + y;
	else if(y == 2)
		return -x - y;
	else
		return x - y;
}

NoiseUtil.fade = function(t){
	return 6*t**5 - 15*t**4 + 10*t**3;
}

NoiseUtil.shuffle = function(tab){
	for(var e = tab.length-1; e > 0; e--){
		var index = Math.round(Math.random()*(e-1));
		var temp  = tab[e];
		tab[e] = tab[index];
		tab[index] = temp;
	}
}

NoiseUtil.makePermutation = function(size){
	var P = [];
	for(var i = 0; i < size; i++){
		P.push(i);
	}
	NoiseUtil.shuffle(P);
	for(var i = 0; i < size; i++){
		P.push(P[i]);
	}
	
	return P;
}