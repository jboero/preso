(function() {

  var width = sample_defaults.width * 2;
  var height = sample_defaults.height * 2;

  window.samples.spinning_wireframe_torus = {

    initialize: function(canvas, options) {
      var scene = new THREE.Scene();

      var camera = new THREE.PerspectiveCamera( 75, width / height, 1, 5000 );
      camera.position.z = 100;

      var geometry = new THREE.TorusGeometry( 15, 15, 30, 30 );
      var material = new THREE.MeshLambertMaterial( { color: 0xdddddd,  wireframe: true } );

      var mesh = new THREE.Mesh( geometry, material );
      mesh.position.y = 35;
      scene.add( mesh );

      var axisHelper = new THREE.AxisHelper(50);
      scene.add( axisHelper );

      var renderer = new THREE.WebGLRenderer({"canvas": canvas});
      renderer.setSize( width, height );

      var instance = { active: false };
      function animate() {
        requestAnimationFrame( animate, canvas );
        if(!instance.active || sample_defaults.paused) return;

        mesh.rotation.x += 0.01;
        mesh.rotation.y += 0.02;

        renderer.render( scene, camera );
      }

      animate();
      return instance;
    }
  };
})();

