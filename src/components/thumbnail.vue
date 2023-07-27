<template>
  <div>
    <div class="fixed w-48 h-44 top-0 right-0 m-5 bg-gray-500" >
      <img src="">
    </div>
    <span
        class="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10 select-none"
        style="z-index: 100"
        @click="capture">changeScale
      </span>
  </div>


</template>

<script setup lang="ts">
import * as htmlToImage from 'html-to-image';
import {ref} from "vue";

// const img = ref()
function capture() {
  var node = document.getElementById('app');
  htmlToImage.toPng(node)
      .then(function (dataUrl) {
        var img = new Image();
        img.src = dataUrl;
        document.body.appendChild(img);
      })
      .catch(function (error) {
        console.error('oops, something went wrong!', error);
      });
}
</script>

<style scoped>

</style>