const Uglify = require('uglifyjs-webpack-plugin')
module.exports = {
  webpack(cfg) {
    cfg.plugins = cfg.plugins.filter(
      (plugin) => (plugin.constructor.name !== 'UglifyJsPlugin')
    )
    if (( process as any ).NODE_ENV === 'production') {
      cfg.plugins.push(
        new Uglify({
          sourceMap: false
        })
      )
    }

    return cfg;
  }
};
