import Node from "lazy-array/node";
import { extendHead, findNode, insertNode, randomHeight } from "lazy-array/helpers";

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

  height = randomHeight(this.random);

  if (height > this.height) {
    extendHead(this, height, objects);
  }

  insertNode(this, height, index, objects);
};

LazyArray.prototype.random = Math.random;

LazyArray.prototype.flatten = function() {
  var node = this.head, arrays = [];

  while (node) {
    if (node !== this.head && node !== Node.TAIL) {
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
