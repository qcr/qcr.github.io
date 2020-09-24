const fs = require('fs');
const optimisedImages = require('next-optimized-images');
const path = require('path');
const withPlugins = require('next-compose-plugins');

const nextConfig = {
  sassOptions: {
    includePaths: ['node_modules'].map(d => path.join(__dirname, d)),
  },
  trailingSlash: true,
  webpack(config) {
    config.resolve.roots = [__dirname];
    config.module.rules.push({
      test: /^repo:/,
      loader: ['./lib/loaders/repo.js'],
    });
    config.module.rules.push({
      test: /\.md$/,
      loader: ['./lib/loaders/markdown.js'],
    });
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
