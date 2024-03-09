import { program } from 'commander';

import { runInitializers } from './initialization/run';
import { checkFilepath } from './util/file';
import { logError, logInfo } from './util/logger';

const processArgsAndStart = async () => {
  program.requiredOption(
    '-l, --libraryPath <path>',
    'Path to the photo library folder'
  );
  program.parse(process.argv);
  const options = program.opts();

  if (!options.libraryPath) {
    logError('The library path is required.', new Error(), options.libraryPath);
  }

  const writable = await checkFilepath(options.libraryPath);
  if (!writable) {
    logError(
      'The directory does not exist or is not writable.',
      new Error(),
      options.libraryPath
    );
    return;
  }

  logInfo('Found library at path:', options.libraryPath);
  runInitializers(options.libraryPath);
};

processArgsAndStart();
