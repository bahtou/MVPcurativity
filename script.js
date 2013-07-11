// function randomize(array) { 
//  return array.map(function(item, i) { 
//    return { item:item, sorter: (i === array.length - 1) ? 1 : Math.random() }; 
//  }).sort(function(a, b) {
//    return a.sorter - b.sorter;
//  }).map(function(obj) {
//    return obj.item;
//  });
// }


// function randomize(array) {
//  return array.sort(function(a, b) {
//    return Math.random() - ((array.indexOf(b) === array.length - 1) ? 1 : Math.random());
//  })
// }

function randomize(array) {
  var last = array[array.length - 1];
  return array.sort(function(a, b) {
    return Math.random() - ((b === last) ? 1 : Math.random());
  })
}