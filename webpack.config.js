const path = require("path");

module.exports = {
  mode: "development",
  entry: {
    main: "./src/app.js",
  },
  output: {
    path: path.resolve("./dist"),
    filename: "[name].js",
  },
  module: {
    rules: [
      {
        test: /\.css$/, // css형식을 읽는다.
        use: ["style-loader", "css-loader"], // 읽는 순서는 뒤에서부터 앞으로이다. 1.css -> 2.style style-loader는 css를 접목하며 css-loader는 css를 자바스크립트 모듈화한다.
      },
    ],
  },
};
