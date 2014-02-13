import Operation from "lazy-array/operation";

var env = {
  debugging: false
};


// Traverse the operations at the lowest level while storing
// the sums of the lengths each level that each operation reaches to.
function lengthsByCounting(lazy) {
  var h, operation, lengths = new Array(lazy.height);

  for (h = 0; h < lazy.height; h++) {
    lengths[h] = 0;
  }

  operation = lazy.head;

  while (operation !== Operation.NIL) {
    for (h = 0; h < operation.lengths.length; h++) {
      lengths[h] += operation.lengths[h];
    }

    operation = operation.nexts[0];
  }

  return lengths;
}


// Traverse the operations at each level by following the nexts
// pointers summing the lengths along the way.
function lengthsByTraversal(lazy) {
  var h, operation, lengths = new Array(lazy.height);

  for (h = 0; h < lazy.height; h++) {
    lengths[h] = 0;
  }

  for (h = 0; h < lazy.height; h++) {
    operation = lazy.head;

    while (operation !== Operation.NIL) {
      lengths[h] += operation.lengths[h];
      operation = operation.nexts[h];
    }
  }

  return lengths;
}

// Print out a visual representation of the skip list by arbitrarily
// labeling each operation and representing the nexts pointers by these
// ids. The lengths at each level are also shown.
function inspectSkipList(lazy) {
  var h, out, nexts, lengths, operation, ids, id = 0;

  // Assign a temporary id to each operation
  lazy.head.id = "H";
  operation = lazy.head.nexts[0];

  while (operation !== Operation.NIL) {
    operation.id = (++id).toString();
    operation = operation.nexts[0];
  }

  console.log("Skip list (id, nexts, lengths):");
  console.log("");

  // Log the skip list
  operation = lazy.head;

  while (operation !== Operation.NIL) {
    out = [];
    nexts = [];
    lengths = [];

    out.push(pad(operation.id, 2));
    out.push(" - [ ");

    for (h = 0; h < operation.nexts.length; h++) {
      nexts.push(pad(operation.nexts[h].id, 2));
    }

    out.push(pad(nexts.join(", "), 4 * lazy.height - 1, true));
    out.push("] - [ ");

    for (h = 0; h < operation.lengths.length; h++) {
      lengths.push(pad(operation.lengths[h].toString(), 2));
    }

    out.push(pad(lengths.join(", "), 4 * lazy.height - 1, true));
    out.push(" ]");

    console.log(out.join(""));
      
    operation = operation.nexts[0];
  }

  // Delete temporary ids
  operation = lazy.head;

  while (operation !== Operation.NIL) {
    delete operation.id;
    operation = operation.nexts[0];
  }

  console.log("");
  console.log("Length:", lazy.length);
  console.log("Lengths by counting: [", lengthsByCounting(lazy).join(", "), "]");
  console.log("Lengths by traversal: [", lengthsByTraversal(lazy).join(", "), "]");
}

function inspectSplit(lazy, index) {
  console.log("=============================================");
  console.log("SPLIT - index:", index);
  console.log("");
  inspectSkipList(lazy);
}

function inspectRemove(lazy, index, count) {
  console.log("=============================================");
  console.log("REMOVED - index:", index + ",", "count:", count);
  console.log("");
  inspectSkipList(lazy);
}

function inspectInsert(lazy, index, items) {
  console.log("=============================================");
  console.log("INSERTED - index:", index + ",", "count:", items.length);
  console.log("");
  inspectSkipList(lazy);
}

function pad(str, len, right) {
  while (str.length < len) {
    str = right ? str + " " : " " + str;
  }

  return str;
}

export { env, inspectSplit, inspectRemove, inspectInsert, inspectSkipList };
