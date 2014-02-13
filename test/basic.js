import { splicesEqual } from "lazy-array/test/helpers";

module("Lazy Array - Basic operations");

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
