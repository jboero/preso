$(function() {

  var gui = new dat.GUI();
  var pauseController = gui.add(sample_defaults, "paused");
  var wireframeController = gui.add(sample_defaults, "wireframe");

  var normalController = gui.add(
    sample_defaults,
    "current_normal_map",
    sample_defaults.normal_maps);

  normalController.onFinishChange(function(value) {
    console.log("Changing normal map to " + value);
    samples.normal_mapped_plane.resetNormalMaps();
    $("img.normal_map").prop("src", "images/" + value);
  });

  gui.closed = true;

  // Listen to Shift + p to toggle pause.
  $(document).bind('keyup.shift_p', function() {
    sample_defaults.paused = !sample_defaults.paused;
    pauseController.setValue(sample_defaults.paused);
  });

  // Listen to Shift + w to toggle wireframe for blender meshes.
  $(document).bind('keyup.shift_w', function() {
    sample_defaults.wireframe = !sample_defaults.wireframe;
    wireframeController.setValue(sample_defaults.wireframe);
  });
});
