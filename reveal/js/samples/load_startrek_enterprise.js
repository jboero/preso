(function() {

  function StartrekEnterprise() {
    var scene = null;
    var camera = null;
    var renderer = null;
    var mesh = null;

    function createDirectionalLight(options) {
      var directionalLight;
      directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
      directionalLight.position.set(options.position.x, options.position.y, options.position.z);
      return directionalLight;
    }

    this.initialize = function(canvas) {
      scene = new THREE.Scene();

      camera = new THREE.PerspectiveCamera( 75, sample_defaults.width / sample_defaults.height, 1, 1000 );
      camera.position.z = 6;

      scene.add(createDirectionalLight({ position: camera.position }));

      renderer = new THREE.WebGLRenderer({canvas: canvas, antialias: true, alpha: true });
      renderer.setSize( sample_defaults.width * 3, sample_defaults.height * 3);

      var instance = { active: false };
      function animate() {
        requestAnimationFrame( animate );
        if(!sample_defaults.paused && instance.active) {
          mesh.rotation.y += 0.01;
        }

        mesh.material.wireframe = sample_defaults.wireframe;
        renderer.render( scene, camera );
      }

      var loader = new THREE.JSONLoader();
      loader.load("js/meshes/Startrek_Enterprise.js", function(geometry, materials) {
        mesh = new THREE.Mesh( geometry, materials[0] );
        mesh.scale = new THREE.Vector3(20, 20, 20);
        scene.add( mesh );

        animate();
      });

      return instance;
    };
  }

  window.samples.load_startrek_enterprise = {
    initialize: function(canvas) {
      var startrek = new StartrekEnterprise();
      return startrek.initialize(canvas);
    }
  };
})();
