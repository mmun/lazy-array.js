import LazyArray from "lazy-array/lazy-array";
import env from "lazy-array/test/env";

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

function splicesEqual(splices, comment) {
  var i, j, basic, lazy, splice, array;

  for (i = 0; i < env.runs; i++) {
    itemId = 0;

    basic = [];
    lazy = new LazyArray();
    lazy.random = newRandom(i);

    for (j = 0; j < splices.length; j++) {
      splice = splices[j];
      array = makeArray(splice[2]);

      lazy.replace(splice[0], splice[1], array);
      basic.splice.apply(basic, splice.slice(0,2).concat(array));
    }

    deepEqual(lazy.flatten(), basic, comment);
  }
}

export { splicesEqual };
