function Node(height, objects, start, length) {
  this.nexts = new Array(height);
  this.lengths = new Array(height);

  this.objects = objects;
  this.start = start;
  this.length = length;

  if (objects) {
    this.name = "[" + objects.join(", ") + "]";
  }
}

Node.prototype.TAIL = new Node(0, []);
Node.prototype.TAIL.name = "TAIL";

Node.prototype.toString = function() {
  return "<Node:" + this.name + ">";
};

export default Node;
