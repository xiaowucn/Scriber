import {
  file as fileApi,
  cgs as cgsApi,
  cmfchina as cmfchinaApi,
  nafmii as nafmiiApi,
} from '../api';
import { searchFile } from '../api/citics-tg.api';
import { getFileDownloadUrl } from '../api/detail.api';
import _ from 'lodash';
import platformPerimeter from '@/perimeters/platform.perimeter';
import { convertObjectValueToNumber } from '@/utils';
import { setDownloadUrl } from '@/custom/cgs/utils';

const state = {
  isLoading: false,
  allfiles: [],
  fileList: [],
  filesBySearch: [],
  fileSearchParams: {},
  fileSortParams: {},
  pager: {
    page: 1,
    size: 20,
    total: 0,
  },
  selectedFiles: [],
  expandedFiles: [],
  lastOpendedQuestionId: null,
  scrollTop: 0,
  jumpToFileInfo: null,
};

const getters = {
  allfiles: (state) => state.allfiles,
  fileList: (state) => state.fileList,
  filesBySearch: (state) => state.filesBySearch,
  fileSearchParams: (state) => state.fileSearchParams,
  fileSortParams: (state) => state.fileSortParams,
  isLoading: (state) => state.isLoading,
  schemaFiles: (state) => groupSchemaFiles(state.allfiles),
  pager: (state) => state.pager,
  selectedFiles: (state) => state.selectedFiles,
  expandedFiles: (state) => state.expandedFiles,
  lastOpendedQuestionId: (state) => state.lastOpendedQuestionId,
  scrollTop: (state) => state.scrollTop,
  jumpToFileInfo: (state) => state.jumpToFileInfo,
};

const mutations = {
  SET_ALL_FILES: (state, allfiles) => {
    state.allfiles = allfiles;
  },
  SET_SEARCH_FILES: (state, files) => {
    state.filesBySearch = files;
    state.filesBySearch.forEach((file) => {
      if (file.questions) {
        file.questions.sort((a, b) => b.mold - a.mold);
      }
    });
  },
  SET_FILE_LIST: (state, files) => {
    state.fileList = files;
  },
  SET_FILE_SEARCH_PARAMS: (state, params) => {
    state.fileSearchParams = convertObjectValueToNumber(params);
  },
  SET_FILE_SORT_PARAMS: (state, params) => {
    state.fileSortParams = params;
  },
  SET_FILE_PAGER: (state, pager) => {
    state.pager = pager;
  },
  SET_ALL_LOADING: (state, isLoading) => {
    state.isLoading = isLoading;
  },
  SET_SELECTED_FILES: (state, files) => {
    state.selectedFiles = files;
  },
  SET_EXPANDED_FILES: (state, rows) => {
    state.expandedFiles = rows;
  },
  SET_LAST_OPENED_QUESTION_ID: (state, fileId) => {
    state.lastOpendedQuestionId = fileId;
  },
  SET_SCROLL_TOP: (state, scrollTop) => {
    state.scrollTop = scrollTop;
  },
  SET_JUMP_TO_FILE_INFO: (state, fileInfo) => {
    state.jumpToFileInfo = fileInfo;
  },
};

const actions = {
  async fetchAllFiles({ commit }, { projectId, query = {} }) {
    let res = {};
    if (platformPerimeter.isCgsEnv()) {
      res = await cgsApi.fetchFilesByStatus(projectId, query);
    } else if (platformPerimeter.isNafmiiEnv()) {
      res = await nafmiiApi.searchFiles(projectId, query);
    } else {
      res = await fileApi.fetchAllFiles(projectId, query);
    }
    const data = res.data || res;
    commit('SET_FILE_PAGER', {
      page: query.page,
      size: query.size,
      total: data.total,
    });
    const items = data.items || data.files;
    augmentFile(items);
    commit('SET_ALL_FILES', items);
  },
  async fetchFileBySearch({ commit }, { projectId, query, isCustom = false }) {
    let res = {};
    if (platformPerimeter.isCmfchinaEnv()) {
      res = await cmfchinaApi.searchFiles(projectId, query);
    } else if (platformPerimeter.isCgsEnv()) {
      res = await cgsApi.searchFile(query);
      setDownloadUrl(res.data.items);
    } else if (platformPerimeter.isCiticsTGEnv() && isCustom) {
      res = await searchFile(query);
    } else {
      res = await fileApi.searchFile(query);
    }
    const { data } = res;
    augmentFile(data.items);
    commit('SET_SEARCH_FILES', data.items);
    commit('SET_FILE_PAGER', {
      page: data.page || query.page,
      size: data.size || query.size,
      total: data.total,
    });
    commit('detailModule/SET_FILES', data.items, { root: true }); // 同步改动 上一篇、下一篇 文件列表
  },
  async fetchFilesByStatus(
    { commit },
    { projectId, query, canSearch = false },
  ) {
    let params = { ...query };
    if (canSearch) {
      params = {
        ...params,
        ...state.fileSortParams,
        ...state.fileSearchParams,
      };
    }
    let fetchFilesByStatusApi = fileApi.fetchFilesByStatus;
    if (platformPerimeter.isCgsEnv()) {
      fetchFilesByStatusApi = cgsApi.fetchFilesByStatus;
    } else if (platformPerimeter.isNafmiiEnv()) {
      fetchFilesByStatusApi = nafmiiApi.searchFiles;
    }
    const res = await fetchFilesByStatusApi(projectId, params);
    const data = res.data || res;
    const items = data.items || data.files;
    if (platformPerimeter.isCgsEnv()) {
      setDownloadUrl(items);
    }
    augmentFile(items);
    commit('SET_FILE_LIST', items);
    commit('SET_FILE_PAGER', {
      page: data.page || state.pager.page,
      size: data.size || state.pager.size,
      total: data.total,
    });
    commit(
      'detailModule/SET_FILES_PAGER',
      {
        page: query.page,
        size: 20,
        total: data.total,
      },
      { root: true },
    );
    commit('detailModule/SET_FILES', items, { root: true }); // 同步改动 上一篇、下一篇 文件列表
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};

function augmentFile(files) {
  for (let i = 0; i < files.length; i++) {
    const f = files[i];
    f.download = getFileDownloadUrl(f.id);
    f.fileType = f.name;
  }
}

function groupSchemaFiles(files) {
  const schemaFiles = {};

  files.forEach((file) => {
    const molds = file.molds || file.mold_list;
    molds.forEach((mold) => {
      if (!schemaFiles[mold]) {
        schemaFiles[mold] = [];
      }

      const exists = schemaFiles[mold].some((item) => item.id === file.id);
      if (!exists) {
        schemaFiles[mold].push(_.cloneDeep(file));
      }
    });
  });

  return schemaFiles;
}
