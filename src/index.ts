import { program } from 'commander';
import colors from 'colors/safe';

import { runPhotoBackApp } from './main';
import { checkFilepath } from './util/file';
import { errorOutput } from './util/errorOutput';

const initialize = async () => {
  program.requiredOption(
    '-l, --libraryPath <path>',
    'Path to the photo library folder'
  );
  program.parse(process.argv);

  const options = program.opts();

  if (options.libraryPath) {
    const writable = await checkFilepath(options.libraryPath);
    if (writable) {
      console.log(
        colors.cyan(' --> Found library at path: '),
        colors.dim(options.libraryPath)
      );
      runPhotoBackApp(options.libraryPath).then(console.log).catch(errorOutput);
    } else {
      errorOutput(
        new Error(` --> The directory does not exist or is not writable.`),
        options.libraryPath
      );
    }
  }
};

initialize();
