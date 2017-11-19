(function() {

  function Apache() {
    var scene = null;
    var camera = null;
    var renderer = null;
    var mesh = null;

    function createDirectionalLight(options) {
      var directionalLight;
      directionalLight = new THREE.DirectionalLight(0xffffff, 1.1);
      directionalLight.position.set(options.position.x, options.position.y, options.position.z);
      return directionalLight;
    }

    this.initialize = function(canvas) {
      scene = new THREE.Scene();

      camera = new THREE.PerspectiveCamera( 75, sample_defaults.width / sample_defaults.height, 1, 1000 );
      camera.position.z = 100;

      scene.add(createDirectionalLight({ position: camera.position }));

      renderer = new THREE.WebGLRenderer({canvas: canvas, antialias: true});
      renderer.setSize( sample_defaults.width * 2, sample_defaults.height * 2);

      var instance = { active: false };

      function animate() {
        requestAnimationFrame( animate );
        if(instance.active && !sample_defaults.paused) {
          mesh.rotation.y += 0.01;
        }

        mesh.material.wireframe = sample_defaults.wireframe;
        renderer.render( scene, camera );
      }

      var loader = new THREE.JSONLoader();
      loader.load("js/meshes/LP_Apache.js", function(geometry, materials) {
        mesh = new THREE.Mesh( geometry, materials[0] );
        mesh.scale = new THREE.Vector3(15, 15, 15);
        scene.add( mesh );

        animate();
      }, "images");

      return instance;
    };
  }

  window.samples.load_apache = {
    initialize: function(canvas) {
      var apache = new Apache();
      return apache.initialize(canvas);
    }
  };
})();

