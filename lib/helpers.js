import Node from "lazy-array/node";

function extendHead(lazy, height, objects) {
  var h, node = lazy.head;

  for (h = lazy.height; h < height; h++) {
    node.nexts[h] = Node.TAIL;
    node.lengths[h] = lazy.length + objects.length;
  }

  lazy.height = height;
}

function findNode(lazy, index) {
  var h, i = 0, node = lazy.head;

  for (h = lazy.height - 1; h >= 0; h--) {
    while (i + node.lengths[h] <= index) {
      i += node.lengths[h];
      node = node.nexts[h];
    }
  }

  return [i, node];
}

function insertNode(lazy, height, index, objects) {
  var h, i = 0, node = lazy.head;
  var newNode = new Node(height, objects, 0, objects.length);

  for (h = lazy.height - 1; h >= 0; h--) {
    while (i + node.lengths[h] <= index) {
      i += node.lengths[h];
      node = node.nexts[h];
    }

    if (h < height) {
      newNode.nexts[h] = node.nexts[h];
      node.nexts[h] = newNode;

      newNode.lengths[h] = i + node.lengths[h] - index;
      node.lengths[h] = index + objects.length - i;
    } else {
      node.lengths[h] += objects.length;
    }
  }

  lazy.length += objects.length;
}

function randomHeight(random) {
  var height = 1;
  while (random() < 0.5 && height < 32) {
    height++;
  }
  return height;
}

export { extendHead, findNode, insertNode, randomHeight };
