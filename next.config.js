const optimisedImages = require('next-optimized-images');
const path = require('path');
const withPlugins = require('next-compose-plugins');

const nextConfig = {
  sassOptions: {
    includePaths: ['node_modules'].map(d => path.join(__dirname, d)),
  },
  webpack(config) {
    config.resolve.roots = [__dirname];
    config.module.rules.push({
      test: /\.yaml$/,
      loader: ['./lib/loaders/yaml.js'],
    });
    return config;
  },
};

module.exports = withPlugins(
  [[optimisedImages, {optimizeImages: false}]],
  nextConfig
);
