
//Start off with what passes the first test.
function KNN(kSize){
	this.kSize = kSize;
	this.points = [];

}

KNN.prototype.train = function (trainingArr) {
  for (var i=0; i<trainingArr.length; i++) {
    this.points.push(trainingArr[i]);
  }
}

KNN.prototype._distance = function (arrOne, arrTwo) {
  var vectorSub = arrOne.map(function(arg,index){return arrOne[index] - arrTwo[index]});

  function euclideanNorm(arr) {
    return Math.sqrt( arr.reduce(function(old, n) { return old + n*n },0));
  }

  return euclideanNorm(vectorSub);
}

KNN.prototype._distances = function (vector, trainingData) {
  var distances = [];
  trainingData.forEach(function (training) {
    var subArr = []
    subArr.push(KNN.prototype._distance(vector, training[0]));
    subArr.push(training[1]);
    distances.push(subArr);
  })
  return distances;
}

KNN.prototype._sorted = function(array) {
  array.sort(function(subArr1, subArr2) {
    return subArr1[0]-subArr2[0];
  });
  return array.map(function(subArr) {
    return subArr[1];
  })
}

KNN.prototype._majority = function(k, sortedList) {
  //getting the frequencies of first k elements
  var freq = {};
  for (var i=0; i<k; i++) {
    var dist = sortedList[i];
    if (freq[dist]) freq[dist]++;
    else freq[dist] = 1;
  }
  //finding the max of the frequency obj
  var maxFreq = 0;
  var mostFreqDist;
  for (var dist in freq) {
    if (freq[dist] > maxFreq) {
      maxFreq = freq[dist];
      mostFreqDist = dist;
    }
  }
  return +mostFreqDist;
}

/*points is [[vector, classification]]

*/

KNN.prototype.predictSingle = function(vector) {
  //build array of subArrays
  return this._majority(5, this._sorted(this._distances(vector, this.points)));
}

KNN.prototype.predict = function(arrayOfVectors) {
  var arrayOfClassifications = [];
  for (var i=0; i<arrayOfVectors.length; i++) {
    arrayOfClassifications.push(this.predictSingle(arrayOfVectors[i]));
  }
  return arrayOfClassifications;
}

KNN.prototype.score = function(data) {
  var arrayOfVectors = data.map(function (subArr) {
    return subArr[0];
  });
  var arrayOfClassifications = this.predict(arrayOfVectors);
  var numOfMatchedClassifications = 0;
  for (var i=0; i<arrayOfClassifications.length; i++) {
    if (arrayOfClassifications[i] === data[i][1]) {
      numOfMatchedClassifications++;
    }
  }
  return numOfMatchedClassifications/data.length;
}


module.exports = KNN