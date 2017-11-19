(function() {

  var instances = [];

  function NormalMappedPlane() {
    var scene,
        camera,
        renderer,
        mesh,
        uniforms,
        requestAnimationFrameId,
        clock = new THREE.Clock();

    var options = {
      active: false
    };

    function preloadImages(images) {
      _.each(images, function(image) {
        var img = new Image();
        img.src = 'images/' + image;
      });
    }

    preloadImages(sample_defaults.normal_maps);

    function addNormalMappedPlane(scene) {
      var geometry = new THREE.PlaneGeometry( 100, 100, 1, 1 );
      geometry.computeTangents();

      var texture = new THREE.ImageUtils.loadTexture('images/' + sample_defaults.current_normal_map, {}, function() {
        animate();
      });

      uniforms = {
        "map" : { type: "t", value: texture },
        "uTime" : { type: "f", value: 1.0 }
      };

      var exaggeratedTangents = _.map(geometry.faces[0].vertexTangents, function(v) { v.x = 3; return v; })
      var attributes = {
        "tangent" : { type: "v3", value: exaggeratedTangents }
      };

      var vertexShader = $('#normal_map_vs').text();
      var fragmentShader = $('#normal_map_fs').text();

      var parameters = {
        fragmentShader: fragmentShader,
        vertexShader: vertexShader,
        uniforms: uniforms,
        attributes: attributes
      };

      var normal_material = new THREE.ShaderMaterial( parameters );

      mesh = new THREE.Mesh( geometry, normal_material );
      scene.add( mesh );
      return mesh;
    }

    function animate() {
      mesh.material.wireframe = sample_defaults.wireframe;
      var delta = clock.getDelta();

      if(options.active && !sample_defaults.paused) {
        uniforms.uTime.value += delta * 0.5;
        renderer.render( scene, camera );
      }

      requestAnimationFrameId = requestAnimationFrame( animate );
    }

    this.resetNormalMap = function() {
      cancelAnimationFrame(requestAnimationFrameId);

      _.each(scene.children, function(child) { scene.remove(child); } );

      addNormalMappedPlane(scene);
    }

    this.initialize = function(canvas) {
      scene = new THREE.Scene();

      camera = new THREE.PerspectiveCamera( 75, sample_defaults.width / sample_defaults.height, 1, 1000 );
      camera.lookAt(new THREE.Vector3(0,0,0));
      camera.position.z = 80;

      renderer = new THREE.WebGLRenderer({canvas: canvas});
      renderer.setSize( sample_defaults.width * 2, sample_defaults.height * 2 );

      var mesh = addNormalMappedPlane(scene);

      return options;
    }
  }

  window.samples.normal_mapped_plane = {
    resetNormalMaps: function() {
      _.each(instances, function(world) {
        world.resetNormalMap()
      });
    },

    initialize: function(canvas) {
      var instance = new NormalMappedPlane();
      instances.push(instance);
      return instance.initialize(canvas);
    }
  };
})();
