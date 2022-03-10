const path = require("path");

module.exports = {
  mode: "development",
  entry: {
    main: "./src/app.js",
  },
  output: {
    path: path.resolve("./dist"),
    filename: "[name].js",
    assetModuleFilename: "images/[name][ext]",
    clean: true, // hash로 인한 번들시 최신을 제외한 나머지 삭제
  },
  module: {
    rules: [
      {
        test: /\.css$/, // css형식을 읽는다.
        use: ["style-loader", "css-loader"], // 읽는 순서는 뒤에서부터 앞으로이다. 1.css -> 2.style style-loader는 css를 접목하며 css-loader는 css를 자바스크립트 모듈화한다.
      },
      {
        test: /\.(png||jpg)$/, // png, jpg형식을 읽는다.
        type: "asset/resource", // 파일을 내보내고 URL을 추출합니다 이전버젼 -> file-loader
      },
    ],
  },
};
