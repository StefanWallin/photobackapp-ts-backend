import colors from 'colors/safe';

export const errorOutput = (error: Error, errorName?: string) => {
  if (errorName) {
    console.error(colors.red(' !!! Error: ' + errorName));
    console.error(colors.yellow(error.message));
  } else {
    console.error(colors.red(' !!! Error: ' + error.message));
  }
  console.error(colors.dim(String(error.stack)));
};
