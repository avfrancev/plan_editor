import { groups, sort, groupSort } from 'd3-array'

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
    const maxIterations = 100; // Set a limit to avoid infinite loops

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

  // console.log(addresses);

  // console.log(groupSort(
    //   addresses,
  //   (a,b) => {
  //     console.log(a.length, b.length)
  //     // return D.length
  //     return a,length - b.length
  //   },
  //   // (a, b) => a[1].length - b[1].length,
  //   (address) => address.cluster));

  // Each address have visit frequency per week property and cluster property. I want to distribute addresses along a week to days group based on cluster and visit frequency.
  function isAddressInGroup(address, G) {
    return G.some(addressInGroup => addressInGroup === address);
  }

  function getNextMinimalGroupByAddress(addresses) {
    const groupedAddressesByCluster = groups(addresses, address => address.cluster)
    const sortedGroupedAddressesByCluster = groupedAddressesByCluster.sort((a, b) => a[1].length - b[1].length);
    return sortedGroupedAddressesByCluster[0][1];
  }
  
  addresses.forEach(address => {
    // Initialize an array to hold day assignments
    // address.days = Array(7).fill(false);
    
    address.days = [];
    let visitFrequency = address.visit_frequency;
    let assignedCluster = address.cluster;
    address.days.push(assignedCluster);
    
    const groupedAddressesByCluster = groups(addresses, address => address.cluster)
    const sortedGroupedAddressesByCluster = groupedAddressesByCluster.sort((a, b) => a[1].length - b[1].length);
    let minimalGroupID = sortedGroupedAddressesByCluster[0][0];
    const getMinimalGroupByAddress = (i) => sortedGroupedAddressesByCluster[i%5][1];

    for (let i = 1; i < visitFrequency; i++) {
      // let isAddrInGroup = sortedGroupedAddressesByCluster[i % 5][1].some(a => a === address);
      // const is
      const isAddressInDays = address.days.includes(minimalGroupID % 5);
      // const isAddressInDays = address.days.some(d => address === sortedGroupedAddressesByCluster[minimalGroupID % 5][1]);
      // console.log(i, visitFrequency, isAddressInDays);
      if (!isAddressInDays)
        address.days.push(minimalGroupID % 5);
      else {
        address.days.push(++minimalGroupID % 5);
        // console.log(minimalGroupID);
      }
    }
    // address.days.sort((a, b) => a - b);
    // console.log(toRaw(address.days));
    return
    while (true) {
      if (visitFrequency <= 1) return

      let isAddrInGroup = sortedGroupedAddressesByCluster[assignedCluster++%5][1].some(a => a === address);
      if (!isAddrInGroup)
        address.days.push(minimalGroupID);
      visitFrequency--
      minimalGroupID++
      // assignedCluster++
      // break
    }
    return
    sortedGroupedAddressesByCluster.forEach((group, i) => {
      if (visitFrequency <= 1) return
      // let currentGroupId = group[0]
      // console.log(currentGroupId, group[1].length, address.address);
      let isAddrInGroup  = group[1].some(a => a === address);
      let isAddressInGroup_ = isAddressInGroup(address, group, i)
      console.log(isAddressInGroup_, { isAddrInGroup });
      if (!isAddrInGroup)
        address.days.push(i);
        // assignedCluster = currentGroupId
      visitFrequency--
    })
    return

    // while (visitFrequency < 0) {
      
    //   const _isAddressInGroup = isAddressInGroup(address, sortedGroupedAddressesByCluster[assignedCluster][1])
    //   console.log(_isAddressInGroup);
    // }

    for (let i = 1; i < visitFrequency; i++) {
      console.log(address.address, i)
      console.log(isAddressInGroup(address, sortedGroupedAddressesByCluster[i-1][1]));
      const _isAddressInGroup = isAddressInGroup(address, sortedGroupedAddressesByCluster[i - 1][1])
      if (_isAddressInGroup) {

      }
    }
    let counter = 0
    while (--visitFrequency > 0) {
      // Calculate distances to each centroid
      const closestCentroid = sortedGroupedAddressesByCluster[0][0];
      // const closestCentroid = sor
      console.log(closestCentroid, visitFrequency);
      // Assign the next closest day, if available
      if (closestCentroid) {
        address.days.push(closestCentroid);
        assignedCluster = closestCentroid; // Update the assigned cluster
      } else {
        // break; // No other centroids to assign, end the loop
      }
    }

    // const sortedAddressesByDays = addresses
    
    // Distribute visitFrequency across the week days
    // for (let i = 0, day = assignedCluster; i < visitFrequency; ++i, day = (day + 1) % 5) {
    //   // address.days[day] = true;
    //   address.days.push(day);
    // }
    // console.log(address.days);
  });

  const groupedAddressesByDays = ref(addresses.reduce((groups, address) => {
    let days = address.days
    // console.log(address);
    days.forEach((day, i) => {
      if (!groups[day]) {
        groups[day] = [];
      }
      // let a = {...address}
      // let a = address
      address.iid = `${address.address}_${days[i]}`
      groups[day].push(address);
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