import LazyArray from "lazy-array/lazy-array";

var RUNS = 10;

function newRandom(seed) {
  var rng = new RNG(seed);

  return function() {
    return rng.uniform();
  };
}

var guid = 0;

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

    for (j = 0; j < splices.length; j++) {
      splice = splices[j];
      array = makeArray(splice[2]);

      lazy.insertObjects(splice[0], array);
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

module("LazyArray - Bulk");

test("can insert single element arrays in order", function() {
  var splices = [];
  for (var i = 0; i < 1000; i++) {
    splices.push([i, 0, 1]);
  }
  splicesEqual(splices);
});

test("can insert single element arrays in reverse order", function() {
  var splices = [];
  for (var i = 0; i < 1000; i++) {
    splices.push([0, 0, 1]);
  }
  splicesEqual(splices);
});

test("can insert mutli-element arrays in order", function() {
  var splices = [];
  for (var i = 0; i < 1000; i++) {
    splices.push([5*i, 0, 5]);
  }
  splicesEqual(splices);
});

test("can insert mutli-element arrays in reverse order", function() {
  var splices = [];
  for (var i = 0; i < 1000; i++) {
    splices.push([0, 0, 5]);
  }
  splicesEqual(splices);
});

test("can insert arbitrary length arrays at arbitrary indices", function() {
  var rng = new RNG(0);
  var totalLength = 0;
  var splices = [];
  for (var i = 0; i < 1000; i++) {
    var length = rng.random(0, 10);
    splices.push([rng.random(0, totalLength), 0, length]);
    totalLength += length;
  }
  splicesEqual(splices);
});
