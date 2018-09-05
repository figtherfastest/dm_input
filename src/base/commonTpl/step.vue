<template>
    <div class="steps">
      <el-steps :space="step.space" :active="step.active" finish-status="finish" align-center="true">
        <el-step v-for="item in step.content" :title="item"></el-step>
      </el-steps>
    </div>
</template>

<script>
    export default {
        props:{
          step:{
            type:Object,
            default:{}
          }
        }
    }
</script>

<style scoped>
  .steps{
    width: 100%;
    height: 50px;
    /*display: flex;*/
    /*justify-content: space-between;*/
    /*align-items: center;*/
  }
</style>
