import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  output: "standalone",
  // Prisma v7 generated client + migration files included in standalone build
  outputFileTracingIncludes: {
    '/**': [
      './src/generated/prisma/**/*',
      './prisma/migrations/**/*',
      './prisma/schema.prisma',
    ],
  },
  // better-sqlite3 is a native C++ addon — must be external
  serverExternalPackages: ['better-sqlite3'],
};

export default nextConfig;
