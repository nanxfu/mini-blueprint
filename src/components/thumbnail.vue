<template>
  <div>
    <div class="fixed w-48 h-48 top-0 right-0 m-5 bg-gray-500" @click="capture">
       <img class="object-scale-down" src="https://img2.baidu.com/it/u=3329909248,3799019568&fm=253&fmt=auto&app=138&f=JPEG?w=889&h=500" ref="view">
    </div>

  </div>

</template>

<script setup lang="ts">
import * as htmlToImage from 'html-to-image';
import {ref} from "vue";
import html2canvas from "html2canvas";

 const view = ref()
let container = document.querySelector("._container")
function capture() {
  html2canvas(document.querySelector("#app"),{
    height: 1000,
  scrollY:-500
  }).then(canvas => {
    document.body.appendChild(canvas)
  });
  // var node = document.getElementById('app');
  // htmlToImage.toPng(node, {
  //   height:1000,
  //   canvasHeight:1000
  // })
  //     .then(function (dataUrl) {
  //       view.value.src = dataUrl
  //     })
  //     .catch(function (error) {
  //       console.log(error)
  //     });
}
</script>

<style scoped>

</style>