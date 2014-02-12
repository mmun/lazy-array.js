import Node from "lazy-array/node";
import { removeNodes, insertNode } from "lazy-array/helpers";

function LazyArray() {
  this.head = new Node(1);
  this.head._ID = ++window.node_id;
  this.head.lengths[0] = 0;
  this.head.nexts[0] = Node.TAIL;

  this.height = 1;
  this.length = 0;
}

LazyArray.prototype.random = Math.random;

LazyArray.prototype.replace = function(index, count, objects) {
  this.removeObjects(index, count);
  this.insertObjects(index, objects);
};

LazyArray.prototype.removeObjects = function(index, count) {
if (count < 0 || index < 0 || index + count > this.length) {
    throw new Error("Index out of bounds");
  }

  if (count === 0) return;

  removeNodes(this, index, count);
};

LazyArray.prototype.insertObjects = function(index, objects) {
  if (index < 0 || index > this.length) {
    throw new Error("Index out of bounds");
  }

  if (!objects || objects.length === 0) return;

  insertNode(this, index, objects);
};

LazyArray.prototype.flatten = function() {
  var node = this.head.nexts[0], arrays = [];

  while (node !== Node.TAIL) {
    arrays.push(node.objects.slice(node.offset, node.offset + node.lengths[0]));
    node = node.nexts[0];
  }

  return [].concat.apply([], arrays);
};

LazyArray.prototype.inspect = function() {
  var node = this.head;

  while (node !== Node.TAIL) {
    console.log(node.toString());
    node = node.nexts[0];
  }

  // if (!this.checkLengths()) {
  //   console.log("*** Incorrect lengths by traversal ***");
  // }

  console.log(Node.TAIL.toString());

  console.log("Length:", this.length);
  console.log("Lengths by counting:", this.checkLengthsByCounting());
  console.log("Lengths by traversal:", this.checkLengthsByTraversal());
};


LazyArray.prototype.checkLengthsByCounting = function() {
  var h, node, lengths = new Array(this.height);

  for (h = 0; h < this.height; h++) {
    lengths[h] = 0;
  }

  node = this.head;

  while (node !== Node.TAIL) {
    for (h = 0; h < node.lengths.length; h++) {
      lengths[h] += node.lengths[h];
    }

    node = node.nexts[0];
  }

  return lengths;
};


LazyArray.prototype.checkLengthsByTraversal = function() {
  var h, node, lengths = new Array(this.height);

  for (h = 0; h < this.height; h++) {
    lengths[h] = 0;
  }

  for (h = 0; h < this.height; h++) {
    node = this.head;

    while (node !== Node.TAIL) {
      lengths[h] += node.lengths[h];
      node = node.nexts[h];
    }
  }

  return lengths;
};

export default LazyArray;
