import Node from "lazy-array/node";
import { removeNodes, insertNode } from "lazy-array/algorithms";

function LazyArray() {
  this.head = new Node(1);
  this.head.lengths[0] = 0;
  this.head.nexts[0] = Node.TAIL;

  this.height = 1;
  this.length = 0;
}

LazyArray.prototype.random = Math.random;

LazyArray.prototype.replace = function(index, removeCount, objectsToInsert) {
  this.removeObjects(index, removeCount);
  this.insertObjects(index, objectsToInsert);
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

export default LazyArray;
