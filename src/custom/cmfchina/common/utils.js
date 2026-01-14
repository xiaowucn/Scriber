import store from '@/store';
import featuresPerimeter from '../../../perimeters/features.perimeter';
import { checkUploadFile, checkUploadFileType, isUploadZipFile } from '@/utils';
import { FIELD_STATUS_MAP } from './constant';

export const beforeFileUpload = (file, acceptTypes, limitSize) => {
  let isChecked;
  if (isUploadZipFile(file)) {
    isChecked = checkUploadFileType(file.name, acceptTypes);
  } else {
    isChecked = checkUploadFile(file, acceptTypes, limitSize);
  }
  return isChecked;
};

export function cmfchinaPermAllowed(item) {
  const user = store.getters['loginUser'];
  const paramPerms = user.param_perms;
  return paramPerms?.includes(item);
}

export function getFieldStatus(
  answerItem,
  schemaResults,
  groupAnswerItems = [],
  probabilityThreshold = 90,
) {
  const fieldAuditResults = schemaResults.filter((item) => {
    return item.schema_results.some((sr) => {
      if (groupAnswerItems.length > 0) {
        return groupAnswerItems.some((i) => i.key === sr.path);
      }
      if (!sr.path) {
        return false;
      }
      return answerItem?.key === sr.path;
    });
  });

  if (groupAnswerItems.length > 0) {
    if (groupAnswerItems.some((item) => item.record)) {
      return FIELD_STATUS_MAP.MODIFIED;
    }
  }

  if (answerItem?.record) {
    return FIELD_STATUS_MAP.MODIFIED;
  }

  if (fieldAuditResults.length === 0) {
    if (groupAnswerItems.length > 0) {
      if (
        groupAnswerItems.some((item) => {
          const score = Number(item.score) * 100;
          return score > 0 && score < probabilityThreshold;
        })
      ) {
        return FIELD_STATUS_MAP.PROBABILITY;
      }
    }

    const score = Number(answerItem?.score) * 100;
    if (score > 0 && score < probabilityThreshold) {
      return FIELD_STATUS_MAP.PROBABILITY;
    }

    return FIELD_STATUS_MAP.UN_AUDIT;
  }

  if (fieldAuditResults.some((r) => r.is_compliance === false)) {
    return FIELD_STATUS_MAP.FAIL_AUDIT;
  }

  if (fieldAuditResults.every((r) => r.is_compliance === true)) {
    return FIELD_STATUS_MAP.AUDIT;
  }

  return FIELD_STATUS_MAP.NA;
}

export function getWidgetClassNames(auditFailed) {
  if (featuresPerimeter.showFieldAuditStatusInAnswer()) {
    return auditFailed ? ['red'] : [];
  }
  return [];
}

export function getFieldProbability(allFieldsProbabilities, fieldId) {
  const probability = allFieldsProbabilities.find(
    (i) => i.field_id === fieldId,
  )?.probability;
  return probability;
}
