import { http, uploadTimeout } from './http';

export const fetchCompareTasks = (params) => {
  return http.get('/plugins/chinaamc_yx/compare-tasks', { params });
};

export const createTask = (data) => {
  return http.post(`/plugins/chinaamc_yx/compare-tasks`, data);
};

export const deleteTask = (taskId) => {
  return http.delete(`/plugins/chinaamc_yx/compare-tasks/${taskId}`);
};

export const uploadFile = (taskId, data, onUploadProgress) => {
  return http.post(`/plugins/chinaamc_yx/compare-tasks/${taskId}/files`, data, {
    onUploadProgress,
    timeout: uploadTimeout,
  });
};

export const deleteFile = (taskId, fileId) => {
  return http.delete(
    `/plugins/chinaamc_yx/compare-tasks/${taskId}/files/${fileId}`,
  );
};

export const fetchTaskFiles = (taskId, params) => {
  return http.get(`/plugins/chinaamc_yx/compare-tasks/${taskId}/files`, {
    params,
  });
};

export const diff = (taskId, params) => {
  return http.get(
    `/plugins/chinaamc_yx/compare-tasks/${taskId}/actions/start`,
    { params },
  );
};

export const redo = (taskId, params) => {
  return http.get(`/plugins/chinaamc_yx/compare-tasks/${taskId}/actions/redo`, {
    params,
  });
};

export const redoChapter = (taskId, params) => {
  return http.get(
    `/plugins/chinaamc_yx/compare-tasks/${taskId}/chapter-diff/actions/redo`,
    {
      params,
    },
  );
};

export const fetchTaskCompareAnswer = (taskId) => {
  return http.get(
    `/plugins/chinaamc_yx/compare-tasks/${taskId}/consistency-answer`,
  );
};

export const fetchFileCompareAnswer = (taskId, fileId) => {
  return http.get(
    `/plugins/chinaamc_yx/compare-tasks/${taskId}/files/${fileId}/answer`,
  );
};

export const fetchChapterCompareAnswer = (taskId, params) => {
  return http.get(
    `/plugins/chinaamc_yx/compare-tasks/${taskId}/chapter-diff-answer`,
    { params },
  );
};

export const fetchFileSamples = (params) => {
  return http.get(`/plugins/chinaamc_yx/samples`, { params });
};
