(function() {

  window.samples.blur_post_process = {

    initialize: function(canvas) {
      var scene = new THREE.Scene();

      var camera = new THREE.PerspectiveCamera( 75, sample_defaults.width / sample_defaults.height, 1, 1000 );
      camera.position.z = 100;

      var texture = THREE.ImageUtils.loadTexture('images/checker_large.gif', {}, function() {
        animate();
      });

      var geometry = new THREE.CubeGeometry( 70, 70, 70 );
      var material = new THREE.MeshBasicMaterial( { map: texture } );
      var mesh = new THREE.Mesh( geometry, material );
      scene.add( mesh );

      var renderer = new THREE.WebGLRenderer({canvas: canvas, autoClear: false});
      renderer.setSize( sample_defaults.width, sample_defaults.height );
      renderer.setClearColor( 0, 0 );

      var composer = new THREE.EffectComposer( renderer );

      var renderModel = new THREE.RenderPass( scene, camera );
      var effectHorizontalBlur = new THREE.ShaderPass( THREE.HorizontalBlurShader );
      effectHorizontalBlur.uniforms.h.value = 2 / sample_defaults.width;

      var effectVerticalBlur = new THREE.ShaderPass( THREE.VerticalBlurShader );
      effectVerticalBlur.uniforms.v.value = 2 / sample_defaults.height;

      effectVerticalBlur.renderToScreen = true;

      composer.addPass( renderModel );
      composer.addPass( effectHorizontalBlur );
      composer.addPass( effectVerticalBlur );

      var instance = { active: false };
      function animate() {
        requestAnimationFrame( animate, canvas );
        if(!instance.active || sample_defaults.paused) return;

        mesh.rotation.x += 0.01;
        mesh.rotation.y += 0.02;

        renderer.clear();
        composer.render(0.1);
      }

      return instance;
    }
  };
})();

