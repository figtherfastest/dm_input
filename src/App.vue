<template>
  <div id="app">
    <router-view/>
  </div>
</template>
<script>
export default {
  name: 'App'
}
</script>

<style>
*{
  margin: 0;
  padding: 0;
}
li{
  list-style: none;
}
html,body,#app{
  width: 100%;
  height: 100%;
  font-family: 'MicrosoftYaHei';
}
</style>
