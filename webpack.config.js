const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  devtool: "source-map", // дебагинг
  watch: true, // позволяем следить за изменениями
  entry: {
    index: "./src/js/index.js",
    events: "./src/js/events.js",
  },
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist"),
    clean: true, // очистка выходного каталога перед каждой сборкой
  },
  module: {
    rules: [
      {
        test: /\.js$/, // указываем какого формата файлы будут проганяться
        exclude: /node_modules/, // исключаем из процесса
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader, // извлечение CSS в отдельные файлы
          "css-loader",
          "sass-loader",
        ],
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: "asset/resource",
        generator: {
          filename: "assets/images/[name][ext]",
        },
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: "asset/resource",
        generator: {
          filename: "assets/fonts/[name][ext]",
        },
      },
      {
        test: /\.(ico|svg)$/i,
        type: "asset/resource",
        generator: {
          filename: "assets/icons/[name][ext]",
        },
      },
      {
        test: /\.hbs$/,
        use: [
          {
            loader: "handlebars-loader",
            options: {
              partialDirs: path.resolve(__dirname, "src/partials"),
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "[name].css",
    }),
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: "./src/index.hbs",
      chunks: ["index"],
    }),
    new HtmlWebpackPlugin({
      filename: "events.html",
      template: "./src/events.hbs",
      chunks: ["events"],
    }),
  ],
  resolve: {
    fallback: {
      path: require.resolve("path-browserify"),
      fs: false,
      url: require.resolve("url/"),
    },
  },
  devServer: {
    static: path.resolve(__dirname, "dist"),
    open: true,
  },
};
