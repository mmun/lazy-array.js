function Node(height, objects, offset, length) {
  this.nexts = new Array(height);
  this.lengths = new Array(height);

  this.objects = objects;
  this.offset = offset;
  this.lengths[0] = length || 0;
}

Node.TAIL = (function() {
  var i, t = new Node(0);
  t.id = "T";
  t.nexts = undefined;
  t.objects = undefined;

  // Initialize lengths to Infinity to simplify edge cases
  for (i = 0; i < 32; i++) t.lengths[i] = Infinity;

  return t;
})();

export default Node;
