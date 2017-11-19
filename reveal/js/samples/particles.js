(function() {

  function ParticleSample() {
    var container;
    var camera, scene, renderer, particles, geometry, materials = [], parameters, i, h, color;
    var mouseX = 0, mouseY = 0;

    var width = sample_defaults.width * 2;
    var height = sample_defaults.height * 2;

    function render() {
      var time = Date.now() * 0.00005;

      for ( i = 0; i < scene.children.length; i ++ ) {
        var object = scene.children[ i ];

        if ( object instanceof THREE.ParticleSystem ) {
          object.rotation.y = time * ( i < 4 ? i + 1 : - ( i + 1 ) );
        }
      }

      for ( i = 0; i < materials.length; i ++ ) {
        color = parameters[i][0];

        h = ( 360 * ( color[0] + time ) % 360 ) / 360;
        materials[i].color.setHSL( h, color[1], color[2] );
      }

      renderer.render( scene, camera );
    }

    this.initialize = function(canvas) {

      camera = new THREE.PerspectiveCamera( 75, width / height, 1, 3000 );
      camera.position.z = 1000;

      scene = new THREE.Scene();
      scene.fog = new THREE.FogExp2( 0x000000, 0.0007 );

      geometry = new THREE.Geometry();

      for ( i = 0; i < 10000; i ++ ) {

        var vertex = new THREE.Vector3();
        vertex.x = Math.random() * 2000 - 1000;
        vertex.y = Math.random() * 2000 - 1000;
        vertex.z = Math.random() * 2000 - 1000;

        geometry.vertices.push( vertex );
      }

      parameters = [ [ [1.0, 1.0, 1.0], 5 ], [ [0.95, 1, 1], 4 ], [ [0.90, 1, 1], 3 ], [ [0.85, 1, 1], 2 ], [ [0.80, 1, 1], 1 ] ];

      for ( i = 0; i < parameters.length; i ++ ) {

        size  = parameters[i][1];
        color = parameters[i][0];

        materials[i] = new THREE.ParticleBasicMaterial( { size: size } );
        materials[i].color.setHSL( color[0], color[1], color[2] );

        particles = new THREE.ParticleSystem( geometry, materials[i] );

        particles.rotation.x = Math.random() * 6;
        particles.rotation.y = Math.random() * 6;
        particles.rotation.z = Math.random() * 6;

        scene.add( particles );
      }

      renderer = new THREE.WebGLRenderer({canvas: canvas});
      renderer.setSize( width, height );

      var instance = { active: false };
      function animate() {
        requestAnimationFrame( animate );
        if(!instance.active || sample_defaults.paused) return;
        render();
      }

      animate();
      return instance;
    }
  }

  window.samples.particles = {
    initialize: function(canvas) {
      var particleSample = new ParticleSample();
      return particleSample.initialize(canvas);
    }
  };
})();
