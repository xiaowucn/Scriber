import { createPerimeter } from 'vue-kindergarten';

export default createPerimeter({
  purpose: 'platform',

  isCustomerEnv() {
    return !!import.meta.env.VITE_DIST;
  },

  // 中诚信国际
  isCcxiEnv() {
    return import.meta.env.VITE_DIST === 'CCXI';
  },

  // 中诚信国际合同提取
  isCcxiContractEnv() {
    return import.meta.env.VITE_DIST === 'CCXI_CONTRACT';
  },

  // 银河证券
  isCgsEnv() {
    return import.meta.env.VITE_DIST === 'CGS';
  },

  // 中信建投
  isCscEnv() {
    return import.meta.env.VITE_DIST === 'CSC';
  },

  // 中信建投-八爪鱼
  isCscOctopusEnv() {
    return import.meta.env.VITE_DIST === 'CSC_OCTOPUS';
  },

  // 港交所
  isHkexEnv() {
    return import.meta.env.VITE_DIST === 'HKEX';
  },

  // 上交所
  isSseEnv() {
    return import.meta.env.VITE_DIST === 'SSE';
  },

  // 深交所
  isSzseEnv() {
    return import.meta.env.VITE_DIST === 'SZSE';
  },

  // 深交所-年报审核
  isSzseAnnualEnv() {
    return import.meta.env.VITE_DIST === 'SZSE_ANNUAL';
  },

  // 深交所-IDAP
  isSzseIdapEnv() {
    return import.meta.env.VITE_DIST === 'SZSE_LDAP';
  },

  // Stencil
  isStencilEnv() {
    return import.meta.env.VITE_DIST === 'STENCIL';
  },

  // 中信证券
  isEciticEnv() {
    return import.meta.env.VITE_DIST === 'ECITIC';
  },

  // 海通
  isHtEnv() {
    return import.meta.env.VITE_DIST === 'HT';
  },

  // 广发基金
  isGffundEnv() {
    return import.meta.env.VITE_DIST === 'GFFUND';
  },

  // 招商证券
  isCmsEnv() {
    return import.meta.env.VITE_DIST === 'CMS';
  },

  // 招商基金
  isCmfchinaEnv() {
    return import.meta.env.VITE_DIST === 'CMFCHINA';
  },

  // 华夏基金
  isChinaamcEnv() {
    return import.meta.env.VITE_DIST === 'CHINAAMC';
  },

  // 华夏基金-营销部
  isChinaamcYxEnv() {
    return import.meta.env.VITE_DIST === 'CHINAAMC_YX';
  },

  // 中国银行间市场交易商协会
  isNafmiiEnv() {
    return import.meta.env.VITE_DIST === 'NAFMII';
  },

  // Stronghold
  isStrongholdEnv() {
    return import.meta.env.VITE_DIST === 'stronghold';
  },

  // 中信托管
  isCiticsTGEnv() {
    return import.meta.env.VITE_DIST === 'CITICS_TG';
  },

  // 中信DCM
  isCiticsDCMEnv() {
    return import.meta.env.VITE_DIST === 'CITICS_DCM';
  },

  // 富国基金
  isFullgoalEnv() {
    return import.meta.env.VITE_DIST === 'FULLGOAL';
  },

  // 招商银行
  isCmbchinaEnv() {
    return import.meta.env.VITE_DIST === 'CMBCHINA';
  },

  // 中泰证券
  isZtsEnv() {
    return import.meta.env.VITE_DIST === 'ZTS';
  },

  isDefaultEnv() {
    return (
      !this.isCustomerEnv() ||
      this.isChinaamcEnv() ||
      this.isChinaamcYxEnv() ||
      this.isNafmiiEnv() ||
      this.isGffundEnv() ||
      this.isCmsEnv() ||
      this.isCmfchinaEnv() ||
      this.isCgsEnv() ||
      this.isEciticEnv() ||
      this.isSzseEnv() ||
      this.isSseEnv() ||
      this.isCscOctopusEnv() ||
      this.isStencilEnv() ||
      this.isStrongholdEnv() ||
      this.isCiticsTGEnv() ||
      this.isCiticsDCMEnv() ||
      this.isFullgoalEnv() ||
      this.isCmbchinaEnv() ||
      this.isZtsEnv()
    );
  },

  expose: [
    'isDefaultEnv',
    'isCustomerEnv',
    'isCcxiEnv',
    'isCcxiContractEnv',
    'isCgsEnv',
    'isCscEnv',
    'isCscOctopusEnv',
    'isHkexEnv',
    'isSseEnv',
    'isSzseEnv',
    'isSzseIdapEnv',
    'isSzseAnnualEnv',
    'isStencilEnv',
    'isEciticEnv',
    'isHtEnv',
    'isGffundEnv',
    'isCmsEnv',
    'isCmfchinaEnv',
    'isChinaamcEnv',
    'isChinaamcYxEnv',
    'isNafmiiEnv',
    'isStrongholdEnv',
    'isCiticsTGEnv',
    'isCiticsDCMEnv',
    'isFullgoalEnv',
    'isCmbchinaEnv',
    'isZtsEnv',
  ],
});
