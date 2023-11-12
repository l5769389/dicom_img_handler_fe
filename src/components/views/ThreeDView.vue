<script setup lang="ts">
import '@kitware/vtk.js/favicon'

// Load the rendering pieces we want to use (for both WebGL and WebGPU)
import '@kitware/vtk.js/Rendering/Profiles/Volume'

import vtkVolume from '@kitware/vtk.js/Rendering/Core/Volume'
import vtkVolumeMapper from '@kitware/vtk.js/Rendering/Core/VolumeMapper'
import vtkPiecewiseFunction from '@kitware/vtk.js/Common/DataModel/PiecewiseFunction'
import vtkColorTransferFunction from '@kitware/vtk.js/Rendering/Core/ColorTransferFunction'

import vtkXMLImageDataReader from '@kitware/vtk.js/IO/XML/XMLImageDataReader'
import vtkXMLImageDataWriter from '@kitware/vtk.js/IO/XML/XMLImageDataWriter'
import vtkXMLWriter from '@kitware/vtk.js/IO/XML/XMLWriter'
import '@kitware/vtk.js/IO/Core/DataAccessHelper/HttpDataAccessHelper'
import { onMounted, ref } from 'vue'
import vtkVolumeProperty from '@kitware/vtk.js/Rendering/Core/VolumeProperty'
import vtkGenericRenderWindow from '@kitware/vtk.js/Rendering/Misc/GenericRenderWindow'
import { ip } from '@/config'

const vtkContainer = ref()
const fullScreenRenderer = vtkGenericRenderWindow.newInstance({
  background: [0, 0, 0]
})
const renderer = fullScreenRenderer.getRenderer()
const renderWindow = fullScreenRenderer.getRenderWindow()
const writer = vtkXMLImageDataWriter.newInstance()
writer.setFormat(vtkXMLWriter.FormatTypes.BINARY)

const writerReader = vtkXMLImageDataReader.newInstance()
const volume = vtkVolume.newInstance()
const mapper = vtkVolumeMapper.newInstance()
const volumeProperty = vtkVolumeProperty.newInstance()

const ctfun = vtkColorTransferFunction.newInstance()
const piecewiseFunction = vtkPiecewiseFunction.newInstance()
ctfun.addRGBPoint(0.0, 0.0, 0.0, 0.0)
ctfun.addRGBPoint(255.0, 1.0, 1.0, 1.0)
piecewiseFunction.addPoint(0.0, 0.0)
piecewiseFunction.addPoint(255, 1.0)
volume.setMapper(mapper)

onMounted(() => {
  init()
  render()
})

const render = () => {
  fullScreenRenderer.setContainer(vtkContainer.value)
  mapper.setInputConnection(writerReader.getOutputPort())
  volumeProperty.setScalarOpacity(0, piecewiseFunction)
  volumeProperty.setRGBTransferFunction(0, ctfun)
  volume.setProperty(volumeProperty)
  renderer.addActor(volume)
}

const getDrawInfo = async () => {
  await fetch(`http://${ip}:8000/3d`)
  const response = await fetch(`http://${ip}:8000/static/output.vti`)
  return await response.text()
}

const parseDrawInfo = async (drawInfo: string) => {
  const textEncoder = new TextEncoder()
  writerReader.parseAsArrayBuffer(textEncoder.encode(drawInfo))
}
const showLoading = ref(true)

const init = async () => {
  try {
    showLoading.value = true
    const drawInfo = await getDrawInfo()
    await parseDrawInfo(drawInfo)
  } catch (e) {
    //
  } finally {
    showLoading.value = false
  }
  renderer.resetCamera()
  renderWindow.render()
}
</script>

<template>
  <n-spin :show="showLoading">
    <div class="w-[650px] h-[650px]" ref="vtkContainer" id="vtkContainer"></div>
  </n-spin>
</template>

<style></style>