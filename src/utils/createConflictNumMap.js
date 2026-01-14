/*
答案冲突比较 比较原则是两两比较
1: 比较相同schema节点data下的长度是否一致 （有无答案）
2: 比较相同schema节点枚举值是否一致
3: 比较答案的文本 label 是否一致
4: 比较相同答案下的画框个数是否一致 （画框的数据）
5: 最后在比较两个框是否有相交
*/

export function createConflictNumMap(userAnswerList) {
  let conflictMaps = createConflictMapList(userAnswerList);
  handleConflict(userAnswerList, conflictMaps);
  return conflictMaps;
}

/**
 * 两两比较
 * @param arr 数组
 * @param callback 回调函数
 *
 */
function compareAnswers(arr, callback) {
  let length = arr.length;
  for (let i = 0; i < length - 1; i++) {
    let y = i + 1;
    for (y; y < length; y++) {
      callback(arr[i], arr[y]);
    }
  }
}

/**
 * 生成答案冲突的Map数组
 * @param userAnswerList 数组
 *
 */
function createConflictMapList(userAnswerList) {
  return userAnswerList.map((answer) => {
    return {
      uid: answer.uid,
      result: {},
    };
  });
}

/**
 * 更新冲突数
 * @param {*} item1
 * @param {*} item2
 * @param {*} answer1Map
 * @param {*} answer2Map
 */
function updateConflictNum(item1, item2, answer1Map, answer2Map) {
  if (item1) {
    createConflictNumber(item1, answer1Map);
  }
  if (item2) {
    createConflictNumber(item2, answer2Map);
  }
}

function createConflictNumber(answerItem, answerMap) {
  if (answerMap[answerItem.key]) {
    answerMap[answerItem.key] = answerMap[answerItem.key]++;
  } else {
    answerMap[answerItem.key] = 1;
  }
}

function handleConflict(userAnswerList, conflictMaps) {
  compareAnswers(userAnswerList, (a, b) => {
    handleSameNodeCompare(a, b, conflictMaps);
  });
}

function findAnswerItem(answers, key) {
  return answers.find((item) => item.key === key);
}

function sortAnswerMap(a, b, conflictMaps) {
  let answerMap = {
    answer1: [],
    answer2: [],
    answer1Map: {},
    answer2Map: {},
  };
  if (a.data.userAnswer.items.length >= b.data.userAnswer.items.length) {
    answerMap.answer1 = a.data.userAnswer.items;
    answerMap.answer2 = b.data.userAnswer.items;
    answerMap.answer1Map = conflictMaps.find(
      (item) => item.uid === a.uid,
    ).result;
    answerMap.answer2Map = conflictMaps.find(
      (item) => item.uid === b.uid,
    ).result;
  } else {
    answerMap.answer1 = b.data.userAnswer.items;
    answerMap.answer2 = a.data.userAnswer.items;
    answerMap.answer1Map = conflictMaps.find(
      (item) => item.uid === b.uid,
    ).result;
    answerMap.answer2Map = conflictMaps.find(
      (item) => item.uid === a.uid,
    ).result;
  }
  return answerMap;
}

function handleSameNodeCompare(a, b, conflictMaps) {
  let { answer1, answer2, answer1Map, answer2Map } = sortAnswerMap(
    a,
    b,
    conflictMaps,
  );
  answer1.forEach((item1) => {
    // 标记是否都包含答案
    let item2 = findAnswerItem(answer2, item1.key);
    if (!item2) {
      updateConflictNum(item1, item2, answer1Map, answer2Map);
    } else {
      // 比较枚举值是否一致
      if (!isSameEnumVal(item1, item2)) {
        updateConflictNum(item1, item2, answer1Map, answer2Map);
      } else {
        let ans1 = item1.data;
        let ans2 = item2.data;
        // 比较答案个数是否一致
        let isSameAnswerLength = compareAnswerItemLength(ans1, ans2);
        if (!isSameAnswerLength) {
          updateConflictNum(item1, item2, answer1Map, answer2Map);
        } else {
          // 比较答案文本是否一致
          if (!isSameAnswerLabel(ans1, ans2)) {
            updateConflictNum(item1, item2, answer1Map, answer2Map);
          } else {
            // 比较box的数据
            if (!isSameAnswerBoxes(ans1, ans2)) {
              updateConflictNum(item1, item2, answer1Map, answer2Map);
            }
          }
        }
      }
    }
  });
}

function isSameAnswerBoxes(answer1, answer2) {
  if (!isSameBoxesLength(answer1, answer2)) {
    return false;
  }
  if (!isContainBetweenBoxes(answer1, answer2)) {
    return false;
  }
  return true;
}

function isContainBetweenBoxes(answer1, answer2) {
  let boxes1 = [];
  let boxes2 = [];
  answer1.forEach((item) => {
    boxes1.push(...item.boxes);
  });
  answer2.forEach((item) => {
    boxes2.push(...item.boxes);
  });
  return compareBoxes(boxes1, boxes2);
}

function compareBoxes(boxes1, boxes2) {
  for (let i = 0; i < boxes1.length; i++) {
    let curBox = boxes1[i];
    if (!compareRectPosition(curBox, boxes2)) {
      return false;
    }
  }
  return true;
}

function compareRectPosition(curBox, boxes) {
  let isContain = false;
  boxes.forEach((item) => {
    if (item.page === curBox.page && item.text === curBox.text) {
      if (!isContainRect(curBox.box, item.box)) {
        isContain = true;
        return false;
      }
    }
  });
  return isContain;
}

function isContainRect(rect1, rect2) {
  let { left1, top1, right1, bottom1 } = rect1;
  let { left2, top2, right2, bottom2 } = rect2;
  return right2 < left1 || left2 > right1 || bottom2 < top1 || top2 > bottom1;
}

function isSameBoxesLength(answer1, answer2) {
  let ans1Length = 0;
  let ans2Length = 0;
  answer1.forEach((item) => {
    ans1Length += item.boxes.length;
  });
  answer2.forEach((item) => {
    ans2Length += item.boxes.length;
  });
  return ans1Length === ans2Length;
}

function isSameEnumVal(item1, item2) {
  return item1.value === item2.value;
}

function compareAnswerItemLength(answer1, answer2) {
  return answer1.length === answer2.length;
}

function collectAnswerText(answer) {
  let text = [];
  answer.forEach((item) => {
    if (item.text) {
      text.push(item.text);
    } else {
      let txt = item.boxes.map((box) => box.text).join('');
      text.push(txt);
    }
  });
  return text;
}

function isSameAnswerLabel(answer1, answer2) {
  let text1 = collectAnswerText(answer1).sort();
  let text2 = collectAnswerText(answer2).sort();
  return text1.join('') === text2.join('');
}
