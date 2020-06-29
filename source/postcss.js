export { build as css };

import {
  readFile,
  writeFile,
} from 'fs';
import { join } from 'path';
import { promisify } from 'util';
import postcss from 'postcss';
import atImport from 'postcss-import';
import presetEnv from 'postcss-preset-env';
import cssnano from 'cssnano';

const readPromise = promisify(readFile);
const writePromise = promisify(writeFile);

const partial = (callback, ...head) =>
  (...tail) => callback(...head, ...tail);

const extension = base => `${base}.css`;

function fileNames({
  name,
  input,
  output,
}) {
  const from = join(input, extension(name));
  const to = join(output, extension(name));
  const map = `${to}.map`;

  return [
    from,
    to,
    map,
  ];
}

function createResult(from, to, content) {
  const plugins = [
    atImport(),
    presetEnv({
      stage: 3,
    }),
    cssnano({
      preset: 'default',
    }),
  ];

  const options = {
    from,
    to,
    map: {
      inline: false,
    },
  };

  return postcss(plugins)
    .process(content, options);
}

function writeResult(output, sourceMap, {
  css,
  map,
}) {
  const queue = [
    writePromise(output, css),
    writePromise(sourceMap, map.toString()),
  ];

  return Promise.all(queue);
}

function build(options) {
  const [input, output, sourceMap] = fileNames(options);
  const onSourceResolved = partial(createResult, input, output);
  const onSourceProcessed = partial(writeResult, output, sourceMap);

  return readPromise(input)
    .then(onSourceResolved)
    .then(onSourceProcessed);
}
