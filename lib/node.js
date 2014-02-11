function Node(height, objects, start, length) {
  this.index = -1;
  this.nexts = new Array(height);
  this.lengths = new Array(height);

  this.objects = objects;
  this.start = start;
  this.lengths[0] = length || 0;
}

Node.prototype.toString = function() {
  return "<Node:(" + this.lengths[0] + " objects):[" + this.lengths.join(", ") + "]>";
};

Node.TAIL = (function() {
  var TAIL = new Node(0);

  TAIL.index = undefined;
  TAIL.nexts = undefined;
  TAIL.objects = undefined;

  for (var i = 0; i < 32; i++) {
    TAIL.lengths[i] = Infinity;
  }

  TAIL.toString = function() { return "<Node:TAIL>"; };

  return TAIL;
})();

export default Node;
