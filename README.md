# Plan editor

This project is a simple plan editor. You can edit your plan and save it. You can also export it. The plan is stored in csv format. You can also add adresses to the plan. You can also edit your plan and save it.

---

# Stack
- Vite
- Vue 3
- Pug
- Sass

# Fetures
- [ ] **Loading csv file**
- [ ] **Editing plan**
  - [x] Using yamaps api to get adresses
  - [x] Auto distribute adresses over days (using kmeans algorithm to clusterize adresses in days)
  - [x] drag and drop feature
  - [x] day highlight feature
  - [ ] Adding adresses
- [ ] **Saving plan**
- [ ] **Exporting plan**

# Contributing
Welcome to the contributing section of the Plan editor! We are glad to have you here and look forward to your valuable contributions.

---

@import 'vite.config.js'

``` javascript
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

```