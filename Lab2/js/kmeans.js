/**
 * @Created Jan 25, 2018
 * @LastUpdate Jan 31, 2019
 * @author Kahin Akram
 */

function kmeans(data, k) {
    
    //Crap we need
    var iterations = 0;
    var maxLoops = 5;
    var qualityChange = 0;
    var oldqualitycheck = 0; 
    var qualitycheck = 0;
    var converge = false;

    //Parse the data from strings to floats
    var new_array = parseData(data);

    //Task 4.1 - Select random k centroids 
    var centroid = initCentroids(new_array,k);

    //Prepare the array for different cluster indices
    var clusterIndexPerPoint = new Array(new_array.length).fill(0);

    //Task 4.2 - Assign each point to the closest mean.
    clusterIndexPerPoint = assignPointsToMeans(new_array, centroid);

    //Master loop -- Loop until quality is good
    do {
        //Task 4.3 - Compute mean of each cluster
        centroid = computeClusterMeans(new_array, clusterIndexPerPoint, k);

        // assign each point to the closest mean.
        clusterIndexPerPoint = assignPointsToMeans(new_array, centroid);

        oldqualitycheck = qualitycheck;
        
        //Task 4.4 - Do a quality check for current result
        qualitycheck = qualityCheck(centroid,new_array,clusterIndexPerPoint);

        qualityChange = oldqualitycheck - qualitycheck;

        iterations += 1;

        //End the loop if...
        if (qualityChange < 0.000000001) converge = true;

    }
    while (converge == false)
    //Return results 
    return {
        assignments: clusterIndexPerPoint
    };

}

/**
 * Parse data from strings to floats
 * Loop over data length
      loop over every i in data
        Fill array with parsed values, use parseFloat
 * @param {*} data 
 * @return {array}
 */
function parseData(data){

    var array = [];

    for(var i=0; i<data.length; i++)
    {
        var obj = data[i];

        var newArray = [
            parseFloat(obj.A),
            parseFloat(obj.B),
            parseFloat(obj.C)
        ];

        array.push(newArray);
    }

    return array;
}

/**
 * Task 4.1 - Randomly place K points
 * Loop over the centroids
 * Loop over data and Use floor and random in Math
 * @return {array} centroid 
 */

function initCentroids(data, k){
    
    //Create k centroids
    var centroid = [];

    for(var i=0; i<k; i++)
    {
        centroid.push(data[Math.floor((Math.random() * data.length) + 1)]);
    }

    return centroid;
}

/**
* Taks 4.2 - Assign each item to the cluster that has the closest centroid
* Loop over points and fill array, use findClosestMeanIndex(points[i],means)
* Return an array of closest mean index for each point.
* @param points
* @param means
* @return {Array}
*/
function assignPointsToMeans(points, means){

    var assignments = [];

    for(var i=0; i<points.length; i++)
    {
        assignments.push(findClosestMeanIndex(points[i],means));
    }

    return assignments;
};
/**
 * Calculate the distance to each mean, then return the index of the closest.
 * Loop over menas and fill distance array, use euclideanDistance(point,means[i])
 * return closest cluster use findIndexOfMinimum,
 * @param point
 * @param means
 * @return {Number}
*/
function findClosestMeanIndex(point, means){

    var distances = [];

    for(var i=0; i<means.length; i++)
    {
        distances.push(euclideanDistance(point,means[i]));
    }
    return findIndexOfMinimum(distances);
};
/**
 * Euclidean distance between two points in arbitrary dimension(column/axis)
 * @param {*} point1 
 * @param {*} point2 
 * @return {Number}
 */

function euclideanDistance(point1, point2){

    if (point1.length != point2.length)
        throw ("point1 and point2 must be of same dimension");

    var sum = Math.sqrt(Math.pow(point2[0] - point1[0], 2.0) + Math.pow(point2[1] - point1[1], 2.0) + Math.pow(point2[2] - point1[2], 2.0));

    return sum;
};

/**
 * Return the index of the smallest value in the array.
 *  Loop over the array and find index of minimum
 * @param array
 * @return {Number}
 */
function findIndexOfMinimum(array){

    var index = 0;
    var min = array[0];

    //index = array.indexOf(Math.min(array));

    for(var i=0; i<array.length; i++)
    {
        if(min > array[i])
        {
            min = array[i];
            index = i;
        }
    }

    return index;
};

/**
 * //Task 4.3 - Compute mean of each cluster 
 * For each cluster loop over assignment and check if ass. equal to cluster index
 * if true fill array 
 * then if array is not empty fill newMeans, use averagePosition(array)
 * @param {*} points 
 * @param {*} assignments 
 * @param {*} k 
 * @returns {array}
 */
function computeClusterMeans(points, assignments, k){
    
    if (points.length != assignments.length)
        throw ("points and assignments arrays must be of same dimension");

    // for each cluster
    var newMeans = [];

    for(var i=0; i<k; i++)
    {
        var cluster = [];

        for(var j=0; j<points.length; j++)

            if(assignments[j] == i)
            {
                cluster.push(points[j]);
            }

        newMeans.push(averagePosition(cluster));
    }

    return newMeans;
};

/**
 * Calculate quality of the results
 * For each centroid loop new_array and check if clusterIndexPerPoint equal clsuter
 * if true loop over centriod and calculate qualitycheck.
 * @param {*} centroid 
 * @param {*} new_array 
 * @param {*} clusterIndexPerPoint 
 */
function qualityCheck(centroid, new_array, clusterIndexPerPoint){

    var qualitycheck = 0;

    for(var i=0; i<centroid.length; i++)
    {
        for(var j =0; j<new_array.length; j++)
        {
            if(clusterIndexPerPoint[j] == i)
            {
                qualitycheck += Math.pow(euclideanDistance(new_array[j], centroid[i]), 2.0);
            }
        }
    }
    return qualitycheck;
}

/**
 * Calculate average of points
 * @param {*} points 
 * @return {number}
 */
function averagePosition(points){
    
    var sums = points[0];
    for (var i = 1; i < points.length; i++){
        var point = points[i];
        for (var j = 0; j < point.length; j++){
            sums[j] += point[j];
        }
    }

    for (var k = 0; k < sums.length; k++)
        sums[k] /= points.length;

    return sums;
};