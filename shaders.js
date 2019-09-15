
var vShader =
	'attribute vec4 aPosition;' +
	'attribute vec4 aColor;' +
	'uniform float uflagVert;' + // ако флага е 1 - триъгълниците рисуваме ; ако флага е 0- катаните рисуваме
	'uniform mat4 uViewMatrix;' +
	'uniform mat4 uProjectionMatrix;' +
	'uniform mat4 uModelMatrix;' +
	//'uniform mat4 uNormalMatrix;' +
	'varying vec4 vColor;' +
	'varying vec2 vST;' +
	'attribute vec2 aST;' + // за координатите на оръжията
	'void main() {' +
	'  gl_Position = uProjectionMatrix* uViewMatrix * uModelMatrix *aPosition;' +
	' if(uflagVert>0.5) {vColor = aColor;}' + //триъгълниците рисуваме
	' else {vST = aST; }' + //оръжия рисуваме
	'}';

var fShader =
	'precision mediump float;' +
	'varying vec4 vColor;' +
	'uniform float uflagFrag;' + // ако флага е 1 - триъгълниците рисуваме ; ако флага е 0- оръжия рисуваме
	'uniform sampler2D uSampler;' +
	'varying vec2 vST;' +
	'void main() {' +
	' if(uflagFrag > 0.5) {gl_FragColor = vColor; } ' + // триъгълниците рисуваме
	//' else{ gl_FragColor = texture2D(uSampler,vST);} ' + // оръжия рисуваме
	'}';


