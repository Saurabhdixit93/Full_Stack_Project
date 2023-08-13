const Dotenv = require("dotenv-webpack");

module.exports = {
  plugins: [new Dotenv()],
  devServer: {
    historyApiFallback: {
      rewrites: [{ from: /\//, to: "/404.html" }],
    },
  },
};
