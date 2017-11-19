(function() {

  // Slightly modified version of http://www.khronos.org/webgl/wiki/Tutorial
  function init(scene) {
    // Initialize
    var gl = WebGLUtils.setupWebGL(scene.canvas);
    if (!gl) {
      return;
    }

    scene.program = simpleSetup(
      gl,
      // The ids of the vertex and fragment shaders
      "webgl_vshader", "webgl_bland_fshader",
      // The vertex attribute names used by the shaders.
      // The order they appear here corresponds to their index
      // used later.
      [ "vNormal", "vColor", "vPosition"],
      // The clear color and depth values
      [ 0, 0, 0, 0 ], 10000);

    // Set up a uniform variable for the shaders
    gl.uniform3f(gl.getUniformLocation(scene.program, "lightDir"), 0, 0, 1);

    // Create a box. On return 'gl' contains a 'box' property with
    // the BufferObjects containing the arrays for vertices,
    // normals, texture coords, and indices.
    scene.box = makeBox(gl);

    // Set up the array of colors for the cube's faces
    var colors = new Uint8Array(
      [  0, 0, 1, 1,   0, 0, 1, 1,   0, 0, 1, 1,   0, 0, 1, 1,     // v0-v1-v2-v3 front
        1, 0, 0, 1,   1, 0, 0, 1,   1, 0, 0, 1,   1, 0, 0, 1,     // v0-v3-v4-v5 right
        0, 1, 0, 1,   0, 1, 0, 1,   0, 1, 0, 1,   0, 1, 0, 1,     // v0-v5-v6-v1 top
        1, 1, 0, 1,   1, 1, 0, 1,   1, 1, 0, 1,   1, 1, 0, 1,     // v1-v6-v7-v2 left
        1, 0, 1, 1,   1, 0, 1, 1,   1, 0, 1, 1,   1, 0, 1, 1,     // v7-v4-v3-v2 bottom
        0, 1, 1, 1,   0, 1, 1, 1,   0, 1, 1, 1,   0, 1, 1, 1 ]    // v4-v7-v6-v5 back
    );

    // Set up the vertex buffer for the colors
    scene.box.colorObject = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, scene.box.colorObject);
    gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);

    // Create some matrices to use later and save their locations in the shaders
    scene.mvMatrix = new J3DIMatrix4();
    scene.u_normalMatrixLoc = gl.getUniformLocation(scene.program, "u_normalMatrix");
    scene.normalMatrix = new J3DIMatrix4();
    scene.u_modelViewProjMatrixLoc =
      gl.getUniformLocation(scene.program, "u_modelViewProjMatrix");
    scene.mvpMatrix = new J3DIMatrix4();

    // Enable all of the vertex attribute arrays.
    gl.enableVertexAttribArray(0);
    gl.enableVertexAttribArray(1);
    gl.enableVertexAttribArray(2);

    // Set up all the vertex attributes for vertices, normals and colors
    gl.bindBuffer(gl.ARRAY_BUFFER, scene.box.vertexObject);
    gl.vertexAttribPointer(2, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, scene.box.normalObject);
    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, scene.box.colorObject);
    gl.vertexAttribPointer(1, 4, gl.UNSIGNED_BYTE, false, 0, 0);

    // Bind the index array
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, scene.box.indexObject);

    return gl;
  }

  function reshape(scene, gl) {
    var canvas = scene.canvas;

    // Set the viewport and projection matrix for the scene
    gl.viewport(0, 0, canvas.width, canvas.height);
    scene.perspectiveMatrix = new J3DIMatrix4();
    scene.perspectiveMatrix.perspective(30, canvas.width/canvas.height, 1, 10000);
    scene.perspectiveMatrix.lookat(0, 0, 7, 0, 0, 0, 0, 1, 0);
  }

  function drawPicture(scene, gl) {
    // Make sure the canvas is sized correctly.
    reshape(scene, gl);

    // Clear the canvas
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Make a model/view matrix.
    scene.mvMatrix.makeIdentity();
    scene.mvMatrix.rotate(20, 1,0,0);
    scene.mvMatrix.rotate(scene.currentAngle, 0,1,0);

    // Construct the normal matrix from the model-view matrix and pass it in
    scene.normalMatrix.load(scene.mvMatrix);
    scene.normalMatrix.invert();
    scene.normalMatrix.transpose();
    scene.normalMatrix.setUniform(gl, scene.u_normalMatrixLoc, false);

    // Construct the model-view * projection matrix and pass it in
    scene.mvpMatrix.load(scene.perspectiveMatrix);
    scene.mvpMatrix.multiply(scene.mvMatrix);
    scene.mvpMatrix.setUniform(gl, scene.u_modelViewProjMatrixLoc, false);

    // Draw the cube
    gl.drawElements(gl.LINE_STRIP, scene.box.numIndices, gl.UNSIGNED_BYTE, 0);

    scene.currentAngle += scene.incAngle;
    if (scene.currentAngle > 360)
      scene.currentAngle -= 360;
  }

  window.samples.webgl_spinning_wireframe_cube = {

    initialize: function(canvas) {
      var scene = { canvas: canvas };

      canvas.addEventListener('webglcontextlost', handleContextLost, false);
      canvas.addEventListener('webglcontextrestored', handleContextRestored, false);

      canvas.width = sample_defaults.width;
      canvas.height = sample_defaults.height;

      var gl = init(scene);
      if (!gl) {
        return;
      }

      scene.currentAngle = 0;
      scene.incAngle = 0.5;

      var instance = { active: false };
      function animate() {
        if(instance.active && !sample_defaults.paused)
          drawPicture(scene, gl);
        instance.requestId = window.requestAnimFrame(animate, canvas);
      }

      animate();

      function handleContextLost(e) {
        e.preventDefault();
        if (instance.requestId !== undefined) {
          window.cancelAnimFrame(instance.requestId);
          instance.requestId = undefined;
        }
      }

      function handleContextRestored() {
        init(scene);
        animate();
      }

      return instance;
    }
  };
})();
