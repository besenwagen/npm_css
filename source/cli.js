#!/usr/bin/env node

import { argv, exit } from 'process';
import { css } from './postcss.js';

const ARGUMENTS = 5;
const PREFIX = 2;
const SUCCES_CODE = 0;
const ERROR_CODE = 1;

if (argv.length !== ARGUMENTS) {
  console.error('Error: expected three arguments');
  exit(ERROR_CODE);
}

const [name, input, output] = argv.slice(PREFIX);

function onSuccess() {
  console.info('Done');
  exit(SUCCES_CODE);
}

function onError(reason) {
  console.error('Error:', reason);
  exit(ERROR_CODE);
}

css({
  name,
  input,
  output,
})
  .then(onSuccess)
  .catch(onError);
