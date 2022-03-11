const path = require("path");
const webpack = require("webpack");
const ChildProcess = require("child_process");
const currentMode = process.env.NODE_ENV;
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

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
        // use: ["style-loader", "css-loader"], // 읽는 순서는 뒤에서부터 앞으로이다. 1.css -> 2.style style-loader는 css를 접목하며 css-loader는 css를 자바스크립트 모듈화한다.
        use: [
          currentMode === "production"
            ? MiniCssExtractPlugin.loader // 프로덕션 환경
            : "style-loader", // 개발 환경
          "css-loader",
        ],
      },
      {
        test: /\.(png||jpg)$/, // png, jpg형식을 읽는다.
        type: "asset", // 40kb미만은 inline, 이상은 resource로 대처
        parser: {
          dataUrlCondition: {
            maxSize: 40 * 1024, // 40kb
          },
        },
      },
    ],
  },
  plugins: [
    // BannerPlugin(기본내장) : 번들링된 파일에 빌드정보 및 커밋정보를 삽입할 수 있다.
    new webpack.BannerPlugin({
      banner: () => `
      build date : ${new Date().toLocaleString()}
      commit : ${ChildProcess.execSync("git rev-parse --short HEAD")}
      anchor : ${ChildProcess.execSync("git config user.name")}
      `,
    }),
    // DefinePlugin(기본 내장) : 서버모드환경에 따라 api주소등을 다르게 처리할때(환경 의존적인 정보를 소스가 아닌곳에서 관리) 사용할수있다.
    new webpack.DefinePlugin({
      "api.domain": JSON.stringify("http://dev...."), // api-domain을 불러오면 http://dev....가 로드된다.
      "current.mode":
        currentMode === "development" // 현재 모드에 따라서 사용되는 api 변경
          ? JSON.stringify("develop-api")
          : JSON.stringify("production-api"),
    }),
    // HtmlWebpackPlugin(서드 파티 패키지) : html파일을 후처리하는데 사용된다. 빌드되는 html파일의 값을 넣거나 압축이 가능하다.
    new HtmlWebpackPlugin({
      // 참조 https://github.com/jantimon/html-webpack-plugin#options
      // <%= htmlWebpackPlugin.options.title %> 표기
      title: currentMode === "development" ? "개발용" : "배포용",
      template: "./index.html",
      minify:
        currentMode === "production"
          ? {
              collapseWhitespace: true, // 빈칸 제거
              removeComments: true, // 주석 제거
            }
          : false,
    }),
    // 빌드 이전 결과물을 전체삭제한 후 재빌드되는 최신파일들로 유지되게한다.
    new CleanWebpackPlugin(),
    // 개발모드가 아닌 배포용일때는 css를 js에 통합하지않고 분리한다.
    ...(currentMode === "production"
      ? [new MiniCssExtractPlugin({ filename: `[name].css` })]
      : []),
  ],
};
