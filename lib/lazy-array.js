import Node from "lazy-array/node";
import { insertNode } from "lazy-array/helpers";

function LazyArray() {
  this.head = new Node(1);
  this.head.lengths[0] = 0;
  this.head.nexts[0] = Node.TAIL;

  this.head.toString = function() {
    return "<Node:HEAD:[" + this.lengths.join(", ") + "]>";
  };

  this.height = 1;
  this.length = 0;
}

LazyArray.prototype.random = Math.random;

LazyArray.prototype.insertObjects = function(index, objects) {
  if (index < 0 || index > this.length) {
    throw new Error("Index out of bounds");
  }

  insertNode(this, index, objects);
};

LazyArray.prototype.flatten = function() {
  var node = this.head.nexts[0], arrays = [];

  while (node !== Node.TAIL) {
    arrays.push(node.objects.slice(node.start, node.start + node.lengths[0]));
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

  console.log(Node.TAIL.toString());
};

export default LazyArray;
