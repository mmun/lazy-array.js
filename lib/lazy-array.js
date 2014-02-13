import Operation from "lazy-array/operation";
import { remove, insert } from "lazy-array/algorithms";

function LazyArray() {
  this.head = new Operation(1);
  this.head.lengths[0] = 0;
  this.head.nexts[0] = Operation.NIL;

  this.height = 1;
  this.length = 0;
}

LazyArray.prototype.random = Math.random;

LazyArray.prototype.replace = function(index, count, items) {
  this.remove(index, count);
  this.insert(index, items);
};

LazyArray.prototype.remove = function(index, count) {
if (count < 0 || index < 0 || index + count > this.length) {
    throw new Error("Index out of bounds");
  }

  if (count === 0) return;

  remove(this, index, count);
};

LazyArray.prototype.insert = function(index, items) {
  if (index < 0 || index > this.length) {
    throw new Error("Index out of bounds");
  }

  if (!items || items.length === 0) return;

  insert(this, index, items);
};

LazyArray.prototype.flatten = function() {
  var operation = this.head.nexts[0], arrays = [];

  while (operation !== Operation.NIL) {
    arrays.push(operation.items.slice(operation.offset, operation.offset + operation.lengths[0]));
    operation = operation.nexts[0];
  }

  return [].concat.apply([], arrays);
};

export default LazyArray;
