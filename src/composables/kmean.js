import { group } from 'd3-array'

const distance = (a, b) => {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}

const avg = (arr) => arr.reduce((p, c) => p + c, 0) / arr.length;


export default (addresses) => {
  // console.log(addresses[0].x);
  // let centroids = Array.from({ length: 5 }, (x, i) => {
  //   return {
  //     id: i,
  //     x: 0, y: 0,
  //   }
  // });

  

  // Example usage:
  // const k = 5; // Number of clusters
  // const distributedData = distributeAddresses(addresses, k);
  // console.log(distributedData);

  // Distribute addresses using k-mean clustering algorithm
  function kMeanClustering(addresses, k) {
    // Initialize centroids randomly
    const closestCentroid = (point) => {
      const distances = centroids.map(centroid => distance(point, centroid));
      const i = distances.findIndex(d => d === Math.min(...distances));
      return i;
    }

    let centroids = addresses.slice(0, k).map(address => ({
      x: address.x,
      y: address.y
    }));

    let hasChanged = true;
    let iterations = 0;
    const maxIterations = 10; // Set a limit to avoid infinite loops

    while (hasChanged && iterations < maxIterations) {
      hasChanged = false;
      iterations++;

      // Assign clusters to addresses
      addresses.forEach(address => {
        const clusterIndex = closestCentroid(address);
        if (address.cluster !== clusterIndex) {
          hasChanged = true;
          address.cluster = clusterIndex;
        }
      });

      // Update centroids position to the average of their cluster
      centroids = centroids.map((_, centroidIndex) => {
        const clusterAddresses = addresses.filter(address => address.cluster === centroidIndex);
        if (clusterAddresses.length === 0) return centroids[centroidIndex];
        return {
          x: avg(clusterAddresses.map(address => address.x)),
          y: avg(clusterAddresses.map(address => address.y))
        };
      });
    }

    return { centroids, addresses };
  };

  ///////////////////////////////////////
  const { centroids } = kMeanClustering(addresses, 5);
  
  // Distribute addresses evenly across days based on cluster.
  // visit frequency means how many times address is visited in a week.

  // addresses.forEach(address => {
  //   // Initialize an array to hold day assignments
  //   address.days = [];
  //   let visitFrequency = address.visit_frequency;
  //   let assignedCluster = address.cluster;

  //   // Assign the first day to the closest cluster
  //   address.days.push(assignedCluster);

  //   // If address is visited multiple days, assign to the next closest centroid
  //   while (--visitFrequency > 0) {
  //     // Calculate distances to each centroid
  //     let distances = centroids.map((centroid, index) => ({
  //       index: index,
  //       distance: distance(address, centroid)
  //     }));

  //     // Sort distances in ascending order
  //     distances.sort((a, b) => a.distance - b.distance);

  //     // Find the next closest centroid that is not the same as the assigned cluster
  //     let nextClosest = distances.find(d => d.index !== assignedCluster);

  //     // Assign the next closest day, if available
  //     if (nextClosest) {
  //       address.days.push(nextClosest.index);
  //       assignedCluster = nextClosest.index; // Update the assigned cluster
  //     } else {
  //       break; // No other centroids to assign, end the loop
  //     }
  //   }
  // });

  console.log(addresses);
  ///////////////////////////////////////

  // Call the kMeanClustering function with the desired number of clusters (k)
  // const k = 5; // Assuming we want 5 clusters
  // const clusteredData = kMeanClustering(addresses, k);
  // Now clusteredData.centroids contains the centroids and clusteredData.addresses contains addresses with their assigned clusters
  // console.log(clusteredData);
  ///////////////////////////////////////

  // let centroids = reactive(addresses.slice(0,5).map((d) => {
  //   return {
  //     x: unref(d.x),
  //     y: unref(d.y),
  //   }
  // }))
  // // console.log(centroids);

  // const closestCentroid = (point) => {
  //   const distances = centroids.map(centroid => distance(point, centroid));
  //   const i = distances.findIndex(d => d === Math.min(...distances));
  //   return i;
  // }

  // const updatePoints = (points) => {
  //   points.forEach(point => {
  //     point.cluster = closestCentroid(point);
  //   });
  // }

  // updatePoints(addresses)


  // const updateCentroids = (points) => {
  //   centroids.forEach((centroid, i) => {
  //     const cluster = points.filter(point => point.cluster === i);
  //     if (cluster.length > 0) {
  //       centroid.x = avg(cluster.map(point => point.x));
  //       centroid.y = avg(cluster.map(point => point.y));
  //     }
  //   });
  //   // centroidsSvg.transition().duration(500).attr('cx', d => x(d.x)).attr('cy', d => y(d.y));
  // }
  
  // let groupedAddresses
  
  // const groupedAddressesByDays = ref({})
  
  
  // const update = () => {
  //   updateCentroids(addresses)
  //   updatePoints(addresses)

  //   // groupedAddresses = addresses.reduce((groups, address) => {
  //   //   const clusterId = address.cluster;
  //   //   if (!groups[clusterId]) {
  //   //     groups[clusterId] = [];
  //   //   }
  //   //   groups[clusterId].push(address);
  //   //   return groups;
  //   // }, {});

  //   // console.log(addresses.gr);
  //   // console.log(l)
  //   // console.log(aaa);

  //   // let currentDay = 0;

  //   // console.log(groupedAddresses);
    
  addresses.forEach((address) => {
    // Initialize an empty array to store the days for the address
    address.days = []
  
    // Retrieve the visit frequency and cluster of the address
    let visitFrequency = address.visit_frequency
    let cluster = address.cluster
  
    // Add the initial cluster to the days array
    address.days.push(+cluster) 
  
    // Group addresses by cluster
    let clusterGroup = group(addresses, d => d.cluster);
    let sortedGroup = Array.from(clusterGroup).sort((a, b) => a[1].length - b[1].length);
    
    // Iterate through the address visit frequency
    while (visitFrequency-- > 1) {
      let currentGroupIndex = 0;
      let addressInDays = false;
  
      // Find an empty day to assign to the address
      while (true) {
        // Check if the address is in the current cluster group
        addressInDays = sortedGroup[currentGroupIndex][1].includes(address);
        
        if (!addressInDays) {
          // If not, add the cluster to the days array and break the loop
          address.days.push(+sortedGroup[currentGroupIndex][0]) 
          break
        }
        currentGroupIndex++;
      }
    }
  })

    // const g = addresses.reduce((groups, address) => {
    //   let days = address.days
    //   console.log(address);
    //   days.forEach((day, i) => {
    //     if (!groups[day]) {
    //       groups[day] = [];
    //     }
    //     // let a = {...address}
    //     let a = address
    //     a.iid = `${a.address}_${days[i]}`
    //     groups[day].push(a);
    //   })
    //   return groups;
    // }, {})

  const groupedAddressesByDays = ref(addresses.reduce((groups, address) => {
    let days = address.days
    console.log(address);
    days.forEach((day, i) => {
      if (!groups[day]) {
        groups[day] = [];
      }
      // let a = {...address}
      let a = address
      a.iid = `${a.address}_${days[i]}`
      groups[day].push(a);
    })
    return groups;
  }, {}))

  //   // console.log(addresses)
  //   return

  // }
  // updateCentroids(centroids, addresses)
  // updatePoints(data)
  return {
    // centroids: clusteredData.centroids,
    // updatePoints,
    // updateCentroids,
    // updateKMean: update,
    // groupedAddressesByDays: g,
    groupedAddressesByDays
  }
}