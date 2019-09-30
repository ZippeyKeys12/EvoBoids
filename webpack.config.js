const path = require("path");

module.exports = {
    mode: "development",
    entry: "./src/main.js",
    resolve: {
        extensions: [".ts", ".js"],
        modules: [path.join(__dirname, "src"), "node_modules"]
    },
    module: {
        rules: [
            {
                test: /\.(x?)html$/,
                use: [
                    {
                        loader: "file-loader",
                        options: {
                            name: "[name].[ext]"
                        }
                    },
                    {
                        loader: "extract-loader"
                    },
                    {
                        loader: "html-loader",
                        options: {
                            attrs: ["img:src", "link:href"],
                            interpolate: true
                        }
                    }
                ]
            },
            {
                test: /\.js(x?)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-env"],
                        plugins: ["transform-class-properties"]
                    }
                }
            }
        ]
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "main.bundle.js"
    },
    devServer: {
        contentBase: path.join(__dirname, "dist"),
        compress: true,
        port: 8080
    }
};
