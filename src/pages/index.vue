<template lang="pug">
  .container.mx-auto.px-2.text-xs
    FileInput(v-model="fileData")
    button.btn.btn-error(@click="exportFile") Export

    //- pre {{ pulses }}
    //- button.mr-12.btn(@click="clickGenPlan") clickGenPlan
    //- button.mr-12.btn(@click="fillCoordinates") fillCoordinates
    //- button.mr-12.btn(@click="makeBins(addresses)") makeBins
    //- button.mr-12.btn(@click="isMapExpanded = !isMapExpanded") isMapExpanded
    //- button.mr-12.btn(@click="kmean.updateKMean") updateKMean
    //- input.input(type="number" v-model.number="currDay")
    div.min-h-96(v-if="addresses.length > 0")
      #top.my-4.sticky.top-0
        .join
          button.join-item.btn(:class="[ currDay === -1 ? 'btn-active':'']" @click="currDay = -1") Все
          button.join-item.btn(v-for="d,i in days" :class="[ currDay === i ? 'btn-active':'']"
            :style="`background: ${currDay === i ? colors[i]:''}; color: ${currDay === i ? 'black':'white'}`"
            @click="currDay = i") {{ d }}
    
      //- pre {{ kmean.centroids }}
    
      .w-full.rounded.overflow-hidden.sticky.top-0(:class="[isMapExpanded ? 'h-screen':'h-96']")
        YaMap(v-bind="{ addresses }")
            
      //- DaysCardView(v-bind="{ addresses, kmean }")
      //- pre {{ currentPulsesId }}
      .carousel.w-full.box-border.space-x-4.justify-stretch.mt-6(
        :class="[canDrop ? '':'no-drop']"
        )
        .carousel-item.rounded.flex.flex-col.flex-1.min-w-52.border-2.box-border(
          v-for="d,i in kmean.groupedAddressesByDays.value"
          :class="[currDay == i ? 'border-accent':'border-neutral']"
          :style="{ borderColor: colors[currDay == i ? currDay : -1] }"
          class=""
          )
          .flex.items-baseline.justify-between.space-x-2.px-4.py-4
            .flex.items-center
              .inline-block.rounded-full.h-4.w-4.mr-2(:style="{ background: colors[i] }") 
              .font-bold.text-xl.uppercase {{days[i]}}
            span Точек: {{ d.length }}
          .divider.divider-neutral.my-0.mb-4.h-0
          draggable(
            v-model="kmean.groupedAddressesByDays.value[i]"
            v-bind="dragOptions"
            itemKey="address"
            tag="ul"
            :move="handleMove"
            @start="isDragging = true"
            @end="handleDropEnd"
            :data-day-id="i"
          )
            template(#item="{ element, index }")
              //- @pointerover="onAddrOver(element)"
              li(
                :id="element.iid"
                :ref="(el) => element.li = el"
                @pointerenter="onAddrPointerEnter(element)"
                @click="() => console.log(element)"
                )
                div.flex.p-2.space-x-2(
                  class="transition rounded mx-2 p-2 select-none"
                  :class="{ 'bg-neutral': element.isHovered }"
                  )
                  //- span {{ element.canDrag }}
                  .h-4.w-4.rounded-full.flex-none(:style="{...element.pieChartStyles}")
                  .flex-1 {{ element.address }}
                  //- span.text-xs [{{ element.iid }}]
                  //- span.text-lg [{{ element.visit_frequency }}]
                  span.text-nowrap.text-lg {{ element.days }}
    
          //- draggable.menu(
            v-bind="dragOptions"
            draggable=".item"
            @change="handleDayChange"
            @end="handleDropEnd"
            )
            //- @change="(e) => e.added.element.day = e.added.newIndex"
            //- tag="transition-group"
            //- :component-data="{ tag: 'ul', type: 'transition-group', name: !drag ? 'flip-list' : null }"
            //- v-model="plan[0]"
            //- @start="drag.value = true"
            //- @end="drag.value = false"
            //- group="people"
            
            template(#item="{ element, index }")
              li.item(
                :id="element.id"
                :ref="(el) => element.li = el"
                @pointerover="onAddrOver(element)"
                )
                div.flex.space-x-2(
                  :class="element.hovered ? `border` : ``"
                  )
                  //- pre {{ element.store }}
                  img.bg-transparent.h-8.w-8.mask.mask-squircle(:src="`${element.store.toLowerCase()}.png`")
                  span.flex-1 {{ element.address.trim() }} [{{ element.day }}] {{ element.XXX }}
                  //- pre ---{{ element.id }}---
                  span {{ element.cluster }}
                  span {{ element.days }}
                  .join
                    //- .join-item()`
                    a.btn.btn-sm(
                      target="_blank"
                      v-if="element.geocode"
                      :href="`https://yandex.ru/maps/?pt=${element.geocode.Point.pos.split(' ')}&z=18`"
                      ) YA
    
                    button.join-item.btn.btn-sm(@click="locateAddress(element)") Locate
  
  </template>
  
  <script setup>
  
  import draggable from "vuedraggable"
  
  // import { computed, nextTick, reactive, shallowReactive, toRaw, unref, watch, watchEffect } from 'vue';
  import aaa from 'src/addresses.json'
  // console.log(aaa); 

  const fileData = ref([])

  // const addresses = reactive([])
  const addresses = reactive(aaa)

  watchEffect(async () => {
    console.log('------------', fileData.value);
    Object.assign(addresses, fileData.value)
    // await fillCoordinates()
  })
  
  const isDragging = ref(false)
  const canDrop = ref(true)
  const dragOptions = {
          animation: 200,
          group: "description",
          disabled: false,
          forceFallback: true,
          ghostClass: "ghost"
        };
        
  import { read, writeFileXLSX, utils } from "xlsx"
  function exportFile() {
    /* generate worksheet from state */

    let o = addresses.map(a => {
      const { store, address } = a
      let ggg = {}
      let ddd = days.forEach((d, i) => {
        ggg[d] = a.days.includes(i) ? '1':''
        // return {
        //   [d]: a.days.includes(i),
        // }
      })
      return {
        store, address,
        // day: a.days.map(d => days[d]).join(', ')
        ...ggg,
      }
    })
    console.table(o);    
    
    const ws = utils.json_to_sheet(o);
    /* create workbook and append worksheet */
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Data");
    /* export to XLSX */

    writeFileXLSX(wb, "out.xlsx");
  }

  
  const days = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт']; 
  
  import { interpolateRainbow } from 'd3-scale-chromatic'
  const colors = Array.from(Array(5)).map((d,i) => {
    return interpolateRainbow(i/5)
  })
  
  // const addresses = reactive( parseCSVWithDoubleQuotes(route_csv) )
  addresses.forEach( (d,i) => {
    // let pos = d.geocode.Point.pos.split(" ").map(Number)  
    // console.log(pos);
    d.id = i
    // d.x = pos[0]
    // d.y = pos[1]
    // d.ya = {
    //   geometry: {
    //     coordinates: [0,0]
    //   }
    // }
    d.cluster = 0
    d.x = computedEager(() => {
      if (d.ya.features?.length > 0) {
        return d.ya?.features[0].geometry?.coordinates[0]
      }
      return d.ya?.geometry?.coordinates[0] || 0
    })
    d.y = computedEager(() => {
      if (d.ya?.features?.length > 0) {
        return d.ya?.features[0].geometry?.coordinates[1]
      }
      return d.ya?.geometry?.coordinates[1] || 0
    })
    d.pieChartStyles = computedEager(() => {
      if (!d.days) return null
      const numOfDays = d.days.sort((a,b) => b - a).length;
      const gradientFragments = d.days.map((day, index) => {
        const color = colors[day % colors.length];
        const share = 100 / numOfDays;
        const start = share * index;
        const end = start + share;
        return `${color} ${start}% ${end}%`;
      });
      return {
        background: `conic-gradient(${gradientFragments.join(', ')})`
      };
    });
  
    d.isInDay = computed(() => {
      return d.days.includes(currDay.value) || currDay.value === -1
    })
  })
  
  const currDay = ref(-1) 
  
  const filteredAddresses = computed(() => {
    if (currDay.value < 0) return addresses
    return kmean.groupedAddressesByDays.value[currDay.value]
  })
  
  const isMapExpanded = ref(false)
  
  
  function generatePlan(arr, days=5) {
      // const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
      // const plan = {};
    
      // Initialize plan object with empty arrays for each day
      // for (let day of days) {
      //   plan[day] = [];
      // }
      let p = []
      // Sort addresses based on visit frequency in descending order
      // arr.sort((a, b) => b.visit_frequency - a.visit_frequency);
    
      // Repeat addresses on different days
      let currentDay = 0;
      for (let i = 0; i < arr.length; i++) {
        const address = arr[i].address;
        const visitFrequency = arr[i].visit_frequency;
    
        // Repeat the address on different days based on visit frequency
        for (let j = 0; j < visitFrequency; j++) {
          if (!p[currentDay])
              p[currentDay] = []
          p[currentDay].push(arr[i])
          arr[i].day = currentDay
          // plan[days[currentDay]].push(address);
    
          // Move to the next day
          // currentDay = (currentDay + 1) % days.length;
          currentDay = (currentDay + 1) % days;
        }
      }
      // console.log(p);
      return p
      // return plan;
  }
  
  // watchEffect(() => {
  //   console.log(plan2.value);
  // })
  
  const plan = reactive(generatePlan(addresses))
  // console.log(plan); 
  
  import useKMean from 'src/composables/kmean.js'
  const kmean = useKMean(addresses)
  // kmean.updateKMean()
  
  
  const clickGenPlan = () => {
    Object.assign(plan, generatePlan(addresses))
  }
  
  
  
  async function searchYandexMaps(str) {
    const apiKey = '4e3567e5-9ea1-47ec-89d0-a09424478672'; // YANDEX API
    const apiUrl = `https://search-maps.yandex.ru/v1/?type=geo&lang=Ru_RU&apikey=4e3567e5-9ea1-47ec-89d0-a09424478672&text=${str}`
  
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        console.log(data);
        // if (data && data.response) {
          // geocode = data.response
        // }
        return data
    } catch (error) {
      console.error('Error:', error);
    }
  
  
  }
  
  async function getGeocode(address) {
    // const apiKey = 'a0212be8-caa5-4f01-8dc3-9ec59a4348bb'; // YANDEX API
    // const apiUrl = `https://geocode-maps.yandex.ru/1.x/?apikey=${apiKey}&format=json&geocode=`;
    // const apiUrl = `https://search-maps.yandex.ru/1.x/?apikey=${apiKey}&format=json&text=`;
    // const apiUrl = `https://search-maps.yandex.ru/v1/?text=Bank Alfalah&type=biz&lang=en_US&apikey=${apiKey}`
                    // https://search-maps.yandex.ru/v1/?text=Bank%20Alfalah&type=biz&lang=en_US&apikey=4e3567e5-9ea1-47ec-89d0-a09424478672
    let geocode = null;
  
    try {
        const response = await fetch(`${apiUrl}${encodeURIComponent(address)}`);
        const data = await response.json();
        console.log(data);
        if (data && data.response) {
          geocode = data.response
        }
    } catch (error) {
      console.error('Error:', error);
    }
  
    return geocode;
  }
  
  
  
  const locateAddress = async (el) => {
    let res = await searchYandexMaps(`Москва, ${el.address}`)
    // console.log({res}, `${el.store} ${el.address}`);
    // el.geocode = res.GeoObjectCollection.featureMember[0].GeoObject
    el.ya = res.features[0]  
  }
  
  
  async function fillCoordinates() {
    // for (const item of addresses.slice(0, 3)) {
      console.log('-------------', addresses.length);
      for (const [i, item] of addresses.entries()) {
        await locateAddress(item)
        await new Promise((resolve) => setTimeout(resolve, 300));
        console.log(i);
      }
  
      let o = []
      o = addresses.map((d) => {
        let { store, address, ya, visit_frequency, cluster, day, x, y } = d
        return {
          store, address, ya, visit_frequency, cluster, day, x, y
        }
      })
      console.log(o);
    // console.log(toRaw(addresses));
    // console.log(JSON.stringify((addresses), null, 2));
  
  }
  
  // watch(plan, (newVal, oldVal) => {
  //   // mmm.value = newVal
  //   console.log(newVal, oldVal);
  // })
  
  function handleDayChange(e) {
    console.log(e);
    if (e.added) {
      addresses.forEach((d) => {
  
      })
    }
  }

  
  function handleMove(e) {
    const list = e.relatedContext.list
    const el = e.draggedContext.element
    let fromDay = +e.from.dataset.dayId
    let toDay = +e.to.dataset.dayId
    // console.log(e);
    canDrop.value = true
    if (fromDay !== toDay && list.includes(el)) {
      // e.originalEvent.target.classList.add('no-drop');
      canDrop.value = false
      return false;
    }
    return true
  }

  function handleDropEnd(e, ee) {
    isDragging.value = false
    let fromDay = +e.from.dataset.dayId
    let toDay = +e.to.dataset.dayId
    // console.log({fromId, toId});
    canDrop.value = true

    let a = addresses.find(el => el.iid === e.item.id)
    if (a) {
      // console.log(fromId);
      let fromDayId = a.days.indexOf(fromDay)
      // toDayId = a.days.indexOf(toDay)
      a.days[fromDayId] = toDay
      onAddrPointerEnter(a)
      // a.days.splice(fromDayId, 1)
      // a.days.splice(toDayId, 0, fromDay)
      
    }
    // console.log(e.item.id);
  }
  
  
  
  
  function handleDayChange__(e) {
    if (e.added) {
      // let id = addresses.indexOf(e.added.element)
      nextTick(() => {
        let newGroupId = 0
        for (let i = 0; i < plan.length; i++) {
          // const element = plan[i];
          const isExist = plan[i].includes(e.added.element)
          if (isExist)
            newGroupId = i
        }
        console.log(e.added, newGroupId)
        e.added.element.day = newGroupId
      })
      // let id2 = plan.flat().indexOf(e.added.element)
      // console.log(addresses[id], id,id2);
      // console.log(plan[id2], id,id2);
      // e.added.element.day = e.added.newIndex
    }
  }
  
  function scrollToAddr(addr) {
    // addresses.forEach((a) => a.hovered = false)
    // addr.hovered = true
    addr.li.scrollIntoView({ behavior: 'smooth' })
  }
  
  function onAddrPointerEnter(addr) {
    // console.log(addr);
    addresses.forEach((a) => a.isHovered = false)
    if (!isDragging.value)
      addr.isHovered = true
  }
  
  function onAddrOver(addr) {
    // console.log(addr)
    addresses.forEach((a) => a.isHovered = false)
    addr.isHovered = true
  }
  
  /////////////////////////////////////
  
  function makeBins(items) {
    // Calculate the distance between each pair of coordinates
    // console.log(items);
    const coordinates = items.map(item => ({ x: item.x, y: item.y }));
    console.log(coordinates);
    // return
    var distances = [];
    for (var i = 0; i < coordinates.length; i++) {
      for (var j = i+1; j < coordinates.length; j++) {
        var dx = coordinates[j].x - coordinates[i].x;
        var dy = coordinates[j].y - coordinates[i].y;
        var distance = Math.sqrt(dx*dx + dy*dy);
        distances.push(distance);
      }
    }
  
    // Create an empty array to store the bins
    var bins = [];
  
    // Iterate through the coordinates array and calculate the minimum distance between each pair of coordinates
    for (var i = 0; i < distances.length; i++) {
      var minDistance = Infinity;
      var minIndex = void 0;
      for (var j = 0; j < distances.length; j++) {
        if (distances[j] === 0) continue;
        console.log(i);
        var dx = coordinates[j].x - coordinates[i].x;
        var dy = coordinates[j].y - coordinates[i].y;
        var distance = Math.sqrt(dx*dx + dy*dy);
        if (distance < minDistance) {
          minDistance = distance;
          minIndex = j;
        }
      }
      // Find the index of the nearest coordinate and add it to the corresponding bin
      var nearestIndex = i;
      if (minIndex !== void 0) {
        var dx = coordinates[nearestIndex].x - coordinates[minIndex].x;
        var dy = coordinates[nearestIndex].y - coordinates[minIndex].y;
        var distance = Math.sqrt(dx*dx + dy*dy);
        if (distance < distances[minIndex]) {
          nearestIndex = minIndex;
        }
      }
      bins.push(coordinates[nearestIndex]);
      coordinates.splice(nearestIndex, 1);
    }
  }

  </script>
  
  <style lang="sass">
    .ghost
      opacity: 0.5
      /* & *
        @apply cursor-not-allowed bg-neutral */
    .no-drop *
      @apply cursor-no-drop
    .hint
      position: absolute
      padding: 4px
      background: white
      border: 1px solid black
      white-space: nowrap
      opacity: 0.7
      transform: translate(8px, -50%)
  </style>
  
  <style scoped>
  .bounds {
    user-select: all;
  }
  
  .marker {
    background: var(--background);
    border-radius: 100%;
    width: 20px;
    height: 20px;
  }
  
  .cluster {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 50px;
    height: 50px;
    background: green;
    color: #fff;
    border-radius: 100%;
    cursor: pointer;
    border: 2px solid limegreen;
    outline: 2px solid green;
  }
  </style>