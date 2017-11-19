(function() {

  var width, height;
  width = height = 600;

  window.samples.per_vertex_lighting = {

    initialize: function(canvas) {
      var scene = new THREE.Scene();

      var camera = new THREE.PerspectiveCamera( 75, width / height, 1, 1000 );
      camera.position.z = 100;

      var geometry = new THREE.SphereGeometry( 60, 4, 4 );
      var material = new THREE.MeshLambertMaterial( { color: 0xdddddd } );

      var mesh = new THREE.Mesh( geometry, material );
      scene.add( mesh );

      var spotLight = new THREE.SpotLight ( 0xffffffff );
      spotLight.position.set( 0, 100, 0 );
      scene.add( spotLight );

      var ambientLight = new THREE.AmbientLight( 0x22222222 );
      scene.add(ambientLight);

      var renderer = new THREE.WebGLRenderer({canvas: canvas});
      renderer.setSize( width, height);

      var instance = { active: false };
      function animate() {
        requestAnimationFrame( animate, canvas );
        mesh.material.wireframe = sample_defaults.wireframe;

        if(instance.active && !sample_defaults.paused) {
          // Rotate lighting around the X axis.
          var angle = 0.01;
          var matrix = new THREE.Matrix4().makeRotationX( angle );
          spotLight.position = spotLight.position.applyMatrix4(matrix);
        }

        renderer.render( scene, camera );
      }

      animate();
      return instance;
    }
  };
})();
