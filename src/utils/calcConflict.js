/*
答案冲突比较 比较原则是两两比较
1: 比较相同md5签名items长度是否一致 （有无答案）
2: 如果是枚举类型， 对比枚举值是够一致
3: 比较 items 下的 fields 下的长度是否一致 （画框的数据）
4: 比较答案的文本 label 是否一致
5: 在通过 frameData 的 id 来比较绘制的框是不是在相同的 page 上
6: 最后在比较两个框是否有相交
*/

import _ from 'lodash';

export default class CalcConflict {
  constructor(list) {
    this.answerList = this.resetConflictNumHandler(list);
    this.handleConflict();
    return this.answerList;
  }
  // 重置conflictNum
  resetConflictNumHandler(list) {
    list.forEach((item) => {
      let answers = item.data.userAnswer;
      _.forEach(answers, (answer) => {
        if (answer.conflictNum) answer.conflictNum = null;
        let fields = answer.items || [];
        fields.forEach((item) => {
          if (item.conflictNum) item.conflictNum = null;
          let list = item.fields;
          if (!list) return;
          list.forEach((item) => {
            if (item.conflictNum) item.conflictNum = null;
          });
        });
      });
    });
    return list;
  }

  /**
   * 两两比较
   * @param arr 数组
   * @param callback 回调函数
   *
   */
  compare(arr, callback) {
    let length = arr.length;
    for (let i = 0; i < length - 1; i++) {
      let y = i + 1;
      for (y; y < length; y++) {
        callback(arr[i], arr[y]);
      }
    }
  }

  /**
   * 更新冲突数
   * @param {*} item1
   * @param {*} item2
   */
  updateConflictNum(item1, item2) {
    if (item1) {
      if (item1.conflictNum) item1.conflictNum++;
      else item1.conflictNum = 1;
    }
    if (item2) {
      if (item2.conflictNum) item2.conflictNum++;
      else item2.conflictNum = 1;
    }
  }

  handleConflict() {
    this.compare(this.answerList, (a, b) => {
      let answer1 = a.data.userAnswer;
      let answer2 = b.data.userAnswer;
      this.handleSameKeyCompare(answer1, answer2);
    });
  }

  handleSameKeyCompare(answer1, answer2) {
    _.forEach(answer1, (item1, key) => {
      let item2 = answer2[key];
      let items1 = (item1 && item1.items) || [];
      let items2 = (item2 && item2.items) || [];
      if (items1.length === 0 && items2.length === 0) return true;
      // 1: 比较items的长度是否一致， 一致 true 不一致 false
      let state = this.compareItemsLength(items1, items2);
      if (!state) {
        this.updateConflictNum(item1, item2);
        return;
      }
      // 比较数组种每一项的的差异
      this.compareItem(items1, items2);
    });
  }

  compareItemsLength(items1, items2) {
    if (items1.length !== items2.length) return false;
    return true;
  }

  compareItem(items1, items2) {
    items1.forEach((item1, index) => {
      let item2 = items2[index];
      this.compareEnumLabel(item1, item2);
      this.compareFields(item1.fields, item2.fields);
    });
  }

  // 枚举值判断 enumLabel
  compareEnumLabel(item1, item2) {
    if (item1.enumLabel !== item2.enumLabel) {
      this.updateConflictNum(item1, item2);
    }
  }
  // fields 比较
  compareFields(fields1 = [], fields2 = []) {
    if (fields1.length === 0 && fields2.length === 0) return;
    let [list1, list2] = this.calcMaxFields(fields1, fields2);
    list1.forEach((item1, index) => {
      let item2 = list2[index];
      if (!item2) {
        this.updateConflictNum(item1, {});
        return;
      }
      if (item1.label !== item2.label) {
        this.updateConflictNum(item1, item2);
        return;
      }
      this.compareComponents(item1.components, item2.components);
    });
  }

  calcMaxFields(fields1, fields2) {
    let list = fields1;
    let _list = fields2;
    if (fields2.length > fields1.length) {
      list = fields2;
      _list = fields1;
    }
    return [list, _list];
  }

  compareComponents(com1, com2) {
    let [list1, list2] = this.calcMaxFields(com1, com2);
    list1.forEach((item1, index) => {
      let item2 = list2[index];
      if (item1.text !== item2.text) {
        this.updateConflictNum(item1, item2);
        return;
      }
      let state = this.compareSamePage(item1, item2);
      if (state) return;
      let state1 = this.isContains(item1.frameData, item2.frameData);
      let state2 = this.isContains(item2.frameData, item1.frameData);
      if (!state1 && !state2) {
        this.updateConflictNum(item1, item2);
      }
    });
  }

  compareSamePage(item1, item2) {
    let id1 = item1.frameData.id;
    let id2 = item2.frameData.id;
    if (id1.match(/page\d+/)[0] !== id2.match(/page\d+/)[0]) {
      this.updateConflictNum(item1, item2);
      return true;
    }
    return false;
  }

  calcPosition(item) {
    let { height, topleft, width } = item;
    let [top, left] = topleft;
    left = parseInt(left);
    top = parseInt(top);
    height = parseInt(height);
    width = parseInt(width);
    let right = left + width;
    let bottom = top + height;
    return { top, left, right, bottom };
  }

  parseIntLeftTop(frameData2) {
    let [top, left] = frameData2.topleft;
    return [parseInt(top), parseInt(left)];
  }

  isContains(frameData1, frameData2) {
    let { top, left, right, bottom } = this.calcPosition(frameData1);
    let [_top, _left] = this.parseIntLeftTop(frameData2);
    if (top <= _top && _top < bottom) {
      if (left <= _left && _left < right) {
        return true;
      }
    }
    return false;
  }
}
