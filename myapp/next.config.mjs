/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["@boundaryml/baml"],
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  webpack: (config, { dev, isServer, webpack, nextRuntime }) => {
    config.module.rules.push({
      test: /\.node$/,
      use: [
        {
          loader: "nextjs-node-loader",
          options: {
            outputPath: config.output.path,
          },
        },
      ],
    });

    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
      syncWebAssembly: true,
      layers: true,
      topLevelAwait: true,
    };

    return config;
  },
};

export default nextConfig;
