<script setup lang="ts">
import ImgHandlerWrapper from '@/components/ImgHandlerWrapper.vue'
import SingleViewer from '@/components/singleView/SingleViewer.vue'

const getAspect = ({width,height}: {width:number, height: number}) => {
    console.log(width,height)
}
</script>

<template>
<!--  <img-handler-wrapper>-->
<!--    <single-viewer @getAspect="getAspect" />-->
<!--  </img-handler-wrapper>-->
</template>

<style scoped></style>
