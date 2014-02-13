import LazyArray from "lazy-array/lazy-array";

function newRandom(seed) {
  var rng = new RNG(seed);

  return function() {
    return rng.uniform();
  };
}

var itemId;

function makeArray(length) {
  var array = [];

  for (var i = 0; i < length; i++) {
    array.push(++itemId);
  }

  return array;
}

// Verifies that a sequence of splice operations gives the same result
// when applied to lazy array as when applied to a normal array. The
// splices are expected of the form [index, removeCount, insertCount].
//
// Because skip lists are a probabilistic data structure, we run the
// tests several times with a different seed to increase confidence
// of correctness.
var RUNS = 25;

function splicesEqual(splices, comment) {
  var i, j, normal, lazy, splice, array;

  for (i = 0; i < RUNS; i++) {
    itemId = 0;

    normal = [];
    lazy = new LazyArray();
    lazy.random = newRandom(i);

    for (j = 0; j < splices.length; j++) {
      splice = splices[j];
      array = makeArray(splice[2]);

      lazy.replace(splice[0], splice[1], array);
      normal.splice.apply(normal, splice.slice(0,2).concat(array));
    }

    deepEqual(lazy.flatten(), normal, comment);
  }
}

export { splicesEqual };
