<template>
    <div class="breadcrumb">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item v-for="item in navigationContent" :to="{path:'/'+item.path}">{{item.tittle}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
</template>

<script>
    export default {
        props:{
          separate:{
            type:String,
            default:'/'
          },
          navigationContent:{
            type:Array,
            default:[]
          }
        }
    }
</script>

<style scoped>

</style>
