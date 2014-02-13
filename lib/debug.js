import Node from "lazy-array/node";

var env = {
  debugging: false
};


// Traverse the nodes at the lowest level while storing
// the sums of the lengths each level that each node
// reaches to.
function lengthsByCounting(lazy) {
  var h, node, lengths = new Array(lazy.height);

  for (h = 0; h < lazy.height; h++) {
    lengths[h] = 0;
  }

  node = lazy.head;

  while (node !== Node.TAIL) {
    for (h = 0; h < node.lengths.length; h++) {
      lengths[h] += node.lengths[h];
    }

    node = node.nexts[0];
  }

  return lengths;
}


// Traverse the nodes at each level by following the nexts
// pointers summing the lengths along the way.
function lengthsByTraversal(lazy) {
  var h, node, lengths = new Array(lazy.height);

  for (h = 0; h < lazy.height; h++) {
    lengths[h] = 0;
  }

  for (h = 0; h < lazy.height; h++) {
    node = lazy.head;

    while (node !== Node.TAIL) {
      lengths[h] += node.lengths[h];
      node = node.nexts[h];
    }
  }

  return lengths;
}

// Print out a visual representation of the skip list by arbitrarily
// labeling each node and representing the nexts pointers by these ids.
// The lengths at each level are also shown.
function inspectSkipList(lazy) {
  var h, out, nexts, lengths, node, ids, id = 0;

  // Assign a temporary id to each node
  lazy.head.id = "H";
  node = lazy.head.nexts[0];

  while (node !== Node.TAIL) {
    node.id = (++id).toString();
    node = node.nexts[0];
  }

  console.log("Skip list (id, nexts, lengths):");

  // Log the skip list
  node = lazy.head;

  while (node !== Node.TAIL) {
    out = [];
    nexts = [];
    lengths = [];

    out.push(pad(node.id, 2));
    out.push(" - [ ");

    for (h = 0; h < node.nexts.length; h++) {
      nexts.push(pad(node.nexts[h].id, 2));
    }

    out.push(pad(nexts.join(", "), 4 * lazy.height - 1, true));
    out.push("] - [ ");

    for (h = 0; h < node.lengths.length; h++) {
      lengths.push(pad(node.lengths[h].toString(), 2));
    }

    out.push(pad(lengths.join(", "), 4 * lazy.height - 1, true));
    out.push(" ]");

    console.log(out.join(""));
      
    node = node.nexts[0];
  }

  // Delete temporary ids
  node = lazy.head;

  while (node !== Node.TAIL) {
    delete node.id;
    node = node.nexts[0];
  }

  console.log("");
  console.log("Length:", lazy.length);
  console.log("Lengths by counting:", lengthsByCounting(lazy).join(", "));
  console.log("Lengths by traversal:", lengthsByTraversal(lazy).join(", "));
}

function inspectSplit(lazy, index) {
  console.log("=============================================");
  console.log("SPLIT - index:", index);
  console.log("");
  inspectSkipList(lazy);
}

function inspectRemove(lazy, index, count) {
  console.log("=============================================");
  console.log("REMOVED - index:", index, "count:", count);
  console.log("");
  inspectSkipList(lazy);
}

function inspectInsert(lazy, index, objects) {
  console.log("=============================================");
  console.log("INSERTED - index:", index, "count:", objects.length);
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
