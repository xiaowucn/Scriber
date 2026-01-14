export const checkCustomVersion = (systemName) => {
  const pathSplit = location.hash.slice(1).split('/');

  if (pathSplit.length > 3) {
    const pathSystem = pathSplit[1];
    const pathVersion = pathSplit[2];

    if (pathSystem === systemName.toLowerCase() && /^v\d+$/.test(pathVersion)) {
      return pathVersion;
    } else {
      return void 0;
    }
  } else {
    return void 0;
  }
};
