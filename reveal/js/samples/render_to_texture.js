(function() {

  window.samples.render_to_texture = {

    initialize: function(canvas) {
      var worldScene = new THREE.Scene();
      var planeScene = new THREE.Scene();

      var camera = new THREE.PerspectiveCamera( 75, sample_defaults.width / sample_defaults.height, 1, 1000 );
      camera.position.z = 100;

      // Create objects to render spinning cube in world.
      var texture = THREE.ImageUtils.loadTexture('images/checker_large.gif', {}, function() {
        animate();
      });

      var geometry = new THREE.CubeGeometry( 70, 70, 70 );
      var material = new THREE.MeshBasicMaterial( { map: texture } );
      var cubeMesh = new THREE.Mesh( geometry, material );
      worldScene.add( cubeMesh );

      var renderer = new THREE.WebGLRenderer({canvas: canvas, autoClear: false});
      renderer.setSize( sample_defaults.width, sample_defaults.height );
      renderer.setClearColor( 0, 0 );

      var renderTargetParameters = {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBFormat,
        stencilBuffer: false
      };

      var renderTarget = new THREE.WebGLRenderTarget(
        sample_defaults.width,
        sample_defaults.height,
        renderTargetParameters);

      // Create plane to render spinning cube as texture.
      var planeGeometry = new THREE.PlaneGeometry( 1, 1 );
      var planeMaterial = new THREE.ShaderMaterial( THREE.DotScreenShader );
      planeMaterial.side = THREE.DoubleSide;
      var planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
      planeMesh.position.z = -100;
      planeMesh.scale.set( sample_defaults.width, sample_defaults.height, 1 );

      // Create wireframe plane to illustrate that it's a plane
      var wireframePlaneGeometry = new THREE.PlaneGeometry( 1, 1 );
      var wireframePlaneMesh = new THREE.Mesh(wireframePlaneGeometry, new THREE.MeshBasicMaterial({color: 0xdddddd, wireframe: true}));
      wireframePlaneMesh.position.z = -100;
      wireframePlaneMesh.scale.set( sample_defaults.width, sample_defaults.height, 1 );

      planeScene.add( planeMesh );
      planeScene.add( wireframePlaneMesh );

      var instance = { active: false };
      function animate() {
        requestAnimationFrame( animate, canvas );
        if(!instance.active || sample_defaults.paused) return;

        var speedIncrement = 0.005;
        cubeMesh.rotation.y += speedIncrement;
        planeMesh.rotation.y += speedIncrement;
        wireframePlaneMesh.rotation.y += speedIncrement;

        renderer.clear();
        renderer.render( worldScene, camera, renderTarget );

        planeMaterial.uniforms[ "tDiffuse" ].value = renderTarget;
        renderer.render( planeScene, camera );
      }

      return instance;
    }
  };
})();
