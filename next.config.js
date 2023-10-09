/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, context) => {
    if (config.plugins) {
      config.plugins.push(
        new context.webpack.IgnorePlugin({
          resourceRegExp: /^(lokijs|pino-pretty|encoding|supports-color)$/,
        }),
      )
    }
    return config
  },
}

module.exports = nextConfig
