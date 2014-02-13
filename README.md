# Lazy Array

A lazy array defers and coalesces insertions and removals until it is accessed.
It implements a [rope](http://en.wikipedia.org/wiki/Rope_(data_structure))-like
interface using an augmented [skip list](http://en.wikipedia.org/wiki/Skip_list).

## Example

```javascript
var lazy = new LazyArray();
lazy.insert(0, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
lazy.replace(4, 4, ["a", "b", "c"]);
lazy.remove(3, 2);
lazy.flatten();
=> [1, 2, 3, "b", "c", 9, 10]
```

## Getting started

### Running the tests

```bash
npm install
bower install
grunt dev
```

Point your browser to [http://localhost:8000](http://localhost:8000).
