# PBCG - PACKED BINARY CANVAS GRAPHICS

[DEMONSTRATION](https://frederico-miranda.github.io/packed-binary-canvas-graphics/demonstration.html)

[TECHNICAL SPECIFICATION](https://frederico-miranda.github.io/packed-binary-canvas-graphics/index.html)

## ABOUT THIS REPOSITORY

This project is about developing an image file format for vector graphics, which is simple, lightweight and fast. It's also about developing tools for parsing, generating and rendering files for this format.

As an example, look at the following binary file:
```
50 42 43 47 00 01 00 01 00 00 00 00 00 00 00 01
00 02 ff d7 00 06 00 00 80 01 05 27 d5 d4 8c 05
7f ff e3 d8 05 3e b7 23 a5 05 4c 11 7f ff 05 00
00 52 e3 05 ad bd 7c 8a 05 be fb 21 0c 05 80 01
de 78 05 d8 b5 d2 ce 05 00 00 80 01 00 05 01 00
00 02 01 00 00
```

When parsed, it becomes the following object in JavaScript:
```JavaScript
const yellowStar = (() => {
  const points = [
    [ 0.0000, -1.0000],
    [ 0.3112, -0.3395],
    [ 1.0000, -0.2200],
    [ 0.4900,  0.2785],
    [ 0.5943,  1.0000],
    [ 0.0000,  0.6476],
    [-0.6427,  0.9730],
    [-0.5080,  0.2582],
    [-1.0000, -0.2620],
    [-0.3070, -0.3531],
    [ 0.0000, -1.0000],
  ];

  const path = new Path2D();
  path.moveTo(...points[0]);

  for (let i = 1; i < points.length; i += 1) {
    path.lineTo(...points[i]);
  }

  const instructions = [
    {
      verb: 'SET',
      object: {
        property: 'FILL',
        value: '#ffd700',
      }
    },
    {
      verb: 'FILL',
      object: {
        path: path,
        fillRule: 'nonzero',
      },
    }
  ];

  return instructions;
})();
```

Which, when rendered to an HTML canvas, becomes the following image:

![gold yellow star](yellow-star.png)
