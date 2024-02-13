<template lang="pug">
.carousel.w-full.box-border.space-x-4.justify-stretch.mt-6(
  :class="[canDrop ? '':'no-drop']"
  )
  .carousel-item.rounded.flex.flex-col.flex-1.min-w-52.border-2.box-border(
    v-for="d,i in kmean.groupedAddressesByDays.value"
    :class="[props.currDay == i ? 'border-accent':'border-neutral']"
    :style="{ borderColor: colors[props.currDay == i ? props.currDay : -1] }"
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


const props = defineProps({
  addresses: Array,
  kmean: Object,
  props.currDay: Number
})

</script>