const path = require('path');

module.exports = {
  entry: './src/index.tsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js',
    library: { type: 'window' }
  },
  externals: {
    react: 'React',
    'react-dom': 'ReactDOM'
  },
  resolve: { extensions: ['.tsx', '.ts', '.js'] },
  module: { rules: [{ test: /\.tsx?$/, use: 'ts-loader', exclude: /node_modules/ }] }
};
