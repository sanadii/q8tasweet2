const path = require('path');

module.exports = {
    webpack: {
        configure: {
            entry: './src/index.js', // Entry point of your application
            // output: {
            //     // filename: 'bundle.js', // Output bundle file name
            //     path: path.resolve(__dirname, 'build'), // Output directory
            //     publicPath: '/', // Public URL of the output directory when referenced in a browser
            // },
            module: {
                rules: [
                    {
                        test: /\.js$/, // Regex pattern to match JavaScript files
                        exclude: /node_modules/, // Exclude matching files from processing
                        use: 'babel-loader', // Loader to use for processing JavaScript files
                    },
                    // Add more rules for handling other file types (e.g., CSS, images, etc.)
                ],
            },
            // Add more webpack configuration as needed
        },
    },
};
