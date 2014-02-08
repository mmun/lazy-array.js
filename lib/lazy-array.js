import Node from "lazy-array/node";

var TAIL = new Node(0, []);
TAIL.name = "TAIL";

function LazyArray() {
  this.head = new Node(0);
  this.head.name = "HEAD";

  this.height = 0;
  this.length = 0;
}

LazyArray.prototype.insertObjects = function(index, objects) {
  var i, h, height, node, newNode, temp;

  if (index < 0 || index > this.length) {
    throw new Error("Index out of bounds");
  }

  height = this.randomHeight();
  newNode = new Node(height, objects, 0, objects.length);

  node = this.head;

  // Extend the head if necessary
  if (height > this.height) {
    for (i = this.height; i < height; i++) {
      node.nexts[i] = TAIL;
      node.lengths[i] = this.length + objects.length;
    }
    this.height = height;
  }

  // We begin by searching for the insertion point. Start at the highest
  // `nexts` pointer on the head and continue moving forward until
  // reaching an index which is greater than `index`. If the previous
  // node we encountered starts at `index` then we can simply insert the
  // new node into the skip list, otherwise we need to split it first.
  i = 0;

  for (h = this.height - 1; h >= 0; h--) {
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

  this.length += objects.length;
};

LazyArray.prototype.random = Math.random;

LazyArray.prototype.randomHeight = function() {
  var height = 1;
  while (this.random() < 0.5 && height < 32) {
    height++;
  }
  return height;
};

LazyArray.prototype.flatten = function() {
  var node = this.head, arrays = [];

  while (node) {
    if (node !== this.head && node !== TAIL) {
      arrays.push(node.objects.slice(node.start, node.start + node.length));
    }
    node = node.nexts[0];
  }

  return [].concat.apply([], arrays);
};

LazyArray.prototype.inspect = function() {
  var node = this.head;

  while (node) {
    console.log(node.toString());
    node = node.nexts[0];
  }
};

export default LazyArray;
