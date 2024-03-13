const { NxWebpackPlugin } = require('@nx/webpack');
const { NxReactWebpackPlugin } = require('@nx/react');
const { join } = require('path');

module.exports = {
  entry: './src/index.ts', // Entry point remains the same, pointing to your TypeScript file.
  output: {
    path: join(__dirname, '../../dist/apps/ts-mocked-data-service'),
    clean: true, // Ensures the output directory is cleaned before each build, reducing clutter and potential conflicts.
  },
  devServer: {
    port: 3003, // Development server configuration remains as you specified, suitable for development needs.
  },
  module: {
    rules: [
      // Rule for TypeScript files, utilizing ts-loader. Adjust if you're using a different setup.
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      // Include additional rules here as needed (e.g., for CSS, images)
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'], // Ensures Webpack can resolve TypeScript and JavaScript modules.
  },
  plugins: [
    new NxWebpackPlugin({
      tsConfig: './tsconfig.app.json', // Ensures TypeScript is compiled according to your tsconfig settings.
      compiler: 'babel', // Specifies Babel as the compiler, useful if you're leveraging Babel-specific features or optimizations.
      main: './src/index.ts', // Points to the main TypeScript file, adjusted to ensure clarity.
      index: '', // Removed the reference to an HTML file, as it's not used.
      baseHref: '/',
      assets: [], // Specify any static assets if needed.
      styles: [], // Include any global stylesheets if applicable.
      outputHashing: process.env['NODE_ENV'] === 'production' ? 'all' : 'none', // Configures output hashing based on the environment.
      optimization: process.env['NODE_ENV'] === 'production', // Enables optimization features in production.
    }),
    new NxReactWebpackPlugin({
      // Configuration for React-specific optimizations or features. Adjust based on your React setup.
      // svgr: false, // Uncomment and adjust as necessary based on your use of SVGR for SVGs.
    }),
  ],
};
