function Node(height, objects, offset, length) {
  this.nexts = new Array(height);
  this.lengths = new Array(height);

  this.objects = objects;
  this.offset = offset;
  this.lengths[0] = length || 0;
}

function pad(str, len) {
  while (str.length < len) {
    str += " ";
  }
  return str;
}

Node.prototype.toString = function() {
  // return "<Node:(" + this.lengths[0] + " objects):[" + this.lengths.join(", ") + "]>";
    var str = "Node";
    str += pad(" {" + this._ID + "}", 16);

    var ids = [];
    for (var h = 0; h < this.nexts.length; h++) {
      ids.push(this.nexts[h]._ID);
    }
    str += pad(" [" + ids.join(", ") + "]", 50);

    str += " [" + this.lengths.join(", ") + "]";
    return str;
};

Node.TAIL = (function() {
  var TAIL = new Node(0);
  TAIL._ID = -1; // REMOVE
  TAIL.nexts = undefined;
  TAIL.objects = undefined;

  for (var i = 0; i < 32; i++) {
    TAIL.lengths[i] = Infinity;
  }

  TAIL.toString = function() { return "<Node:(TAIL)>"; };

  return TAIL;
})();

export default Node;
