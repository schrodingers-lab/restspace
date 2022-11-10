// const withTs = require('next-typescript');
module.exports = {
  basePath: '',
  images: {
    domains: ['images.unsplash.com'],
  },
  webpack(config, options) {
    const { dir, defaultLoaders } = options;
    config.resolve.extensions.push('.ts', '.tsx');
    config.module.rules.push({
      test: /\\.+(ts|tsx)$/,
      include: [dir],
      exclude: /node_modules/,
      use: [
        defaultLoaders.babel,
        { loader: 'ts-loader', options: { transpileOnly: true } },
      ],
    });
    return config;
  },
  env: {
      ENV_CONTRACT: process.env.ENV_CONTRACT,
  }
};
