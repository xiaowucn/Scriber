const path = require('path');

const customRouterPathMap = {
  GFFUND: 'custom/general/route.js',
  CGS: 'custom/general/route.js',
  CMFCHINA: 'custom/cmfchina/route.js',
  CMS: 'custom/general/route.js',
  CCXI: 'custom/ccxi/route.js',
  CCXI_CONTRACT: 'custom/ccxi/route-contract.js',
  CHINAAMC: 'custom/chinaamc/route.js',
  CSC_OCTOPUS: 'custom/csc/route-octopus.js',
  ECITIC: 'custom/ecitic/route.js',
  HKEX: 'custom/hkex/route.js',
  HT: 'custom/ht/route.js',
  SSE: 'custom/sse/route.js',
  SZSE: 'custom/szse/route.js',
  SZSE_ANNUAL: 'custom/szse/route-annual.js',
  SZSE_LDAP: 'custom/szse/route-ipo.js',
  CITICS_TG: 'custom/citics_tg/route.js',
  CITICS_DCM: 'custom/citics_dcm/route.js',
  CHINAAMC_YX: 'custom/chinaamc_yx/route.js',
  CMBCHINA: 'custom/cmbchina/route.js',
  ZTS: 'custom/zts/route.js',
  NAFMII: 'custom/nafmii/route.js',
};

const customThemePathMap = {
  GFFUND: 'custom/general/element-variables.scss',
  CGS: 'custom/general/element-variables.scss',
  ECITIC: 'custom/ecitic/element-variables.scss',
  SZSE: 'custom/szse/element-variables.scss',
  NAFMII: 'custom/nafmii/element-variables.scss',
  CITICS_DCM: 'custom/citics_dcm/element-variables.scss',
};

const customVariablesPathMap = {
  GFFUND: 'custom/general/variables.scss',
  CGS: 'custom/general/variables.scss',
  ECITIC: 'custom/ecitic/variables.scss',
  SZSE: 'custom/szse/variables.scss',
  NAFMII: 'custom/nafmii/variables.scss',
  CITICS_DCM: 'custom/citics_dcm/variables.scss',
};

const getRouterPath = (env) => {
  return path.resolve(
    __dirname,
    'src',
    customRouterPathMap[env] || 'router.js',
  );
};

const getThemePath = (env) => {
  return path.resolve(
    __dirname,
    'src',
    customThemePathMap[env] || 'styles/element-variables.scss',
  );
};

const getVariablesPath = (env) => {
  return path.resolve(
    __dirname,
    'src',
    customVariablesPathMap[env] || 'styles/variables.scss',
  );
};

const getPdfViewer = () => {
  return path.resolve(
    __dirname,
    'src',
    'components/remark/pdf-viewer/DocumentViewer.vue',
  );
};

module.exports = {
  getRouterPath,
  getThemePath,
  getVariablesPath,
  getPdfViewer,
};
