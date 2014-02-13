function Operation(height, items, offset, length) {
  this.nexts = new Array(height);
  this.lengths = new Array(height);

  this.items = items;
  this.offset = offset;
  this.lengths[0] = length || 0;
}

Operation.NIL = (function() {
  var i, t = new Operation(0);
  t.id = "*";
  t.nexts = undefined;
  t.items = undefined;

  // Initialize lengths to Infinity to simplify edge cases
  for (i = 0; i < 32; i++) t.lengths[i] = Infinity;

  return t;
})();

export default Operation;
