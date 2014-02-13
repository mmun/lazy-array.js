import Node from "lazy-array/node";
import { env, inspectSplit, inspectRemove, inspectInsert } from "lazy-array/debug";

var predNodes = new Array(32),
    predIndexes = new Array(32);

function findPredecessors(lazy, index) {
  var i = 0, node = lazy.head;

  for (var h = lazy.height - 1; h >= 0; h--) {
    while (i + node.lengths[h] < index) {
      i += node.lengths[h];
      node = node.nexts[h];
    }

    predNodes[h] = node;
    predIndexes[h] = i;
  }
}

function increaseHeight(lazy, height) {
  for (var h = lazy.height; h < height; h++) {
    lazy.head.nexts[h] = Node.TAIL;
    lazy.head.lengths[h] = lazy.length;

    predNodes[h] = lazy.head;
    predIndexes[h] = 0;
  }

  lazy.height = height;
}

function randomHeight(random) {
  var height = 1;

  while (random() < 0.5 && height <= 32) {
    height++;
  }

  return height;
}

// The split function assumes that the predecessor arrays have been populated.
function splitNode(lazy, index) {
  var predIndex, predNode, beforeNode, afterNode,
      beforeLength, afterLength, afterOffset;

  var nodeHeight = randomHeight(lazy.random);

  if (nodeHeight > lazy.height) {
    increaseHeight(lazy, nodeHeight);
  }

  beforeNode = predNodes[0];
  beforeLength = index - predIndexes[0];
  afterLength = beforeNode.lengths[0] - beforeLength;
  afterOffset = beforeNode.offset + beforeLength;
  afterNode = new Node(nodeHeight, beforeNode.objects, afterOffset, afterLength);

  for (var h = lazy.height - 1; h >= 0; h--) {
    predNode = predNodes[h];
    predIndex = predIndexes[h];

    if (h < nodeHeight) {
      afterNode.nexts[h] = predNode.nexts[h];
      predNode.nexts[h] = afterNode;

      afterNode.lengths[h] = predNode.lengths[h] - (index - predIndex);
      predNode.lengths[h] = index - predIndex;
    }
  }

  if (env.debugging) inspectSplit(lazy, index);
}

function removeNodes(lazy, removeIndex, removeCount) {
  findPredecessors(lazy, removeIndex + removeCount);

  if (removeIndex + removeCount < predIndexes[0] + predNodes[0].lengths[0]) {
    splitNode(lazy, removeIndex + removeCount);
  }

  findPredecessors(lazy, removeIndex);

  if (removeIndex < predIndexes[0] + predNodes[0].lengths[0]) {
    splitNode(lazy, removeIndex);
  }

  var count, index, node, len;

  for (var h = lazy.height - 1; h >= 0; h--) {
    node = predNodes[h];
    index = predIndexes[h];
    count = removeCount;

    while (count > 0) {
      len = (index + node.lengths[h]) - removeIndex;

      if (len === 0) {
        // We don't need to remove elements from the predecessor
        if (count < node.nexts[h].lengths[h]) {
          // Remove elements from the start of the node
          node.lengths[h] += node.nexts[h].lengths[h] - count;
          count = 0;
        } else {
          // Remove entire node
          count -= node.nexts[h].lengths[h];
        }

        node.nexts[h] = node.nexts[h].nexts[h];
      } else {
        // We do need to remove elements from the predecessor
        if (len > count) len = count;
        node.lengths[h] -= len;
        count -= len;
      }
    }
  }

  lazy.length -= removeCount;

  if (env.debugging) inspectRemove(lazy, removeIndex, removeCount);
}

function insertNode(lazy, index, objects) {
  var nodeHeight, predIndex, predNode, newNode;

  findPredecessors(lazy, index);

  nodeHeight = randomHeight(lazy.random);

  if (nodeHeight > lazy.height) {
    increaseHeight(lazy, nodeHeight);
  }

  if (index < predIndexes[0] + predNodes[0].lengths[0]) {
    splitNode(lazy, index);
  }

  newNode = new Node(nodeHeight, objects, 0, objects.length);

  for (var h = lazy.height - 1; h >= 0; h--) {
    predNode = predNodes[h];
    predIndex = predIndexes[h];

    if (h < nodeHeight) {
      newNode.nexts[h] = predNode.nexts[h];
      predNode.nexts[h] = newNode;

      newNode.lengths[h] = (predNode.lengths[h] - (index - predIndex)) + objects.length;
      predNode.lengths[h] = index - predIndex;
    } else {
      predNode.lengths[h] += objects.length;
    }
  }

  lazy.length += objects.length;

  if (env.debugging) inspectInsert(lazy, index, objects);
}

export { removeNodes, insertNode };
