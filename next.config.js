const fs = require('fs');
const path = require('path');
const withPlugins = require('next-compose-plugins');

const nextConfig = {
  images: {},
  sassOptions: {
    includePaths: ['node_modules'].map((d) => path.join(__dirname, d)),
  },
  trailingSlash: true,
  webpack: (config) => {
    config.resolve.roots = [__dirname];
    config.module.rules.find((r) => r.loader == 'next-image-loader').test =
      /\.(png|jpg|jpeg|webp|ico|bmp|svg)$/i;
    config.module.rules.push(
      ...[
        {
          test: /^repo:/,
          loader: './lib/loaders/repo.js',
        },
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
      ],
    );
    return config;
  },
};

module.exports = nextConfig;
