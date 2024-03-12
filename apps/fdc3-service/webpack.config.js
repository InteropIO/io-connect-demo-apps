const { NxWebpackPlugin } = require('@nx/webpack');
const { NxReactWebpackPlugin } = require('@nx/react');
const { join } = require('path');

module.exports = {
  entry: './src/index.ts', // Ensure we have an entry point specified for TypeScript.
  output: {
    path: join(__dirname, '../../dist/apps/fdc3-service'),
    clean: true, // Cleans the output directory before each build.
  },
  devServer: {
    port: 3001, // Development server configuration remains unchanged.
  },
  module: {
    rules: [
      // TypeScript loader configuration.
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      // Include other loaders as necessary (e.g., for CSS, images).
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'], // Resolve these file extensions.
  },
  plugins: [
    new NxWebpackPlugin({
      tsConfig: './tsconfig.app.json', // TypeScript configuration file.
      compiler: 'babel', // Utilize Babel for compilation.
      main: './src/index.ts', // Main entry file, clarified to ensure it's pointing to your TypeScript file.
      index: '', // Removed reference to an HTML file.
      baseHref: '/',
      assets: [], // Define static assets as needed.
      styles: [], // Define global styles as needed.
      outputHashing: process.env['NODE_ENV'] === 'production' ? 'all' : 'none', // Hashing based on environment.
      optimization: process.env['NODE_ENV'] === 'production', // Optimization settings based on environment.
    }),
    new NxReactWebpackPlugin({
      // React plugin configuration, adjust based on your needs.
      // svgr: false, // Uncomment if not using SVGR for SVG handling.
    }),
  ],
};
