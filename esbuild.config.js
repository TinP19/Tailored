const esbuild = require('esbuild');

const isWatch = process.argv.includes('--watch');

const buildOptions = {
  entryPoints: ['src/widget.ts'],
  bundle: true,
  format: 'iife',
  globalName: 'IntentSwap',
  outfile: 'dist/widget.js',
  minify: true,
  sourcemap: false,
  target: ['es2020'],
  platform: 'browser',
  loader: {
    '.json': 'json',
  },
  banner: {
    js: '/* IntentSwap v0.1.0 */',
  },
};

async function build() {
  if (isWatch) {
    const ctx = await esbuild.context(buildOptions);
    await ctx.watch();
    console.log('Watching for changes...');
  } else {
    const result = await esbuild.build(buildOptions);
    console.log('Build complete');
  }
}

build().catch((err) => {
  console.error(err);
  process.exit(1);
});
