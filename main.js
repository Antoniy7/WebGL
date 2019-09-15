/**
 * местиш със стрелките напред - назад ; наляво - надясно
 * трябва да минеш без да се удравя в кинжалите
 * да стигнеш до зеления триъгълник
 * и на две нива е 
 * на първото трябва за да минеш на 2рото трябва да оцелиш г/д средата
 * на зеления правоъгълник, като го правиш с постоянни натискания на копчето напред
 * смисъл такъв не задържаш, защото съм го сложил на keyUp , по-лесно е за тестване
 * а на второто вляво има светещ телепорт , който индикира , че все едно идеята е че от там си дошъл нали
 * и три жълто-черни мигащи триъгълника , който индикират , че на там е забранена зона
 * иначе за да спечелиш , трябва да отидфеш пак до зеления триъгълник
 * отдясната част , където е бяло и по този начин , печелившия екран е зелен
 * иначе имаш 6 живота и ако умреш всичките пъти крайния екран е червен
 * като за да умреш на първото ниво е достатъчно - на лявата част е през г/д средата на тригълниците 
 * на дясната съм сложил малко по надясно да е , от левия край на десните кинжали
 * на второто ниво просто да се забиешш в тяях е досттъчно 
 * 
 * като да се ресетнеш копчето е   J , ама губиш живот
 * други копчета сложъл съм и qwer - за Х-овете , asdf - Y-ците ; zxcv - Z-овете
 * те не  са част от играта , но са за пълен контрол 
 * също така рестартирането на нивото , те води до началното положение , в което е почнало
 * нали нивото
 * 
 */

var vShader_one =
    'attribute vec4 aPosition;' +
    'uniform mat4 mvp;' +
    'attribute vec4 aColort;' +
    //'varying vec4 vColort;' +
    'void main() {' +
    '   gl_Position = aPosition;' +
    '  gl_PointSize = 10.0;' +
    //' vColort = aColort;' + //триъгълниците рисуваме
    '}';


var fShader_one =
    'precision mediump float;' +
    //'varying vec4 vColort;' +
    'void main() {' +
    ' gl_FragColor = vec4(0.0,0,0,1);  ' + // триъгълниците рисуваме
    '}';

var vShader_three =
    'attribute vec4 a_Position;' +
    'attribute vec2 a_TexCoord;' +
    'varying vec2 v_TexCoord;' +
    'uniform mat4 mvp;' +

    'void main() {' +
    '  gl_Position = mvp*a_Position;' +
    '  v_TexCoord = a_TexCoord;' +
    '}';


var fShader_three =
    'precision mediump float;' +
    'uniform sampler2D u_Sampler;' +
    'varying vec2 v_TexCoord;' +
    'void main() {' +
    '  gl_FragColor = texture2D(u_Sampler, v_TexCoord);' +
    '}';


var vShader_four =
    'attribute vec4 a_Position;' +
    'attribute vec2 a_TexCoord;' +
    'varying vec2 v_TexCoord;' +
    'uniform mat4 mvp;' +

    'void main() {' +
    '  gl_Position = mvp*a_Position;' +
    '  v_TexCoord = a_TexCoord;' +
    '}';


var fShader_four =
    'precision mediump float;' +
    'uniform sampler2D u_Sampler0;' +
    'uniform sampler2D u_Sampler1;' +
    'varying vec2 v_TexCoord;' +
    'void main() {' +
    '  vec4 a = texture2D(u_Sampler0, v_TexCoord);' +
    '  vec4 b = texture2D(u_Sampler1, v_TexCoord);' +
    '  gl_FragColor = a*b;' +
    '}';

var vShader_five =
    'attribute vec4 a_Position;' +
    'attribute vec2 a_TexCoord;' +
    'varying vec2 v_TexCoord;' +
    'uniform mat4 mvp;' +

    'void main() {\n' +
    '  gl_Position = mvp*a_Position;' +
    '  v_TexCoord = a_TexCoord;' +
    '}';


var fShader_five =
    'precision mediump float;' +
    'uniform sampler2D u_Sampler;' +
    'varying vec2 v_TexCoord;' +
    'void main() {' +
    '  gl_FragColor = texture2D(u_Sampler, v_TexCoord);' +
    '}';




function main() {
    var canvas = document.getElementById("webgl");
    canvas.addEventListener('webglcontextlost', function (event) { event.preventDefault(); }, false);
    canvas.addEventListener('webglcontextrestored', init, false);
    document.body.addEventListener('keydown', keyDown, false);
    document.body.addEventListener('keyup', keyUp, false);
    //testCanvas();
    //console.log("testing");
    init(canvas);
    //debug.utils.BreakPoint();
    //drawFrame();
}
var eyeX;//координата X на окото
var eyeY;//координата Y на окото
var eyeZ;//координата Z на окото
var triugulnik = 1;
var weapong = 0;
//var glprogSecond; //оръжията
var targetX;//координата X на целта
var targetY;//координата Y на целта
var targetZ;//координата Z на целта
var perspValDefault = 4.6999;
var perspVal = perspValDefault;
var flagCenter = false;
var flagLeft = false;
var flagRight = false;
var glprog2;
var glprog3;
var glprog4;
function init(canvas) {
    gl = getContext("webgl");
    glprog = getProgram(vShader, fShader);
    glprog2 = getProgram(vShader_one, fShader_one);
    glprog3 = getProgram(vShader_three, fShader_three);
    glprog4 = getProgram(vShader_four, fShader_four);
    glprog5 = getProgram(vShader_five, fShader_five);
    glprog = getProgram(vShader, fShader);

    getVariables();

    gl.clearColor(1, 1, 1, 1);

    gl.clearColor(0, 0, 0, 1);
    //gl.enable(gl.DEPTH_TEST);
    //начални координати на окото;
    //initialEyeX = 23; initialEyeY = 30; initialEyeZ = 65;
    initialEyeX = -5; initialEyeY = 30; initialEyeZ = 65;
    eyeX = initialEyeX; eyeY = initialEyeY; eyeZ = initialEyeZ;
    //initalTargetX = 0.4; initalTargetY = 0.0; initalTargetZ = 0.0;
    initalTargetX = 0.049; initalTargetY = 1.15; initalTargetZ = 0.0;
    targetX = initalTargetX; targetY = initalTargetY; targetZ = initalTargetZ;

    //trying();
    startInit(canvas);
}

function trying() {
    gl.useProgram(glprog2);
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    var data = new Float32Array([
        0.0, 0.5, -0.5, -0.5, 0.5, -0.5
    ]);
    var vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

    var a_Position = gl.getAttribLocation(glprog2, 'aPosition');

    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Position);
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);


    gl.drawArrays(gl.POINTS, 0, 3);

    gl.useProgram(glprog3);

    var data = new Float32Array([
        0.0, 0.7, -0.7, -0.7, 0.7, -0.7
    ]);
    var vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

    var a_Position = gl.getAttribLocation(glprog3, 'aPosition');

    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Position);


    gl.drawArrays(gl.POINTS, 0, 3);


}

var oldTime = now();
var angle = 20;
var angleIncrement = 0.2;
var clearIncrement = 0.002;
var Targ = 3;
var Knive = 12;
var clearCol = 0;
var lives = 6;
var lvl2 = false;
var gameOver = false;
var once = false;
var anNonTarg = 20;
var anNonTagetInrement = 0.03;
var transX = 2.7;
var transXStep = 0.2;
var increase = false;

function filling() {
    gl.useProgram(glprog2);
    var vertices = new Float32Array([
        0.0, 0.8, -0.5, -0.5, 0.5, -0.5
    ]); var n = 3;
    var vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    var a_Position = gl.getAttribLocation(glprog2, 'aPosition');

    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Position);
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);


    gl.drawArrays(gl.POINTS, 0, n);
    gl.useProgram(glprog);
}
var perspectiveView;

function fillingTextureInitBackDragon() {
    gl.useProgram(glprog3);
    gl.clearColor(0, 0, 0, 1);
    var projectionMatrica = perspMatrix(perspVal, gl.canvas.width / gl.canvas.height, 0, 100);
    var viewMatrica = viewMatrix([eyeX, eyeY, eyeZ], [targetX, targetY, targetZ], [0, 1, 0]);
    perspectiveView = multiplyMatrix(projectionMatrica, viewMatrica);

    var MVP = u_ViewMatrix = gl.getUniformLocation(glprog3, 'mvp');

    //var modelMatrica = translateMatrix([-2, 0, -2]);
    var modelMatrica = zRotateMatrix(angle);
    var temp = multiplyMatrix(perspectiveView, modelMatrica);

    gl.uniformMatrix4fv(MVP, false, temp);


    var data = new Float32Array([
        -0.5, 0.9, 0.0, 1.0,
        -0.5, -0.1, 0.0, 0.0,
        0.5, 0.9, 1.0, 1.0,
        0.5, -0.1, 1.0, 0.0,
    ]);
    var n = 4;
    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);


    var a_Position = gl.getAttribLocation(glprog3, 'a_Position');
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FLOATS * 4, 0);
    gl.enableVertexAttribArray(a_Position);

    var a_TexCoord = gl.getAttribLocation(glprog3, 'a_TexCoord');
    gl.vertexAttribPointer(a_TexCoord, 2, gl.FLOAT, false, FLOATS * 4, FLOATS * 2);
    gl.enableVertexAttribArray(a_TexCoord);

    var texture = gl.createTexture();

    var u_Sampler = gl.getUniformLocation(glprog3, 'u_Sampler');
    var image = new Image();

    image.src = 'sin.jpg';
    image.onload = function () {
        gl.useProgram(glprog3);

        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
        gl.uniform1i(u_Sampler, 0);

    };
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    gl.useProgram(glprog);
}


function fillingTextureInitBackDarkMagician() {
    gl.useProgram(glprog3);
    gl.clearColor(0, 0, 0, 1);
    var projectionMatrica = perspMatrix(perspVal, gl.canvas.width / gl.canvas.height, 0, 100);
    var viewMatrica = viewMatrix([eyeX, eyeY, eyeZ], [targetX, targetY, targetZ], [0, 1, 0]);
    perspectiveView = multiplyMatrix(projectionMatrica, viewMatrica);

    var MVP = u_ViewMatrix = gl.getUniformLocation(glprog3, 'mvp');

    //    var modelMatrica = translateMatrix([-1, -2, -2]);
    var modelMatrica = zRotateMatrix(angle);
    var temp = multiplyMatrix(perspectiveView, modelMatrica);

    gl.uniformMatrix4fv(MVP, false, temp);
    var data = new Float32Array([
        -0.8, 0.2, 0.0, 1.0,
        -0.8, -0.8, 0.0, 0.0,
        0.2, 0.2, 1.0, 1.0,
        0.2, -0.8, 1.0, 0.0,
    ]);
    var n = 4;
    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);


    var a_Position = gl.getAttribLocation(glprog3, 'a_Position');
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FLOATS * 4, 0);
    gl.enableVertexAttribArray(a_Position);

    var a_TexCoord = gl.getAttribLocation(glprog3, 'a_TexCoord');
    gl.vertexAttribPointer(a_TexCoord, 2, gl.FLOAT, false, FLOATS * 4, FLOATS * 2);
    gl.enableVertexAttribArray(a_TexCoord);

    var texture = gl.createTexture();

    var u_Sampler = gl.getUniformLocation(glprog3, 'u_Sampler');
    var image = new Image();

    image.src = 'sin.jpg';
    image.onload = function () {
        gl.useProgram(glprog3);

        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
        gl.uniform1i(u_Sampler, 1);

    };
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);
    gl.useProgram(glprog);
}
function fillingTextureInitBlueDarkMagician() {
    gl.useProgram(glprog3);
    gl.clearColor(0, 0, 0, 1);
    var projectionMatrica = perspMatrix(perspVal, gl.canvas.width / gl.canvas.height, 0, 100);
    var viewMatrica = viewMatrix([eyeX, eyeY, eyeZ], [targetX, targetY, targetZ], [0, 1, 0]);
    perspectiveView = multiplyMatrix(projectionMatrica, viewMatrica);

    var MVP = u_ViewMatrix = gl.getUniformLocation(glprog3, 'mvp');

    //var modelMatrica = translateMatrix([-1, -1, -2]);
    var modelMatrica = zRotateMatrix(angle);
    var temp = multiplyMatrix(perspectiveView, modelMatrica);

    gl.uniformMatrix4fv(MVP, false, temp);
    var data = new Float32Array([
        -0.5, 0.7, 0.0, 1.0,
        -0.5, -0.3, 0.0, 0.0,
        0.5, 0.7, 1.0, 1.0,
        0.5, -0.3, 1.0, 0.0,
    ]);
    var n = 4;
    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);


    var a_Position = gl.getAttribLocation(glprog3, 'a_Position');
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FLOATS * 4, 0);
    gl.enableVertexAttribArray(a_Position);

    var a_TexCoord = gl.getAttribLocation(glprog3, 'a_TexCoord');
    gl.vertexAttribPointer(a_TexCoord, 2, gl.FLOAT, false, FLOATS * 4, FLOATS * 2);
    gl.enableVertexAttribArray(a_TexCoord);

    var texture = gl.createTexture();

    var u_Sampler = gl.getUniformLocation(glprog3, 'u_Sampler');
    var image = new Image();

    image.src = 'dark.jpg';
    image.onload = function () {
        gl.useProgram(glprog3);

        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
        gl.activeTexture(gl.TEXTURE2);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
        gl.uniform1i(u_Sampler, 2);

    };
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);
    gl.useProgram(glprog);
}
////////////////////////////////////////

function MixedKunai(anlge) {
    gl.useProgram(glprog4);
    gl.clearColor(0, 0, 0, 1);
    var projectionMatrica = perspMatrix(perspVal, gl.canvas.width / gl.canvas.height, 0, 100);
    var viewMatrica = viewMatrix([eyeX, eyeY, eyeZ], [targetX, targetY, targetZ], [0, 1, 0]);
    perspectiveView = multiplyMatrix(projectionMatrica, viewMatrica);

    var MVP = u_ViewMatrix = gl.getUniformLocation(glprog4, 'mvp');

    var modelMatrica = translateMatrix([-2, 1, -2]);
    var modelMatrica1 = translateMatrix([-2, 1, -2]);
    //var modelMatricata2 = zRotateMatrix(angle / 12);
    var modelMatricata2 = zRotateMatrix(angle / 12);
    var newModel = multiplyMatrix(modelMatricata2, modelMatrica1);
    var temp = multiplyMatrix(perspectiveView, newModel); //var temp = multiplyMatrix(perspectiveView, modelMatrica);

    gl.uniformMatrix4fv(MVP, false, temp);


    var data = new Float32Array([
        -0.5, 0.5, 0.0, 1.0,
        -0.5, -0.5, 0.0, 0.0,
        0.5, 0.5, 1.0, 1.0,
        0.5, -0.5, 1.0, 0.0,
    ]);
    var n = 4;
    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);


    var a_Position = gl.getAttribLocation(glprog4, 'a_Position');
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FLOATS * 4, 0);
    gl.enableVertexAttribArray(a_Position);

    var a_TexCoord = gl.getAttribLocation(glprog4, 'a_TexCoord');
    gl.vertexAttribPointer(a_TexCoord, 2, gl.FLOAT, false, FLOATS * 4, FLOATS * 2);
    gl.enableVertexAttribArray(a_TexCoord);

    var texture = gl.createTexture();

    var u_Sampler = gl.getUniformLocation(glprog4, 'u_Sampler0');
    var image = new Image();

    image.src = 'kunai.jpg';
    image.onload = function () {
        gl.useProgram(glprog4);

        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
        gl.uniform1i(u_Sampler, 0);

    };
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);
    gl.useProgram(glprog);
}

function MixedShuriken() {
    gl.useProgram(glprog4);
    gl.clearColor(0, 0, 0, 1);
    var projectionMatrica = perspMatrix(perspVal, gl.canvas.width / gl.canvas.height, 0, 100);
    var viewMatrica = viewMatrix([eyeX, eyeY, eyeZ], [targetX, targetY, targetZ], [0, 1, 0]);
    perspectiveView = multiplyMatrix(projectionMatrica, viewMatrica);

    var MVP = u_ViewMatrix = gl.getUniformLocation(glprog4, 'mvp');

    var modelMatrica = translateMatrix([-2, -1, -2]);
    var temp = multiplyMatrix(perspectiveView, modelMatrica);

    gl.uniformMatrix4fv(MVP, false, temp);
    var data = new Float32Array([
        -0.5, 0.5, 0.0, 1.0,
        -0.5, -0.5, 0.0, 0.0,
        0.5, 0.5, 1.0, 1.0,
        0.5, -0.5, 1.0, 0.0,
    ]);
    var n = 4;
    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);


    var a_Position = gl.getAttribLocation(glprog4, 'a_Position');
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FLOATS * 4, 0);
    gl.enableVertexAttribArray(a_Position);

    var a_TexCoord = gl.getAttribLocation(glprog4, 'a_TexCoord');
    gl.vertexAttribPointer(a_TexCoord, 2, gl.FLOAT, false, FLOATS * 4, FLOATS * 2);
    gl.enableVertexAttribArray(a_TexCoord);

    var texture = gl.createTexture();

    var u_Sampler = gl.getUniformLocation(glprog4, 'u_Sampler1');
    var image = new Image();

    image.src = 'shuriken.jpg';
    image.onload = function () {
        gl.useProgram(glprog4);

        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
        gl.uniform1i(u_Sampler, 1);

    };
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);
    gl.useProgram(glprog);
}

/////////////////////////////////////////////////////

function mixingSh(angle) {
    gl.useProgram(glprog4);
    gl.clearColor(0, 0, 0, 1);
    var projectionMatrica = perspMatrix(perspVal, gl.canvas.width / gl.canvas.height, 0, 100);
    var viewMatrica = viewMatrix([eyeX, eyeY, eyeZ], [targetX, targetY, targetZ], [0, 1, 0]);
    perspectiveView = multiplyMatrix(projectionMatrica, viewMatrica);

    var MVP = u_ViewMatrix = gl.getUniformLocation(glprog4, 'mvp');

    var modelMatrica = translateMatrix([-2, -1, -2]);
    var rotirane = yRotateMatrix(angle);
    var newModel = multiplyMatrix(modelMatrica, rotirane);
    var temp = multiplyMatrix(perspectiveView, rotirane);  //var temp = multiplyMatrix(perspectiveView, modelMatrica);

    gl.uniformMatrix4fv(MVP, false, temp);
    var data = new Float32Array([
        -0.5, 0.5, 0.0, 1.0,
        -0.5, -0.5, 0.0, 0.0,
        0.5, 0.5, 1.0, 1.0,
        0.5, -0.5, 1.0, 0.0,
    ]);
    var n = 4;
    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);


    var a_Position = gl.getAttribLocation(glprog4, 'a_Position');
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FLOATS * 4, 0);
    gl.enableVertexAttribArray(a_Position);

    var a_TexCoord = gl.getAttribLocation(glprog4, 'a_TexCoord');
    gl.vertexAttribPointer(a_TexCoord, 2, gl.FLOAT, false, FLOATS * 4, FLOATS * 2);
    gl.enableVertexAttribArray(a_TexCoord);

    var texture = gl.createTexture();

    var u_Sampler = gl.getUniformLocation(glprog4, 'u_Sampler0');
    var u_Sampler0 = gl.getUniformLocation(glprog4, 'u_Sampler0');
    var image = new Image();



    image.src = 'shuriken.jpg';
    image.onload = function () {
        gl.useProgram(glprog4);

        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
        gl.uniform1i(u_Sampler, 0);


    };
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);
    gl.useProgram(glprog);
}
function rotAlone(angle) {
    gl.useProgram(glprog4);
    gl.clearColor(0, 0, 0, 1);
    var projectionMatrica = perspMatrix(perspVal, gl.canvas.width / gl.canvas.height, 0, 100);
    var viewMatrica = viewMatrix([eyeX, eyeY, eyeZ], [targetX, targetY, targetZ], [0, 1, 0]);
    perspectiveView = multiplyMatrix(projectionMatrica, viewMatrica);

    var MVP = u_ViewMatrix = gl.getUniformLocation(glprog4, 'mvp');

    var modelMatrica = translateMatrix([-2, -1, -2]);
    var rotirane = yRotateMatrix(angle);
    var newModel = multiplyMatrix(modelMatrica, rotirane);
    var temp = multiplyMatrix(perspectiveView, rotirane);  //var temp = multiplyMatrix(perspectiveView, modelMatrica);

    gl.uniformMatrix4fv(MVP, false, temp);
    var data = new Float32Array([
        -0.3, 0.7, 0.0, 1.0,
        -0.3, -0.3, 0.0, 0.0,
        0.7, 0.7, 1.0, 1.0,
        0.7, -0.3, 1.0, 0.0,
    ]);
    var n = 4;
    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);


    var a_Position = gl.getAttribLocation(glprog4, 'a_Position');
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FLOATS * 4, 0);
    gl.enableVertexAttribArray(a_Position);

    var a_TexCoord = gl.getAttribLocation(glprog4, 'a_TexCoord');
    gl.vertexAttribPointer(a_TexCoord, 2, gl.FLOAT, false, FLOATS * 4, FLOATS * 2);
    gl.enableVertexAttribArray(a_TexCoord);

    var texture = gl.createTexture();

    var u_Sampler = gl.getUniformLocation(glprog4, 'u_Sampler0');
    var u_Sampler0 = gl.getUniformLocation(glprog4, 'u_Sampler0');
    var image = new Image();



    image.src = 'shuriken.jpg';
    image.onload = function () {
        gl.useProgram(glprog4);

        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
        gl.uniform1i(u_Sampler, 0);


    };
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);
    gl.useProgram(glprog);
}


function mixingSh2(angle) {
    gl.useProgram(glprog5);
    gl.clearColor(0, 0, 0, 1);
    var projectionMatrica = perspMatrix(perspVal, gl.canvas.width / gl.canvas.height, 0, 100);
    var viewMatrica = viewMatrix([eyeX, eyeY, eyeZ], [targetX, targetY, targetZ], [0, 1, 0]);
    perspectiveView = multiplyMatrix(projectionMatrica, viewMatrica);

    var MVP = u_ViewMatrix = gl.getUniformLocation(glprog5, 'mvp');

    var modelMatrica = translateMatrix([-2, -1, -2]);
    // var rotirane = yRotateMatrix(angle);
    //var newModel = multiplyMatrix(rotirane, modelMatrica);
    var temp = multiplyMatrix(perspectiveView, modelMatrica);  //var temp = multiplyMatrix(perspectiveView, modelMatrica);

    gl.uniformMatrix4fv(MVP, false, temp);
    var data = new Float32Array([
        -0.5, 0.5, 0.0, 1.0,
        -0.5, -0.5, 0.0, 0.0,
        0.5, 0.5, 1.0, 1.0,
        0.5, -0.5, 1.0, 0.0,
    ]);
    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);


    var a_Position = gl.getAttribLocation(glprog5, 'a_Position');
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FLOATS * 4, 0);
    gl.enableVertexAttribArray(a_Position);

    var a_TexCoord = gl.getAttribLocation(glprog5, 'a_TexCoord');
    gl.vertexAttribPointer(a_TexCoord, 2, gl.FLOAT, false, FLOATS * 4, FLOATS * 2);
    gl.enableVertexAttribArray(a_TexCoord);

    var texture = gl.createTexture();

    var u_Sampler = gl.getUniformLocation(glprog5, 'u_Sampler');
    //var u_Sampler0 = gl.getUniformLocation(glprog5, 'u_Sampler0');
    var image = new Image();



    image.src = 'victory.jpg';
    image.onload = function () {
        gl.useProgram(glprog5);

        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
        gl.uniform1i(u_Sampler, 0);


    };
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    gl.useProgram(glprog);
}
//shuriken 2
function mixingSh1(angle) {
    gl.useProgram(glprog4);
    gl.clearColor(0, 0, 0, 1);
    var projectionMatrica = perspMatrix(perspVal, gl.canvas.width / gl.canvas.height, 0, 100);
    var viewMatrica = viewMatrix([eyeX, eyeY, eyeZ], [targetX, targetY, targetZ], [0, 1, 0]);
    perspectiveView = multiplyMatrix(projectionMatrica, viewMatrica);

    var MVP = u_ViewMatrix = gl.getUniformLocation(glprog4, 'mvp');

    var modelMatrica = translateMatrix([-3, -1, -2]);
    var rotirane = yRotateMatrix(angle);
    var newModel = multiplyMatrix(rotirane, modelMatrica);
    var temp = multiplyMatrix(perspectiveView, newModel);  //var temp = multiplyMatrix(perspectiveView, modelMatrica);

    gl.uniformMatrix4fv(MVP, false, temp);
    var data = new Float32Array([
        -0.5, 0.5, 0.0, 1.0,
        -0.5, -0.5, 0.0, 0.0,
        0.5, 0.5, 1.0, 1.0,
        0.5, -0.5, 1.0, 0.0,
    ]);
    var n = 4;
    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);


    var a_Position = gl.getAttribLocation(glprog4, 'a_Position');
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FLOATS * 4, 0);
    gl.enableVertexAttribArray(a_Position);

    var a_TexCoord = gl.getAttribLocation(glprog4, 'a_TexCoord');
    gl.vertexAttribPointer(a_TexCoord, 2, gl.FLOAT, false, FLOATS * 4, FLOATS * 2);
    gl.enableVertexAttribArray(a_TexCoord);

    var texture = gl.createTexture();

    var u_Sampler = gl.getUniformLocation(glprog4, 'u_Sampler0');
    //var u_Sampler0 = gl.getUniformLocation(glprog4, 'u_Sampler0');
    var image = new Image();



    image.src = 'shuriken.jpg';
    image.onload = function () {
        gl.useProgram(glprog4);

        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
        gl.uniform1i(u_Sampler, 0);


    };
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);
    gl.useProgram(glprog);
}
//shuriken3
function mixingSh1(angle) {
    gl.useProgram(glprog4);
    gl.clearColor(0, 0, 0, 1);
    var projectionMatrica = perspMatrix(perspVal, gl.canvas.width / gl.canvas.height, 0, 100);
    var viewMatrica = viewMatrix([eyeX, eyeY, eyeZ], [targetX, targetY, targetZ], [0, 1, 0]);
    perspectiveView = multiplyMatrix(projectionMatrica, viewMatrica);

    var MVP = u_ViewMatrix = gl.getUniformLocation(glprog4, 'mvp');

    var modelMatrica = translateMatrix([-4, -1, -2]);
    var rotirane = yRotateMatrix(angle);
    var newModel = multiplyMatrix(rotirane, modelMatrica);
    var temp = multiplyMatrix(perspectiveView, newModel);  //var temp = multiplyMatrix(perspectiveView, modelMatrica);

    gl.uniformMatrix4fv(MVP, false, temp);
    var data = new Float32Array([
        -0.5, 0.5, 0.0, 1.0,
        -0.5, -0.5, 0.0, 0.0,
        0.5, 0.5, 1.0, 1.0,
        0.5, -0.5, 1.0, 0.0,
    ]);
    var n = 4;
    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);


    var a_Position = gl.getAttribLocation(glprog4, 'a_Position');
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FLOATS * 4, 0);
    gl.enableVertexAttribArray(a_Position);

    var a_TexCoord = gl.getAttribLocation(glprog4, 'a_TexCoord');
    gl.vertexAttribPointer(a_TexCoord, 2, gl.FLOAT, false, FLOATS * 4, FLOATS * 2);
    gl.enableVertexAttribArray(a_TexCoord);

    var texture = gl.createTexture();

    var u_Sampler = gl.getUniformLocation(glprog4, 'u_Sampler1');
    var u_Sampler0 = gl.getUniformLocation(glprog4, 'u_Sampler0');
    var image = new Image();



    image.src = 'shuriken.jpg';
    image.onload = function () {
        gl.useProgram(glprog4);

        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
        gl.uniform1i(u_Sampler, 0);


    };
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);
    gl.useProgram(glprog);
}
function mixingKn() {
    gl.useProgram(glprog4);
    gl.clearColor(0, 0, 0, 1);
    var projectionMatrica = perspMatrix(perspVal, gl.canvas.width / gl.canvas.height, 0, 100);
    var viewMatrica = viewMatrix([eyeX, eyeY, eyeZ], [targetX, targetY, targetZ], [0, 1, 0]);
    perspectiveView = multiplyMatrix(projectionMatrica, viewMatrica);

    var MVP = u_ViewMatrix = gl.getUniformLocation(glprog4, 'mvp');

    var modelMatrica = translateMatrix([-2, -1, -2]);
    var temp = multiplyMatrix(perspectiveView, modelMatrica);

    gl.uniformMatrix4fv(MVP, false, temp);
    var data = new Float32Array([
        -0.5, 0.5, 0.0, 1.0,
        -0.5, -0.5, 0.0, 0.0,
        0.5, 0.5, 1.0, 1.0,
        0.5, -0.5, 1.0, 0.0,
    ]);
    var n = 4;
    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);


    var a_Position = gl.getAttribLocation(glprog4, 'a_Position');
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FLOATS * 4, 0);
    gl.enableVertexAttribArray(a_Position);

    var a_TexCoord = gl.getAttribLocation(glprog4, 'a_TexCoord');
    gl.vertexAttribPointer(a_TexCoord, 2, gl.FLOAT, false, FLOATS * 4, FLOATS * 2);
    gl.enableVertexAttribArray(a_TexCoord);

    var texture = gl.createTexture();

    var u_Sampler = gl.getUniformLocation(glprog4, 'u_Sampler1');
    var image = new Image();

    image.src = 'kunai.jpg';
    image.onload = function () {
        gl.useProgram(glprog4);

        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
        gl.uniform1i(u_Sampler, 1);
        //gl.activeTexture(gl.TEXTURE1);
        //gl.uniform1i(u_Sampler1, 0);


    };
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);
    gl.useProgram(glprog);
}

function startInit(canvas) {

    time = now();
    dTime = time - oldTime;
    oldTime = time;
    //gl.enable(gl.DEPTH_TEST);

    if (flagCenter == false) {
        filling();
        fillingTextureInitBackDragon();
        fillingTextureInitBackDarkMagician();
        fillingTextureInitBlueDarkMagician();
        //първо ниво ножовете вдясно
        var right = Knives();
        // цвета за изчистване на платното за рисуване
        gl.clearColor(sin(clearCol), sin(clearCol), sin(clearCol), 1);
        clearCol += clearIncrement;

        lookAt([eyeX, eyeY, eyeZ], [targetX, targetY, targetZ], [0, 1, 0]);

        identity();
        scale([1, 2, 1]);
        zRotate(angle);
        useMatrix();

        //флаг- за рисуване на фрагментите
        gl.uniform1f(uflagFrag, triugulnik); //рисуване на триъгълниците
        //флаг - за рисуване при върховете
        gl.uniform1f(uflagVert, triugulnik); // рисуване на триъгълниците

        gl.viewport(0, 0, 1024, 1024);
        perspective(perspVal, gl.canvas.width / gl.canvas.height, 0, 100);

        //готвим се за рисуване
        //gl.clear(gl.COLOR_BUFFER_BIT);

        // рисуваме триъгълниците на първите ножове
        gl.drawArrays(gl.TRIANGLES, 0, right);

        identity();
        scale([1, 2, 1]);
        translate([-1, 0, -2]);
        //zRotate(-angle);
        useMatrix();

        //ниво едно - първия телепорт
        var firstTarget = Target();
        gl.drawArrays(gl.TRIANGLES, 0, firstTarget);

        //ниво едно - левите новоже
        var left = Knives();
        identity();
        scale([1, 2, 1]);
        translate([-2, 0, 0]);
        zRotate(-angle);
        useMatrix();
        //рисуване
        gl.drawArrays(gl.TRIANGLES, 0, left);

        MixedKunai(angle);
        MixedShuriken();
        gl.useProgram(glprog);

        //кадъра за анимацията
        angle += angleIncrement;
    }
    //при прехода между двете нива 
    if (once == false && flagCenter == true) {
        gl.useProgram(glprog);

        reset(); once = true;
    }
    //почистване на първото ниво и второ ниво 
    if (flagCenter == true) {



        gl.useProgram(glprog);

        var right = ClearedKnives();
        // цвета за изчистване на платното за рисуване
        gl.clearColor(sin(clearCol), sin(clearCol), sin(clearCol), 1);
        clearCol += clearIncrement;

        lookAt([eyeX, eyeY, eyeZ], [targetX, targetY, targetZ], [0, 1, 0]);
        //uModelMat = translateMatrix([0.2, 0.0, 0.0]);

        identity();
        scale([1, 2, 1]);
        //zRotate(angle);
        useMatrix();

        //флаг- за рисуване на фрагментите
        gl.uniform1f(uflagFrag, triugulnik); //рисуване на триъгълниците
        //флаг - за рисуване при върховете
        gl.uniform1f(uflagVert, triugulnik); // рисуване на триъгълниците

        //gl.viewport(0, 0, 1024, 1024);
        perspective(perspVal, gl.canvas.width / gl.canvas.height, 0, 100);

        gl.clear(gl.COLOR_BUFFER_BIT);
        // рисуваме триъгълниците
        gl.drawArrays(gl.TRIANGLES, 0, right);

        identity();
        scale([1, 2, 1]);
        translate([-1, 0, -2]);
        //zRotate(-angle);
        useMatrix();

        //изчистването на активните , правейки ги не активни , и светещи, като 
        //крайна чекпойнт
        var firstTarget = NonTarget();
        gl.drawArrays(gl.TRIANGLES, 0, firstTarget);

        identity();
        scale([1, 2, 1]);
        translate([3, 0, -2]);
        //zRotate(-angle);
        useMatrix();

        //осветителните тела за посоката
        var lPathSecond = LightPath();
        gl.drawArrays(gl.TRIANGLES, 0, lPathSecond);

        identity();
        scale([1, 2, 1]);
        translate([8, 0, -2]);
        //zRotate(-angle);
        useMatrix();

        var lPathFirst = LightPath();
        gl.drawArrays(gl.TRIANGLES, 0, lPathFirst);

        identity();
        scale([1, 2, 1]);
        translate([5, 0, -2.5]);
        //zRotate(-angle);
        useMatrix();

        var lPathThird = LightPath();
        gl.drawArrays(gl.TRIANGLES, 0, lPathThird);

        //изчистените кинжали
        var left = ClearedKnives();
        identity();
        scale([1, 2, 1]);
        translate([-2, 0, 0]);
        //zRotate(-angle);
        useMatrix();
        gl.drawArrays(gl.TRIANGLES, 0, left);

        //новия кадър за анамицаията 
        angle += angleIncrement;


        // второто ниво
        if (lvl2 == false) {
            lvl2 = true;
            //местене на камерата и подготовка
            //за началото на нивото
            requestAnimationFrame(secondRound);
        }

        ////////////////////
        mixingSh(angle);
        rotAlone(angle);
        mixingSh2(angle);
        mixingKn();
        mixingSh1(angle);
        ////////////


        //втория триъгълник от второ ниво
        identity();
        scale([1, 2, 1]);
        translate([6.1, 0.8, 3.0]);
        yRotate(90);
        useMatrix();

        var secondTarget = Target();
        gl.drawArrays(gl.TRIANGLES, 0, secondTarget);

        //новата поредица кинжаи от 2рото ниво
        var leftNew = Knives();
        identity();
        scale([1, 2, 1]);
        translate([4.0, 0.7, 3.0]);
        xRotate(90);
        zRotate(-angle);
        //yRotate(-angle);
        useMatrix();
        gl.drawArrays(gl.TRIANGLES, 0, leftNew);

        //вторите допълнителни , малко под тези над
        var leftNewSecondary = Knives();
        identity();
        scale([1, 2, 1]);
        translate([3.5, 0.7, 3.0]);
        xRotate(90);
        zRotate(-angle);
        //yRotate(-angle);
        useMatrix();
        gl.drawArrays(gl.TRIANGLES, 0, leftNewSecondary);

        //дясно този по долния
        var rightNew = Knives();
        identity();
        scale([1, 2, 1]);
        translate([2.7, 0.7, 3.0]);
        xRotate(90);
        zRotate(-angle);
        //yRotate(-angle);
        useMatrix();
        gl.drawArrays(gl.TRIANGLES, 0, rightNew);

        var rightNewSecondary = Knives();
        identity();
        scale([1, 2, 1]);
        translate([3.5, 0.7, 3.0]);
        xRotate(90);
        zRotate(-angle - 2);
        //yRotate(-angle);
        useMatrix();
        gl.drawArrays(gl.TRIANGLES, 0, rightNewSecondary);

        //оправи чекинга 
        angle += angleIncrement;
    }

    //window.alert("wait");
    //debug.utils.BreakPoint();
    //console.log(gameOver);

    //проверка за края иили нова анамицаия
    //и светенето на финиширания телепорт 
    // с различно темпо от индикаторите
    if (gameOver == false && lives > 0) {
        requestAnimationFrame(startInit);
        anNonTarg += anNonTagetInrement;
    }
    else {
        if (lives <= 0)
            finishLosing();
        else {
            finishWining();
        }
    }

}
//нагласяне на камерката за 
//преди второто ниво
//и модифициране на ресет-а
secondRoundIntroExitFlag = false;
perspIncrement = 0.01;
function secondRound() {
    //новите времена
    // за движението
    time1 = now();
    dTime1 = time - oldTime;
    oldTime1 = time;

    if (perspVal <= 4.7099) {
        perspVal += perspIncrement;
    }
    //местене
    perspective(perspVal, gl.canvas.width / gl.canvas.height, 0, 100);
    if (targetZ <= 2.60) {
        targetZ += 0.2;
    }

    if (eyeX > -151) {
        eyeX -= 2;
    }
    else {
        secondRoundIntroExitFlag = true;
    }
    //местене
    lookAt([eyeX, eyeY, eyeZ], [targetX, targetY, targetZ], [0, 1, 0]);

    if (!secondRoundIntroExitFlag)
        requestAnimationFrame(secondRound);
    //кеширане на новия нормален режим
    else {
        window.alert("round 2 ");
        clearCol = -0.50;
        clearIncrement = 0;
        initalTargetX = targetX;
        initalTargetY = targetY;
        initalTargetZ = targetZ;
        perspValDefault = perspVal;
        initialEyeX = eyeX;
        initialEyeY = eyeY;
        initialEyeZ = eyeZ;
    }
}
//край
function finishLosing() {
    gl.clearColor(1.0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
}
//край
function finishWining() {
    gl.clearColor(0.0, 1.0, 0.0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
}
function success(tX, perz) {
    if (checkToTakeLives(-1.051, 0.3999)) {
        document.write("cleared");
        //debug.utils.BreakPoint();
    }
}

//ако излизаме от картаат 
//или левите новжове вляво
function checkToTakeLivesLeft(tX, perz) {
    if (targetX < tX && perspVal < perz)
        return true;

    else return false;
}
//ако излизаме от картата
//или десните ножове на дясно
function checkToTakeLivesRight(tX, perz) {
    if (targetX > tX && perspVal > perz)
        return true;

    else return false;
}

function Knives() {
    var data = [
        0.0, 0.5, -0.4, 1.0, 0.0, 0.0, // отзад
        -0.5, -0.5, -0.4, 0.4, 1.0, 0.4,
        0.5, -0.5, -0.4, 1.0, 0.0, 0.4,

        0.5, 0.4, -0.2, 1.0, 0.0, 0.4, // среда
        -0.5, 0.4, -0.2, 1.0, 1.0, 0.4,
        0.0, -0.6, -0.2, 1.0, 0.0, 0.4,

        0.0, 0.5, 0.0, 1.0, 0.0, 1.0,  // отпред
        -0.5, -0.5, 0.0, 0.4, 0.4, 1.0,
        // 0.5, -0.5, 0.0, 1.0, 0.4, 0.4,
        0.0, 0.0, 0.0, 1.0, 0.4, 0.4,

        0.0, 0.5, 0.0, 1.0, 0.4, 1.0,  // пред
        -0.5, -0.5, 0.0, 0.4, 0.4, 1.0,
        // 0.5, -0.5, 0.0, 1.0, 0.4, 0.4,
        -0.5, 0.5, 0.0, 1.0, 0.4, 0.4

    ];

    //буфера за данните
    var buffer = gl.createBuffer();

    //пишем координатите и цветчето в буферчето
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);

    //пращаме данните
    gl.vertexAttribPointer(aPosition, 3, gl.FLOAT, false, FLOATS * 6, 0);
    gl.enableVertexAttribArray(aPosition);

    //позволямва преноса
    gl.vertexAttribPointer(aColor, 3, gl.FLOAT, false, FLOATS * 6, FLOATS * 3);
    gl.enableVertexAttribArray(aColor);

    //откачане на буфера , за впоследващо писане
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    //бройката, на конкретия обект
    return Knive;
}

// изчистените и в последствие 
// ставащи статични
// само виж оправи цвета
function ClearedKnives() {
    var data = [
        0.0, 0.5, -0.4, 0.0, 1.0, 0.0, // зад
        -0.5, -0.5, -0.4, 1.0, 0.0, 1.0,
        0.5, -0.5, -0.4, 0.0, 1.0, 0.0,

        0.5, 0.4, -0.2, 0.0, 1.0, 0.0, // среда
        -0.5, 0.4, -0.2, 1.0, 0.0, 0.0,
        0.0, -0.6, -0.2, 0.0, 0.0, 0.0,

        0.0, 0.5, 0.0, 1.0, 0.0, 0.0,  // пред
        -0.5, -0.5, 0.0, 0.0, 1.0, 0.0,
        // 0.5, -0.5, 0.0, 0.0, 1.0, 0.0,
        0.0, 0.0, 0.0, 0.0, 1.0, 0.0,

        0.0, 0.5, 0.0, 0.0, 1.0, 0.0,  // шурикена
        -0.5, -0.5, 0.0, 1.0, 1.0, 0.0,
        // 0.5, -0.5, 0.0, 1.0, 0.4, 0.4,
        -0.5, 0.5, 0.0, 0.0, 1.0, 0.0
    ];

    var buffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);

    gl.vertexAttribPointer(aPosition, 3, gl.FLOAT, false, FLOATS * 6, 0);
    gl.enableVertexAttribArray(aPosition);

    gl.vertexAttribPointer(aColor, 3, gl.FLOAT, false, FLOATS * 6, FLOATS * 3);
    gl.enableVertexAttribArray(aColor);

    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    return Knive;
}

//зеления телепорт , който целя
// сложи малко бяло да прилича на телепорт
function Target() {
    var data = [
        0.0, 0.5, -0.4, 1.0, 1.0, 1.0,
        -0.5, -0.5, -0.4, 1.0, 1.0, 1.0,
        0.5, -0.5, -0.4, 0.0, 1.0, 0.0,
    ];
    var buffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);

    gl.vertexAttribPointer(aPosition, 3, gl.FLOAT, false, FLOATS * 6, 0);
    gl.enableVertexAttribArray(aPosition);

    gl.vertexAttribPointer(aColor, 3, gl.FLOAT, false, FLOATS * 6, FLOATS * 3);
    gl.enableVertexAttribArray(aColor);

    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    return Targ;
}

//финиширан телепорт
//индикиран , че е завършен
function NonTarget() {
    var data = [
        0.0, 0.5, -0.4, sin(anNonTarg), 0.0, 0.0,
        -0.5, -0.5, -0.4, 0.0, sin(anNonTarg), 0.0,
        0.5, -0.5, -0.4, 0.0, 0.0, sin(anNonTarg),
    ];
    var buffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);

    gl.vertexAttribPointer(aPosition, 3, gl.FLOAT, false, FLOATS * 6, 0);
    gl.enableVertexAttribArray(aPosition);

    gl.vertexAttribPointer(aColor, 3, gl.FLOAT, false, FLOATS * 6, FLOATS * 3);
    gl.enableVertexAttribArray(aColor);

    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    return Targ;
}

//пътчеката светлина
//блокираща долния слой , само сложи блокирането и на горния
//и на долния и за заобикалянето
// ускоряваме , темпото в сравнение с телепорта , който вече не функционира 
function LightPath() {
    var data = [
        0.0, 0.5, -0.4, sin(anNonTarg * 2), sin(anNonTarg * 2), 0.1,
        -0.5, -0.5, -0.4, 0.0, 0.0, 0.1,
        0.5, -0.5, -0.4, sin(anNonTarg * 2), sin(anNonTarg * 2), 0.1,
    ];
    var buffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);

    gl.vertexAttribPointer(aPosition, 3, gl.FLOAT, false, FLOATS * 6, 0);
    gl.enableVertexAttribArray(aPosition);

    gl.vertexAttribPointer(aColor, 3, gl.FLOAT, false, FLOATS * 6, FLOATS * 3);
    gl.enableVertexAttribArray(aColor);

    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    return Targ;
}
//в html отначало отбележи
function updateLife() {
    document.write(lives);
}

//приключването на първото ниво
// офсета си виж на левия нож
function levelUp(tXRight, perzRight, txLeft, perzLeft) {
    //лява част на целта                    //дясна част на целта 
    if ((targetX <= -0.751 && perspVal <= 0.499) && (targetX >= -1.251 && perspVal >= 0.299)) {
        window.alert("LEVEL UP ");
        flagCenter = true;
    }
}

function keyDown(event) {
    // // стрелка наляво
    if (event.keyCode == 37) {
        targetX -= 0.05;
    }
    // // стрелка надясно
    if (event.keyCode == 39) {
        targetX += 0.10;
    }
    // // стрелка напред
    if (event.keyCode == 38) {
        perspVal -= 0.1;
    }
    if (event.keyCode == 40) {
        perspVal += 0.1;
    }

    // q w a s z x = координатите на окото
    //q
    if (event.keyCode == 81) {
        eyeX += 2.0;
    }
    //w
    if (event.keyCode == 87) {
        eyeX -= 2.0;
    }
    //a
    if (event.keyCode == 65) {
        eyeY += 2.0;
    }
    //s
    if (event.keyCode == 83) {
        eyeY -= 2;
    }
    //z
    if (event.keyCode == 90) {
        eyeZ += 2;
    }
    //x
    if (event.keyCode == 88) {
        eyeZ -= 2;
    }
    //e
    if (event.keyCode == 69) {
        targetX += 0.10;
    }
    //r
    if (event.keyCode == 82) {
        targetX -= 0.05;
    }
    //d
    if (event.keyCode == 68) {
        targetY += 0.10;
    }
    //f
    if (event.keyCode == 70) {
        targetY -= 0.05;
    }
    //c
    if (event.keyCode == 67) {
        targetZ += 0.10;
    }
    //v
    if (event.keyCode == 86) {
        targetZ -= 0.05;
    }
    //j - рестартира
    if (event.keyCode == 74) {
        reset();
        console.clear();
    }

    console.log(eyeX + " " + eyeY + " " + eyeZ);
    //debug.utils.BreakPoint();
    console.log(perspVal);
    //debug.utils.BreakPoint();
    console.log(targetX + " " + targetY + " " + targetZ);
    //console.log(event);
    //var canvas = document.getElementById("webgl");
    //startInit(canvas);
}

function keyUp(event) {
    if (flagCenter == false) {
        // левите ножове
        if (checkToTakeLivesLeft(-1.75, 0.29990) == true)
            reset();
        // левите ножове
        if (checkToTakeLivesLeft(-2.75, 1.0990) == true)
            reset();
        // левите ножове
        if (checkToTakeLivesLeft(-2.30, 0.4990) == true)
            reset();
        if (levelUp())
            reset();
        // десните ножове
        if (perspVal <= 0.399 && targetX >= 0.149)
            reset();
        // десните ножове
        //if (checkToTakeLivesRight(0.049, 0.499) == true)
        //   reset();
    }
    else { // второ ниво 
        if (levelUpLVL2()) {
            gameOver = true;
            finishWining();
        }
        //вътре в ножовете
        //между част от най-лявото острие и 
        // част до най-дясното острие
        if ((targetX >= 2.7490 && perspVal >= 0.21989) && (targetX <= 5.899 && perspVal <= 0.3198)) {
            reset();
        }
    }

    console.log("key UP");
    //resetEye();
    //debug.utils.BreakPoint();
}
//финишираш 2рия левъл
// сложи отгоре режещи 
//диаметрално противоположно надолу
function levelUpLVL2(tXRight, perzRight, txLeft, perzLeft) {
    //лява част на целта                    //дясна част на целта 
    if ((targetX <= 8.2989 && perspVal <= 0.4198) && (targetX >= 6.90 && perspVal >= 0.2198)) {
        window.alert("victory");
        return true;
    }
}

//отстояване на началната позиция
//и вадене на живот
function reset() {
    resetPersp();
    resetEye();
    resetTarget();
    lives--;
    window.alert("брой животи = " + lives);
}
function resetEye() {
    eyeX = initialEyeX;
    eyeY = initialEyeY;
    eyeZ = initialEyeZ;
}
function resetTarget() {
    targetX = initalTargetX;
    targetY = initalTargetY;
    targetZ = initalTargetZ;
}
function resetPersp() {
    perspVal = perspValDefault;
}


//debug.utils.BreakPoint(global);
//debug.utils.BreakPoint(gl);
//размера на пикселите не е правилен
//аспекта е различен
//debug.utils.BreakPoint(textureArray(glprogSecond).texture);

// function externalWeapons() {
//     // //флаг- за рисуване на фрагментите
//     // gl.uniform1f(uflagFrag, weapon); //рисуване на катана
//     // //флаг - за рисуване при върховете
//     // gl.uniform1f(uflagVert, weapon); // рисуване на катана
//     ////debug.utils.BreakPoint();

//     // var k1 = Weapon();
//     // identity();
//     // translate([-2, 0.0, 0.0]);
//     // yRotate(-45);
//     // useMatrix();
//     // gl.drawArrays(gl.TRIANGLE_STRIP, 0, k1); // лява катана, над средния триъгълник

//     // var k2 = Weapon();
//     // identity();
//     // translate([2, 0.0, 0.0]);
//     // yRotate(45);
//     // useMatrix();
//     // gl.drawArrays(gl.TRIANGLE_STRIP, 0, k2); //втората катана


//     // var n = triugulnici();
//     // identity();
//     // scale([1, 2, 1]);
//     // xRotate(20);
//     // useMatrix();
//     // //флаг- за рисуване на фрагментите
//     // gl.uniform1f(uflagFrag, triugulnik); //рисуване на триъгълниците
//     // //флаг - за рисуване при върховете
//     // gl.uniform1f(uflagVert, triugulnik); // рисуване на триъгълниците
//     // gl.drawArrays(gl.TRIANGLES, 0, n);
// }
// function Weapon() {
//     // var data = [
//     //     //квадрата и неговия мапинг
//     //     -0.5, 0.5, 0.0, 0.0, 1.0,
//     //     - 0.5, -0.5, 0.0, 0.0, 0.0,
//     //     0.5, 0.5, 0.0, 1.0, 1.0,
//     //     0.5, -0.5, 0.0, 1.0, 0.0,
//     // ];
//     // var buffer = gl.createBuffer();
//     // gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
//     // gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);

//     // gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, FLOATS * 4, 0);
//     // gl.enableVertexAttribArray(aPosition);

//     // gl.vertexAttribPointer(aST, 2, gl.FLOAT, false, FLOATS * 4, FLOATS * 2);
//     // gl.enableVertexAttribArray(aST);

//     // gl.uniform1i(uSampler, 0);
//     // gl.activeTexture(gl.TEXTURE0);

//     //debug.utils.BreakPoint();
//     // loadTexture('katana.jpg');
//     //debug.utils.BreakPoint();

//     // gl.uniform1i(uSampler, 0);
//     // gl.bindBuffer(gl.ARRAY_BUFFER, null);

//     // return 4;
// }

// function checkProg2() {
//     if (!glSecondProg.uModelMatrix2 || !glSecondProg.uProjectionMatrix2 ||
//         !glSecondProg.uViewMatrix2 || !glSecondProg.uNormalMatrix2) {
//         //debug.utils.BreakPoint();
//     }
// }