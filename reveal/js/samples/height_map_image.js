(function() {

  function HeightMapCanvas() {
    var that = this;
    var eventEmitter = new EventEmitter();
    var image = new Image();

    this.addListener = function(event, listener) {
      return eventEmitter.addListener(event, listener);
    };

    this.imageData = null;
    this.canvas = null;

    this.initialize = function(canvas) {
      that.canvas = canvas;
      var context = canvas.getContext('2d');

      image.onload = function() {
        canvas.width = image.width;
        canvas.height = image.height;
        context.drawImage(image, 0, 0);

        that.imageData = context.getImageData(0, 0, image.width, image.height);
        eventEmitter.emitEvent("onload", [canvas]);
      };

      image.src = "images/star_height128.jpg";
    };
  }

  window.samples.height_map_image = {
    initialize: function(canvas) {
      var heightMapCanvas = new HeightMapCanvas();
      heightMapCanvas.initialize(canvas);

      return heightMapCanvas;
    }
  };
})();
