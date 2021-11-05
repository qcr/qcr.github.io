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
          test: /\.tsx?$/,
          loader: 'ts-loader',
          exclude: /node_modules/,
        },
        {
          test: /^repo:/,
          loader: './lib/loaders/repo.ts',
        },
        {
          test: /\.md$/,
          loader: './lib/loaders/markdown.ts',
        },
        {
          test: /\.gif$/,
          loader: './lib/loaders/gif.ts',
        },
        {
          test: /\.csv$/,
          loader: 'csv-loader',
        },
      ]
    );
    config.resolve.extensions.push(...['.tsx', '.ts']);
    return config;
  },
};

module.exports = nextConfig;
