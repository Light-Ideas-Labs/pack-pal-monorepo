import { defineConfig } from 'tsup';
import { copy } from 'esbuild-plugin-copy';

export default defineConfig({
  entry: ['./src'],
  splitting: false,
  sourcemap: true,
  clean: true,
  external: ['node-fetch'],
  esbuildPlugins: [
    copy({
      resolveFrom: 'cwd',
      assets: {
        from: ['./src/modules/common/html-templates/**/*'],
        to:   ['./dist/modules/common/html-templates'],
      },
    }),
  ],
});