import { splicesEqual } from "lazy-array/test/helpers";

module("Lazy Array - Bulk operations");

test("can insert single element arrays in order", function() {
  var splices = [];
  for (var i = 0; i < 100; i++) {
    splices.push([i, 0, 1]);
  }
  splicesEqual(splices);
});

test("can insert single element arrays in reverse order", function() {
  var splices = [];
  for (var i = 0; i < 100; i++) {
    splices.push([0, 0, 1]);
  }
  splicesEqual(splices);
});

test("can insert mutli-element arrays in order", function() {
  var splices = [];
  for (var i = 0; i < 100; i++) {
    splices.push([5*i, 0, 5]);
  }
  splicesEqual(splices);
});

test("can insert mutli-element arrays in reverse order", function() {
  var splices = [];
  for (var i = 0; i < 100; i++) {
    splices.push([0, 0, 5]);
  }
  splicesEqual(splices);
});

test("can insert arbitrary length arrays at arbitrary indices", function() {
  var rng = new RNG();
  var index, insertCount, totalLength = 0;
  var splices = [];
  for (var i = 0; i < 100; i++) {
    index = rng.random(0, totalLength + 1);
    insertCount = rng.random(0, 100);
    splices.push([index, 0, insertCount]);
    totalLength += insertCount;
  }
  splicesEqual(splices);
});

test("can insert and remove arbitrary length arrays at arbitrary indices", function() {
  var rng = new RNG();
  var index, removeCount, insertCount, totalLength = 0;
  var splices = [];
  for (var i = 0; i < 100; i++) {
    index = rng.random(0, totalLength + 1);
    removeCount = rng.random(0, (totalLength - index) + 1);
    insertCount = rng.random(0, 100);
    splices.push([index, removeCount, insertCount]);
    totalLength = totalLength - removeCount + insertCount;
  }
  splicesEqual(splices);
});
