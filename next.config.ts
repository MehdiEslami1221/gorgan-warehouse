import type { NextConfig } from 'next';
const config: NextConfig = { output: 'standalone', outputFileTracingRoot: process.cwd(), poweredByHeader: false, experimental: { cpus: 2 }, serverExternalPackages: ['node:sqlite'] };
export default config;
