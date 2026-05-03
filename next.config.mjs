import path from 'path'
import { fileURLToPath } from 'url'

// Pin Turbopack root to this app when a parent directory also has a lockfile (e.g. ~/package-lock.json)
const projectRoot = path.dirname(fileURLToPath(import.meta.url))

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  serverExternalPackages: ['pg', 'bcryptjs'],
  turbopack: {
    root: projectRoot,
  },
}

export default nextConfig
