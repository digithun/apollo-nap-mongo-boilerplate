const Uglify = require('uglifyjs-webpack-plugin')
module.exports = {
  webpack(cfg) {
      cfg.plugins = cfg.plugins.filter(
        (plugin) => (plugin.constructor.name !== 'UglifyJsPlugin')
      )
      cfg.plugins.push(
        new Uglify({
          sourceMap: false
        })
      )

    return cfg;
  }
};
