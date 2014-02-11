import Node from "lazy-array/node";

function extendHead(lazy, height) {
  for (var h = lazy.height; h < height; h++) {
    lazy.head.nexts[h] = Node.TAIL;
    lazy.head.lengths[h] = lazy.length;
  }

  lazy.height = height;
}

function findNodeBefore(lazy, index) {
  for (var i = 0, n = lazy.head, h = lazy.height - 1; h >= 0; h--) {
    while (i + n.lengths[h] < index) {
      i += n.lengths[h];
      n = n.nexts[h];
    }
  }

  // Temporarily store the index that the node was found at.
  n.index = i;

  return n;
}

function splitNode(lazy, beforeNode, nodeIndex, index) {
  // debugger;
  var beforeLength = index - nodeIndex;
  var afterLength = beforeNode.lengths[0] - beforeLength;
  var afterStart = beforeNode.start + beforeLength;

  // beforeNode.lengths[0] = beforeLength;
  var afterNode = new Node(height, beforeNode.objects, afterStart, afterLength);
  
  var height = randomHeight(lazy.random);
  if (height > lazy.height) extendHead(lazy, height);

  for (var i = 0, n = lazy.head, h = lazy.height - 1; h >= 0; h--) {
    while (i + n.lengths[h] < index) {
      i += n.lengths[h];
      n = n.nexts[h];
    }

    if (h < height) {
      afterNode.nexts[h] = n.nexts[h];
      n.nexts[h] = afterNode;

      afterNode.lengths[h] = n.lengths[h] - (index - i);
      n.lengths[h] = index - i;
    }
  }
}

function insertNode(lazy, index, objects) {
  var length = objects.length;

  var newNode = new Node(height, objects, 0, length);

  var height = randomHeight(lazy.random);
  if (height > lazy.height) extendHead(lazy, height, index);

  for (var i = 0, n = lazy.head, h = lazy.height - 1; h >= 0; h--) {
    while (i + n.lengths[h] < index) {
      i += n.lengths[h];
      n = n.nexts[h];
    }

    if (h < height) {
      newNode.nexts[h] = n.nexts[h];
      n.nexts[h] = newNode;

      newNode.lengths[h] = length + (i + n.lengths[h]) - index;
      n.lengths[h] = index - i;
    } else {
      n.lengths[h] += length;
    }
  }

  lazy.length += length;
}

function randomHeight(random) {
  var height = 1;

  while (random() < 0.5 && height <= 32) {
    height++;
  }

  return height;
}

export { findNodeBefore, splitNode, insertNode };
