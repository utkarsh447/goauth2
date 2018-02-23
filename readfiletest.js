var fs = require('fs');
console.log("start");
//var data = [[],[]];
var arr1 = new Array([]);

fs.readFile("credentials.txt", function(error, data) {
    if (error) { throw error; }
    data.toString().split(",").forEach(function(line, index, arr) {
        if (index === arr.length - 1 && line === "") { return; }
        arr1[index] = line;
    });
    console.log(arr1[0]);
    console.log("end");
});
/*
console.log("arr" + arr[0]);*/
