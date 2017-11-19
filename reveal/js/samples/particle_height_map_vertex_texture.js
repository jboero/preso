(function() {

  function ParticleSample() {
    var container,
        camera,
        scene,
        renderer,
        particles,
        geometry,
        materials = [],
        parameters,
        i,
        h,
        color;

    var mouseX = 0, mouseY = 0;

    var width = sample_defaults.width * 2;
    var height = sample_defaults.height * 2;

    this.initialize = function(canvas) {
      camera = new THREE.PerspectiveCamera( 30, width / height, 1, 1000 );
      camera.lookAt( new THREE.Vector3(5, -20, -10) );
      camera.position.set( 0, 250, 150);

      scene = new THREE.Scene();

      var instance = { active: false };

      sample_defaults.addListener("initialized", function() {
        var heightMapImageSample = $("canvas[data-sample=height_map_image]").data("instance");
        heightMapImageSample.addListener("onload", function() {

          geometry = new THREE.Geometry();

          for ( i = 0; i < 128; i ++ ) {
            for ( j = 0; j < 128; j ++ ) {

              var vertex = new THREE.Vector3();
              vertex.x = i;
              vertex.z = j;

              var dataPosition = i * 128 * 4 + j * 4;
              vertex.y = heightMapImageSample.imageData.data[dataPosition] / 255.0 * 64;

              geometry.vertices.push( vertex );
            }
          }

          var texture = new THREE.Texture( heightMapImageSample.canvas );
          texture.needsUpdate = true;

          var color = [0.4, 1.0, 0];
          var size = 2;

          material = new THREE.ParticleBasicMaterial( { size: size, map: texture } );
          // material.color.setHSL( color[0], color[1], color[2] );

          particles = new THREE.ParticleSystem( geometry, material );

          scene.add( particles );

          var axisHelper = new THREE.AxisHelper(50);
          scene.add( axisHelper );

          renderer = new THREE.WebGLRenderer({canvas: canvas});
          renderer.setSize( width, height );

          function animate() {
            requestAnimationFrame( animate );
            if(!instance.active || sample_defaults.paused) return;
            renderer.render( scene, camera );
          }

          animate();
        });
      });

      return instance;
    };
  }

  window.samples.particle_height_map_vertex_texture = {
    initialize: function(canvas) {
      var particleSample = new ParticleSample();
      return particleSample.initialize(canvas);
    }
  };
})();
