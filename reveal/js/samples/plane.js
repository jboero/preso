(function() {

  window.samples.plane = {

    initialize: function(canvas) {
      var scene = new THREE.Scene();

      var camera = new THREE.PerspectiveCamera( 75, sample_defaults.width / sample_defaults.height, 1, 1000 );
      camera.position.z = 100;

      var geometry = new THREE.PlaneGeometry( 100, 100, 1, 1 );
      var material = new THREE.MeshBasicMaterial( { wireframe: false, side: THREE.DoubleSide } );

      var mesh = new THREE.Mesh( geometry, material );
      scene.add( mesh );

      var renderer = new THREE.WebGLRenderer({canvas: canvas});
      renderer.setSize( sample_defaults.width * 0.5, sample_defaults.height * 0.5 );

      var instance = { active: false };

      function animate() {
        requestAnimationFrame( animate, canvas );
        if(!instance.active || sample_defaults.paused) return;

        mesh.rotation.y += 0.01;
        renderer.render( scene, camera );
      }

      animate();
      return instance;
    }
  };
})();
