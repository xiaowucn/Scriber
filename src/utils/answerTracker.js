/**
 * 跟踪 answer 和 schemaItem之间的关系
 */
export const AnswerTracker = {
  init() {
    this.nodeAnswerMap = new Map();
    this.answerNodeMap = new Map();
  },
  select(key) {
    return {
      getAnswer: () => {
        return this.nodeAnswerMap.get(key);
      },
      getTreeNode: () => {
        return this.answerNodeMap.get(key);
      },
    };
  },
  /**
   * 为 answer 和 treeNode 建立关联
   * @param {Object} answer 答案
   * @param {Object} treeNode 答案树的节点
   */
  link(answer, treeNode) {
    this.answerNodeMap.set(answer, treeNode);
    this.nodeAnswerMap.set(treeNode, answer);
  },
  unlink(item) {
    let treeNode, answer;
    if (this.answerNodeMap.has(item)) {
      answer = item;
      treeNode = this.answerNodeMap.get(answer);
    } else if (this.nodeAnswerMap.has(item)) {
      treeNode = item;
      answer = this.nodeAnswerMap.get(treeNode);
    }
    let count = 0;
    if (treeNode) {
      this.nodeAnswerMap.delete(treeNode);
      count += 1;
    }
    if (answer) {
      this.answerNodeMap.delete(answer);
      count += 1;
    }
    return count;
  },
  eachAnswer(callback) {
    this.answerNodeMap.forEach(callback);
  },
};
