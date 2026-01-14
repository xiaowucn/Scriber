import { cgs as cgsApi } from '@/store/api';
export function setDownloadUrl(files) {
  files.forEach((file) => {
    if (file.task_type === 'clean_file') {
      if (file.meta_info?.clean_file?.docx) {
        file.downloadUrlByWord = cgsApi.getCleanFileDownloadUrl(
          file.id,
          'word',
        );
      }
      if (file.meta_info?.clean_file?.pdf) {
        file.downloadUrlByPdf = cgsApi.getCleanFileDownloadUrl(file.id, 'pdf');
      }
    }
  });
}
