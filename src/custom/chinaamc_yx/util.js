import { v4 as uuid4 } from 'uuid';

export function formatDiffData(diffData, leftFileId, rightFileId) {
  diffData.forEach((item) => {
    item.leftBoxes = formatBox(item.left_box, leftFileId, item.type, item.id);
    if (item.left_similar_boxes) {
      item.leftBoxes = item.leftBoxes.concat(
        formatBox(item.left_similar_boxes, leftFileId, 'similar', item.id),
      );
    }
    item.leftBlocks = formatBox(
      item.left_outline || [],
      leftFileId,
      item.type,
      item.id,
    );

    item.rightBoxes = formatBox(
      item.right_box,
      rightFileId,
      item.type,
      item.id,
    );
    if (item.right_similar_boxes) {
      item.rightBoxes = item.rightBoxes.concat(
        formatBox(item.right_similar_boxes, rightFileId, 'similar', item.id),
      );
    }
    item.rightBlocks = formatBox(
      item.right_outline || [],
      rightFileId,
      item.type,
      item.id,
    );

    if (item.sub_file_id) {
      item.rightBoxes.forEach((box) => {
        box.fileId = item.sub_file_id;
      });
      item.rightBlocks.forEach((box) => {
        box.fileId = item.sub_file_id;
      });
    }

    item.leftFirstBox =
      item.leftBoxes && item.leftBoxes.length > 0
        ? item.leftBoxes[0]
        : item.leftBlocks && item.leftBlocks.length > 0
          ? item.leftBlocks[0]
          : null;
    item.rightFirstBox =
      item.rightBoxes && item.rightBoxes.length > 0
        ? item.rightBoxes[0]
        : item.rightBlocks && item.rightBlocks.length > 0
          ? item.rightBlocks[0]
          : null;
  });
  return diffData;
}

export function formatBox(box, fileId, type, id) {
  const rects = [];
  Object.keys(box).forEach((key) => {
    if (/page\d+/.test(key)) {
      const page = Number(key.substring(4));
      box[key].forEach((outline) =>
        rects.push({
          id: uuid4(),
          page,
          outline,
          fileId,
          type,
          diffIndex: id,
        }),
      );
    }
  });

  return rects;
}
