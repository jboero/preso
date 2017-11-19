(function() {

  function ShadowMap() {
    var SHADOW_MAP_WIDTH, SHADOW_MAP_HEIGHT;
    SHADOW_MAP_WIDTH = SHADOW_MAP_HEIGHT = 512;

    var width = sample_defaults.width * 2;
    var height = sample_defaults.height * 2;
    var clock = new THREE.Clock();

    function createLight() {
      var light = new THREE.SpotLight ( 0xffffffff );

      light.position.set( 0, 15, 0);
      light.target.position.set( 0, 0, 0 );

      light.castShadow = true;

      light.shadowCameraVisible = true;

      light.shadowCameraNear = 1;
      light.shadowCameraFar = 16;

      light.shadowMapWidth = SHADOW_MAP_WIDTH;
      light.shadowMapHeight = SHADOW_MAP_HEIGHT;

      return light;
    }

    function createCubeMesh() {
      var scale = 2.5;
      var geometry = new THREE.CubeGeometry( scale, scale, scale );
      var material = new THREE.MeshPhongMaterial({ color: 0xdddddd, antialias:true });

      var mesh = new THREE.Mesh( geometry, material );
      mesh.position.y = 10;
      mesh.castShadow = true;

      return mesh;
    }

    function createFloorMesh() {
      var geometry = new THREE.PlaneGeometry( 12, 12 );
      var planeMaterial = new THREE.MeshPhongMaterial( { color: 0xdddddd } );

      var floor = new THREE.Mesh( geometry, planeMaterial );

      floor.position.set( 0, 0, 0 );
      floor.rotation.x = - Math.PI / 2;

      floor.castShadow = false;
      floor.receiveShadow = true;
      return floor;
    }

    function createHUD() {
      var scene = new THREE.Scene();

      var camera = new THREE.OrthographicCamera(width / -2, width / 2, height / 2, height / -2);
      camera.position.z = 10;

      var shader = THREE.UnpackDepthRGBAShader;
      var uniforms = new THREE.UniformsUtils.clone( shader.uniforms );

      var hudMaterial = new THREE.ShaderMaterial( { vertexShader: shader.vertexShader, fragmentShader: shader.fragmentShader, uniforms: uniforms } );

      var hudGeo = new THREE.PlaneGeometry( SHADOW_MAP_WIDTH / 2, SHADOW_MAP_HEIGHT / 2 );
      var hudMesh = new THREE.Mesh( hudGeo, hudMaterial );
      hudMesh.position.x = ( width - SHADOW_MAP_WIDTH / 2 ) * 0.5;
      hudMesh.position.y = ( height - SHADOW_MAP_HEIGHT / 2 ) * 0.5;

      scene.add( hudMesh );

      return {
        scene: scene,
        camera: camera,
        update: function(shadowMap) {
          hudMaterial.uniforms.tDiffuse.texture = shadowMap;
        }
      };
    }

    function createShadowWorld() {
      var scene = new THREE.Scene();

      var camera = new THREE.PerspectiveCamera( 30, width / height, 1, 1000 );
      camera.position.set( 5, 20, 40 );
      camera.lookAt( new THREE.Vector3(5,6,0));

      var light = createLight();
      var cubeMesh = createCubeMesh();
      var floorMesh = createFloorMesh();

      scene.add( light );
      scene.add( cubeMesh );
      scene.add( floorMesh );

      return {
        scene: scene,
        camera: camera,
        light: light,
        animate: function(delta) {
          cubeMesh.rotation.y += 0.5 * delta;
        }
      };
    }

    this.initialize = function(canvas) {
      var shadowWorld = createShadowWorld();
      var hud = createHUD();

      var renderer = new THREE.WebGLRenderer({canvas: canvas, antialias: true});

      renderer.setSize( width, height );
      renderer.autoClear = false;

      renderer.shadowMapEnabled = true;
      renderer.shadowMapSoft = true;

      var instance = { active: false };
      function animate() {
        requestAnimationFrame( animate, canvas );
        var delta = clock.getDelta();

        if(!instance.active || sample_defaults.paused) return;

        hud.update(shadowWorld.light.shadowMap);

        shadowWorld.animate(delta);

        renderer.clear();
        renderer.render( shadowWorld.scene, shadowWorld.camera );
        renderer.render( hud.scene, hud.camera );
      }

      animate();
      return instance;
    };
  }

  window.samples.shadow_map = {
    initialize: function(canvas) {
      var shadowMap = new ShadowMap();
      return shadowMap.initialize(canvas);
    }
  };
})();
