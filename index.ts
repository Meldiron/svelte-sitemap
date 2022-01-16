#!/usr/bin/env node

import minimist from 'minimist';
import { version } from './package.json';
import { loadConfig } from './src/helpers/config';
import { mergeOptions } from './src/helpers/global.helper';
import { createSitemap } from './src/index';
import { ChangeFreq, OptionsSvelteSitemap } from './src/interfaces/global.interface';
import { CONFIG_FILE } from './src/vars';

const REPO_URL = 'https://github.com/bartholomej/svelte-sitemap';

let stop = false;

// Load svelte-sitemap.js
const config = loadConfig(CONFIG_FILE);

const args = minimist(process.argv.slice(2), {
  string: ['domain', 'out-dir', 'ignore', 'change-freq'],
  boolean: ['attribution', 'reset-time', 'trailing-slashes', 'debug', 'version'],
  default: { attribution: true, 'trailing-slashes': false, default: false },
  alias: {
    d: 'domain',
    D: 'domain',
    h: 'help',
    H: 'help',
    v: 'version',
    V: 'version',
    O: 'out-dir',
    o: 'out-dir',
    r: 'reset-time',
    R: 'reset-time',
    c: 'change-freq',
    C: 'change-freq',
    i: 'ignore',
    I: 'ignore'
  },
  unknown: (err: string) => {
    console.log('⚠ Those arguments are not supported:', err);
    console.log('Use: `svelte-sitemap --help` for more options.\n');
    stop = true;
    return false;
  }
});

if (args.help || args.version === '' || args.version === true) {
  const log = args.help ? console.log : console.error;
  log('Svelte `sitemap.xml` generator');
  log('');
  log(`svelte-sitemap ${version} (check updates: ${REPO_URL})`);
  log('');
  log('Options:');
  log('');
  log('  -d, --domain            Use your domain (eg. https://example.com)');
  log('  -o, --out-dir           Custom output dir');
  log('  -i, --ignore            Exclude some pages or folders');
  log('  -t, --trailing-slashes  Do you like trailing slashes?');
  log('  -r, --reset-time        Set modified time to now');
  log('  -c, --change-freq       Set change frequency `weekly` | `daily` | …');
  log('  -v, --version           Show version');
  log('  --debug                 Debug mode');
  log(' ');
  process.exit(args.help ? 0 : 1);
} else if (!config.domain && !args.domain) {
  console.log(
    `⚠ svelte-sitemap: --domain argument is required.\n\nSee instructions: ${REPO_URL}\n\nExample:\n\n  svelte-sitemap --domain https://mydomain.com\n`
  );
  process.exit(0);
} else if (
  // (config.domain || args.domain) &&
  !config.domain?.includes('http') &&
  !args.domain?.includes('http')
) {
  console.log(
    `⚠ svelte-sitemap: --domain argument must starts with https://\n\nSee instructions: ${REPO_URL}\n\nExample:\n\n  svelte-sitemap --domain https://mydomain.com\n`
  );
  process.exit(0);
} else if (stop) {
  // Do nothing if there is something suspicious
} else {
  const domain: string = args.domain ? args.domain : undefined;
  const debug: boolean = args.debug === '' || args.debug === true ? true : false;
  const resetTime: boolean =
    args['reset-time'] === '' || args['reset-time'] === true ? true : false;
  const trailingSlashes: boolean =
    args['trailing-slashes'] === '' || args['trailing-slashes'] === true ? true : false;
  const changeFreq: ChangeFreq = args['change-freq'];
  const outDir: string = args['out-dir'];
  const ignore: string = args['ignore'];
  const attribution: boolean =
    args['attribution'] === '' || args['attribution'] === false ? false : true;

  const options: OptionsSvelteSitemap = {
    debug,
    resetTime,
    changeFreq,
    outDir,
    domain,
    attribution,
    ignore,
    trailingSlashes
  };

  createSitemap(mergeOptions(options, config));
}
