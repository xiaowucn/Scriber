#!/usr/bin/env bash

set -ex
set -o pipefail

run() {
  "$@"
  _exit_code=$?
  if [ ${_exit_code} -ne 0 ]; then
    echo "Error: exec $* with exit code ${_exit_code}."
    exit ${_exit_code}
  fi
}

build() {
  if [[ "${1}" == 'dist' ]]; then
    yarn build
  elif [[ "${1}" == 'szse' ]]; then
    # 原始构建 szse 如下
    # yarn build-szseldap
    # mv dist dist_szse
    yarn build-szseldap
  elif [[ "${1}" == 'szse_ipo' ]]; then
    # 原始构建 szse_ipo 如下
    # yarn build-szse
    # mv dist dist_szse_ipo
    yarn build-szse
  else
    yarn build-"${1}"
  fi

  rm -rf dist/report.html dist/health-monitoring-check.html
  find dist -type f -size +100c -print0 | xargs -0 -I {} -P 5 gzipper compress --gzip --gzip-level=5 --zstd --zstd-level=3 --no-color "{}" 1>/dev/null

  if [[ "${1}" == 'dist' ]]; then
    return
  fi

  mv dist "dist_${1}"

}

rm -rf dist*
run yarn install

#targets=(szse szse_ipo sse csc ecitic citics_tg citics_dcm ccxi ccxi_contract hkex stencil ht cmbchina csc_octopus
#  cgs gffund chinaamc stronghold cmfchina cms chinaamc_yx nafmii fullgoal dist)

run build "${BUILD_TARGET,,}"
