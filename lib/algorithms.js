import Operation from "lazy-array/operation";
import { env, inspectSplit, inspectRemove, inspectInsert } from "lazy-array/debug";

var prevOperations = new Array(32),
    prevIndexes = new Array(32);

function randomHeight(random) {
  var height = 1;

  while (random() < 0.5 && height <= 32) {
    height++;
  }

  return height;
}

function increaseHeight(lazy, height) {
  for (var h = lazy.height; h < height; h++) {
    lazy.head.nexts[h] = Operation.NIL;
    lazy.head.lengths[h] = lazy.length;

    prevOperations[h] = lazy.head;
    prevIndexes[h] = 0;
  }

  lazy.height = height;
}

function findOperations(lazy, index) {
  var h, i = 0, operation = lazy.head;

  for (h = lazy.height - 1; h >= 0; h--) {
    while (i + operation.lengths[h] < index) {
      i += operation.lengths[h];
      operation = operation.nexts[h];
    }

    prevOperations[h] = operation;
    prevIndexes[h] = i;
  }
}

// The split function assumes that the predecessor arrays have been populated.
function split(lazy, index) {
  var h, prevIndex, prevOperation,
      leftOperation, leftLength,
      rightOperation, rightLength, rightOffset, rightOperationHeight;

  rightOperationHeight = randomHeight(lazy.random);

  if (rightOperationHeight > lazy.height) {
    increaseHeight(lazy, rightOperationHeight);
  }

  leftOperation = prevOperations[0];
  leftLength = index - prevIndexes[0];
  rightLength = leftOperation.lengths[0] - leftLength;
  rightOffset = leftOperation.offset + leftLength;
  rightOperation = new Operation(rightOperationHeight, leftOperation.items, rightOffset, rightLength);

  for (h = lazy.height - 1; h >= 0; h--) {
    prevOperation = prevOperations[h];
    prevIndex = prevIndexes[h];

    if (h < rightOperationHeight) {
      rightOperation.nexts[h] = prevOperation.nexts[h];
      prevOperation.nexts[h] = rightOperation;

      rightOperation.lengths[h] = prevOperation.lengths[h] - (index - prevIndex);
      prevOperation.lengths[h] = index - prevIndex;
    }
  }

  if (env.debugging) inspectSplit(lazy, index);
}

function remove(lazy, index, count) {
  var h, countLeft, operation, len;

  findOperations(lazy, index + count);

  if (index + count < prevIndexes[0] + prevOperations[0].lengths[0]) {
    split(lazy, index + count);
  }

  findOperations(lazy, index);

  if (index < prevIndexes[0] + prevOperations[0].lengths[0]) {
    split(lazy, index);
  }

  for (h = lazy.height - 1; h >= 0; h--) {
    operation = prevOperations[h];
    countLeft = count;

    while (countLeft > 0) {
      len = (prevIndexes[h] + operation.lengths[h]) - index;

      if (len === 0) {
        // We don't need to remove elements from the predecessor
        if (countLeft < operation.nexts[h].lengths[h]) {
          // Remove elements from the start of the operation
          operation.lengths[h] += operation.nexts[h].lengths[h] - countLeft;
          countLeft = 0;
        } else {
          // Remove entire operation
          countLeft -= operation.nexts[h].lengths[h];
        }

        operation.nexts[h] = operation.nexts[h].nexts[h];
      } else {
        // We do need to remove elements from the predecessor
        if (len > countLeft) len = countLeft;
        operation.lengths[h] -= len;
        countLeft -= len;
      }
    }
  }

  lazy.length -= count;

  if (env.debugging) inspectRemove(lazy, index, count);
}

function insert(lazy, index, items) {
  var h, prevIndex, prevOperation,
      newOperation, newOperationHeight;

  findOperations(lazy, index);

  newOperationHeight = randomHeight(lazy.random);

  if (newOperationHeight > lazy.height) {
    increaseHeight(lazy, newOperationHeight);
  }

  if (index < prevIndexes[0] + prevOperations[0].lengths[0]) {
    split(lazy, index);
  }

  newOperation = new Operation(newOperationHeight, items, 0, items.length);

  for (h = lazy.height - 1; h >= 0; h--) {
    prevOperation = prevOperations[h];
    prevIndex = prevIndexes[h];

    if (h < newOperationHeight) {
      newOperation.nexts[h] = prevOperation.nexts[h];
      prevOperation.nexts[h] = newOperation;

      newOperation.lengths[h] = (prevOperation.lengths[h] - (index - prevIndex)) + items.length;
      prevOperation.lengths[h] = index - prevIndex;
    } else {
      prevOperation.lengths[h] += items.length;
    }
  }

  lazy.length += items.length;

  if (env.debugging) inspectInsert(lazy, index, items);
}

export { remove, insert };
