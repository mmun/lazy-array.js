import LazyArray from "lazy-array/lazy-array";

// LazyArray.prototype.debug = true;

var guid = 0;
var RUNS = 25;

function newRandom(seed) {
  var rng = new RNG(seed);

  return function() {
    return rng.uniform();
  };
}

function makeArray(length) {
  var array = [];

  for (var i = 0; i < length; i++) {
    array.push(++guid);
  }

  return array;
}

function splicesEqual(splices, comment) {
  var i, j, basic, lazy, rng, splice, array;

  for (i = 0; i < RUNS; i++) {
    basic = [];
    lazy = new LazyArray();
    lazy.random = newRandom(i);

    LazyArray.prototype.debug = false;

    for (j = 0; j < splices.length; j++) {
      splice = splices[j];
      array = makeArray(splice[2]);

      // console.log("\n~ SPLICE:", splice, "\n");
      window.DEBUG_MODE = false;//(j===splices.length-1);
      lazy.replace(splice[0], splice[1], array);
      basic.splice.apply(basic, splice.slice(0,2).concat(array));
    }
    deepEqual(lazy.flatten(), basic, comment);
  }
}

module("LazyArray - Basic operations");

test("can make initial insertion", function() {
  var splices = [];
  splices.push([0, 0, 3]);
  splicesEqual(splices);
});

test("can make insertions at splice boundaries", function() {
  var splices = [];
  splices.push([0, 0, 3]);
  splices.push([0, 0, 2]);
  splicesEqual(splices, "at the beginning");
  splices.push([2, 0, 3]);
  splicesEqual(splices, "in the middle");
  splices.push([8, 0, 4]);
  splicesEqual(splices, "at the end");
});

test("can split insertions", function() {
  var splices = [];
  splices.push([0, 0, 2]);
  splices.push([1, 0, 1]);
  splicesEqual(splices);
});

test("can remove without splitting", function() {
  var splices = [];
  splices.push([0, 0, 3]);
  splices.push([0, 3, 0]);
  splicesEqual(splices);
});

test("can remove without splitting across boundaries", function() {
  var splices = [];
  splices.push([0, 0, 3]);
  splices.push([3, 0, 2]);
  splices.push([0, 5, 0]);
  splicesEqual(splices);
});

test("can remove with splitting", function() {
  var splices = [];
  splices.push([0, 0, 3]);
  splices.push([0, 2, 0]);
  splicesEqual(splices, "at the beginning");
  splices = [];
  splices.push([0, 0, 3]);
  splices.push([1, 1, 0]);
  splicesEqual(splices, "in the middle");
  splices = [];
  splices.push([0, 0, 3]);
  splices.push([1, 2, 0]);
  splicesEqual(splices, "at the end");
});

module("LazyArray - Bulk");

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
  var rng = new RNG(++guid);
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
  var rng = new RNG(++guid);
  var index, removeCount, insertCount, totalLength = 0;
  var splices = [];
  for (var i = 0; i < 2500; i++) {
    index = rng.random(0, totalLength + 1);
    removeCount = rng.random(0, (totalLength - index) + 1);
    insertCount = rng.random(0, 100);
    splices.push([index, removeCount, insertCount]);
    totalLength = totalLength - removeCount + insertCount;
  }
  splicesEqual(splices);
});
