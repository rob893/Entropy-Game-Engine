import { Configuration } from 'webpack';
import { merge } from 'webpack-merge';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import commonConfig from './webpack.common';

const prodConfig: Configuration = merge(commonConfig, {
  mode: 'production',
  devtool: 'source-map',
  plugins: [new CleanWebpackPlugin()]
});

export default prodConfig;
