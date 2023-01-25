const AngularWebpackPlugin = require('@ngtools/webpack').AngularWebpackPlugin
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin').CleanWebpackPlugin
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const path = require('path')

const workspaceRoot = path.resolve(__dirname, './')
const projectRoot = path.resolve(__dirname, './')
const bazelExternal = path.resolve(__dirname, '../../build/external')

const themStyleFiles = [
    path.resolve(__dirname, './ui/core/theming/prebuilt/aris-theme.scss'),
    path.resolve(__dirname, './ui/core/theming/prebuilt/logi-theme.scss'),
    path.resolve(__dirname, './ui/core/theming/prebuilt/curie-theme.scss'),
]

const fontStyleFiles = [
    path.resolve(bazelExternal, 'com_logiocean_design_fontdb/bahnschrift/font.scss'),
    path.resolve(bazelExternal, 'com_logiocean_design_fontdb/roboto/font.scss'),
    path.resolve(bazelExternal, 'com_logiocean_design_fontdb/roboto_mono/font.scss'),
]

module.exports = {
    mode: 'development',
    resolve: {
        symlinks: false,
        extensions: ['.ts', '.js'],
        alias: {
            'src/web': path.resolve(__dirname, './'),
        },
    },
    entry: {
        polyfills: path.resolve(projectRoot, './webpack-src/polyfills.ts'),
        main: path.resolve(projectRoot, './webpack-src/main.ts'),
        aris: './ui/core/theming/prebuilt/aris-theme.scss',
        logi: './ui/core/theming/prebuilt/logi-theme.scss',
        curie: './ui/core/theming/prebuilt/curie-theme.scss',
        // bahnschrift: path.resolve(bazelExternal, 'com_logiocean_design_fontdb/bahnschrift/font.scss'),
        // roboto: path.resolve(bazelExternal, 'com_logiocean_design_fontdb/roboto/font.scss'),
        // roboto_mono: path.resolve(bazelExternal, 'com_logiocean_design_fontdb/roboto_mono/font.scss'),
    },
    output: {
        path: path.resolve(workspaceRoot, './dist'),
        filename: '[name].js',
        publicPath: '/',
        chunkFilename: '[id].chunk.js',
    },
    plugins: [
        new CleanWebpackPlugin(),
        new AngularWebpackPlugin({
            tsconfig: path.resolve(projectRoot, './webpack.tsconfig.json'),
            directTemplateLoading: true,
        }),
        new HtmlWebpackPlugin({
            template: './webpack-src/index.html',
        }),
        // 静态资源文件直接复制
        new CopyWebpackPlugin({
            patterns: [
                { from: path.resolve(bazelExternal, 'com_logiocean_design_icons'), to: './com_logiocean_design_icons' },
                { from: path.resolve(__dirname, './node_modules/@angular/material/prebuilt-themes/deeppurple-amber.css'), to: './' },
            ],
        }),
        new MiniCssExtractPlugin({
            // 配置主题样式文件输出到特定的路径下
            filename: 'logi_base/src/web/ui/core/theming/prebuilt/[name]-theme.css',
        }),
    ],
    module: {
        rules: [
            { test: /\.ts$/, loader: '@ngtools/webpack' },
            {
                test: /\.scss$/,
                rules: [
                    {
                        include: themStyleFiles.concat(fontStyleFiles),
                        use: [
                            MiniCssExtractPlugin.loader,
                            'css-loader',
                            'sass-loader',
                        ],
                    },
                ]
            },
            {
                test: /\.scss$/,
                exclude: themStyleFiles.concat(fontStyleFiles),
                use: [
                    'raw-loader',
                    'sass-loader',
                ],
            },
        ],
    },
    // target: 'web',
    // watch: true,
    devServer: {
        historyApiFallback: true,
        port: 8088,
        compress: false,
        publicPath: '/',
    },
}
