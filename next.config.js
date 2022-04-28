const withPlugins = require('next-compose-plugins');
const optimizedImages = require('next-optimized-images');
const {PHASE_DEVELOPMENT_SERVER} = require('next/constants');

/** @type {import('next').NextConfig} */
module.exports = withPlugins(
  [
    [
      optimizedImages,
      {
        ['!' + PHASE_DEVELOPMENT_SERVER]: {
          handleImages: ['jpeg', 'png', 'svg', 'webp'],
        },
        inlineImageLimit: -1,
        responsive: {
          adapter: require('responsive-loader/sharp'),
        },
      },
    ],
  ],
  {
    images: {disableStaticImages: true},
    reactStrictMode: true,
    trailingSlash: true,
    webpack: (config, {dev}) => {
      // config.cache = {
      //   type: 'filesystem',
      //   buildDependencies: {
      //     config: [__filename],
      //   },
      // };
      config.module.rules.push(
        ...[
          {
            test: /\.md$/,
            loader: './lib/loaders/markdown.js',
          },
          {
            test: /\.csv$/,
            loader: 'csv-loader',
          },
        ]
      );
      if (!dev) {
        config.module.rules.push({
          test: /\.gif$/,
          loader: './lib/loaders/gif.js',
        });
        config.experiments.buildHttp = {
          allowedUris: [/^https?:\/\/github\.com/],
          frozen: false,
        };
      }
      // config.infrastructureLogging = {
      //   debug: /webpack\.cache/,
      // };
      return config;
    },
  }
);
