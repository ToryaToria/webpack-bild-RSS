const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const loader = require('sass-loader');
const mode = process.env.NODE_ENV || 'development';
const devMode = mode === 'development';
const target = devMode ? 'web' : 'browserslist';
const devtool = devMode ? 'source-map' : undefined;

module.exports = {
  mode,
  target,
  devtool,
  devServer: {
    port: 3000,
    open: true,
    hot: true,
  },
  entry: ["@babel/polyfill", path.resolve(__dirname, 'src', 'index.js')],
  output: {
    path: path.resolve(__dirname, 'distant'),
    clean: true,
    filename: '[name].[contenthash].js',
    assetModuleFilename: 'assets/[path][name][ext]'
  },

  plugins: [
    new HtmlWebpackPlugin({ template: path.resolve(__dirname, 'src', 'index.html'), }),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
    }),],

  module: {
    rules: [
      {
        test: /\.html$/i,
        loader: 'html-loader',
      },
      {
        test: /\.(c|sa|sc)ss$/i,
        use: [
          devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [require('postcss-preset-env')],
              },
            },
          },
          'sass-loader',
        ],
      },
      {
        test: /\.woff2?$/i,
        type: 'asset/resource',
        generator: { filename: 'fonts/[name][ext]', },
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: 'asset/resource',
        use: [
          {
            loader: 'image-webpack-loader',
            options: {
              mozjpeg: { progressive: true, },
              optipng: {
                enabled: false,
              },
              pngquant: {
                quality: [0.65, 0.90],
                speed: 4
              },
              gifsicle: { interlaced: false, },
              webp: { quality: 75 }
            }
          }
        ],
        generator: {
          filename: (pathData) => {
            // pathData.filename — полный путь к исходному файлу
            // убираем префикс 'src/img/' из пути
            const filepath = path.relative(
              path.resolve(__dirname, 'src/img'),
              pathData.filename
            );
            return `assets/${filepath.replace(/\\/g, '/')}`;
          },
        },
      },
      {
        test: /\.(?:js|mjs|cjs)$/i,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            targets: "defaults",
            presets: [ 
              ['@babel/preset-env']
            ]
          }
        }
      },
    ]
  }
};