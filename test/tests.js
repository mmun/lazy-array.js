import LazyArray from "lazy-array/lazy-array";

function newRandom(seed) {
  var rng = new RNG(seed);
  return function() {
    return rng.uniform();
  };
}

function splicesEqual(splices, comment) {
  var i, j, basic, lazy, rng;

  for (i = 0; i < 25; i++) {
    basic = [];
    lazy = new LazyArray();
    lazy.random = newRandom(i);

    for (j = 0; j < splices.length; j++) {
      var splice = splices[j];
      lazy.insertObjects(splice[0], splice[2]);
      basic.splice.apply(basic, splice.slice(0,2).concat(splice[2]));
    }

    deepEqual(lazy.flatten(), basic, comment);
  }
}

module("LazyArray - Basic operations");

test("can make initial insertion", function() {
  var splices = [];
  splices.push([0, 0, [1, 2, 3]]);
  splicesEqual(splices);
});
  
test("can make insertions at splice boundaries", function() {
  var splices = [];
  splices.push([0, 0, [7, 8, 9]]);
  splices.push([0, 0, [1, 2, 3]]);
  splicesEqual(splices, "at the beginning");
  splices.push([3, 0, [4, 5, 6]]);
  splicesEqual(splices, "in the middle");
  splices.push([9, 0, [10, 11, 12]]);
  splicesEqual(splices, "at the end");
});

// test("can split insertions", function() {
//   var splices = [];
//   splices.push([0, 0, [1, 2, 7, 8]]);
//   splices.push([2, 0, [3, 4, 5, 6]]);
//   splicesEqual(splices);
// });

module("LazyArray - Bulk");

test("can insert single element arrays in order", function() {
  var splices = [];
  for (var i = 0; i < 100; i++) {
    splices.push([i, 0, [i]]);
  }
  splicesEqual(splices);
});

test("can insert single element arrays in reverse order", function() {
  var splices = [];
  for (var i = 0; i < 100; i++) {
    splices.push([0, 0, [i]]);
  }
  splicesEqual(splices);
});

test("can insert mutli-element arrays in order", function() {
  var splices = [];
  for (var i = 0; i < 20; i++) {
    splices.push([5*i, 0, [5*i, 5*i+1, 5*i+2, 5*i+3, 5*i+4]]);
  }
  splicesEqual(splices);
});

test("can insert mutli-element arrays in reverse order", function() {
  var splices = [];
  for (var i = 0; i < 20; i++) {
    splices.push([0, 0, [5*i, 5*i+1, 5*i+2, 5*i+3, 5*i+4]]);
  }
  splicesEqual(splices);
});
