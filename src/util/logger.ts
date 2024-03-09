import colors from 'colors/safe';

export const logError = (
  humanText: string,
  error: unknown,
  additionalInfo?: string
) => {
  const err = error instanceof Error ? error : new Error(String(error));
  console.log(
    colors.red(' !!! ' + humanText),
    colors.dim(additionalInfo || ''),
    colors.red(err.message),
    colors.dim(err.stack || '')
  );
};

export const logWarn = (humanText: string, additionalInfo?: string) => {
  console.log(
    colors.yellow(' ==> ' + humanText),
    colors.dim(additionalInfo || '')
  );
};

export const logInfo = (humanText: string, additionalInfo?: string) => {
  console.log(
    colors.cyan(' --> ' + humanText),
    colors.dim(additionalInfo || '')
  );
};
