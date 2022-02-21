Component({
  properties: {
    // lm-sand | lm-wind | lm-storm_rain | lm-heavy_rain | lm-storm_snow | lm-partly_cloudy_day | lm-dust | lm-moderate_rain | lm-light_snow | lm-light_rain | lm-clear_night | lm-moderate_snow | lm-haze | lm-partly_cloudy_night | lm-clear_day | lm-heavy_snow | lm-cloudy | lm-fog | lm-direction-o | lm-clothes-o | lm-humidity-o | lm-leaf-o | lm-warning | lm-secure-o | lm-secure | lm-alarm-o | lm-alarm | lm-warning-o
    name: {
      type: String,
    },
    // string | string[]
    color: {
      type: null,
      observer: function(color) {
        this.setData({
          colors: this.fixColor(),
          isStr: typeof color === 'string',
        });
      }
    },
    size: {
      type: Number,
      value: 18,
      observer: function(size) {
        this.setData({
          svgSize: size,
        });
      },
    },
    opacity: {
      type: Number,
      value: 18,
      observer (opacity) {
        this.setData({
          opacity: opacity,
        });
      },
    }
  },
  data: {
    colors: '',
    opacity: 1,
    svgSize: 18,
    quot: '"',
    isStr: true,
  },
  methods: {
    fixColor: function() {
      var color = this.data.color;
      var hex2rgb = this.hex2rgb;

      if (typeof color === 'string') {
        return color.indexOf('#') === 0 ? hex2rgb(color) : color;
      }

      return color.map(function (item) {
        return item.indexOf('#') === 0 ? hex2rgb(item) : item;
      });
    },
    hex2rgb: function(hex) {
      var rgb = [];

      hex = hex.substr(1);

      if (hex.length === 3) {
        hex = hex.replace(/(.)/g, '$1$1');
      }

      hex.replace(/../g, function(color) {
        rgb.push(parseInt(color, 0x10));
        return color;
      });

      return 'rgb(' + rgb.join(',') + ')';
    }
  }
});
