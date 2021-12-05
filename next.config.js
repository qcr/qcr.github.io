const fs = require('fs');
const path = require('path');
const withPlugins = require('next-compose-plugins');
const optimizedImages = require('next-optimized-images');

/** @type {import('next').NextConfig} */
module.exports = withPlugins([optimizedImages], {
  images: {disableStaticImages: true},
  reactStrictMode: true,
  trailingSlash: true,
  webpack: (config) => {
    config.resolve.roots = [__dirname];
    config.module.rules.push(
      ...[
        {
          test: /\.md$/,
          loader: './lib/loaders/markdown.js',
        },
        {
          test: /\.gif$/,
          loader: './lib/loaders/gif.js',
        },
        {
          test: /\.csv$/,
          loader: 'csv-loader',
        },
      ]
    );
    return config;
  },
});
