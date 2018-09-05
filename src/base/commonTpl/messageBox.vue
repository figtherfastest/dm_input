<template>
  <div class="messageBox">
    <el-button type="text" center="false"></el-button>
  </div>
</template>
<script>
  // import {getIndexDatas} from '../../api/index'

  export default {
    name:'messageBox',
    props: {
      showConfirmButton: {
        type: Boolean,
        default: true
      },
      showCancelButton: {
        type: Boolean,
        default: true
      },
      tittle: {
        type: String,
        default: "提示"
      },
      message: {
        type: String,
        default: "确定此操作"
      },
      confirmMessage: {
        type: String,
        default: "成功"
      },
      cancelMessage: {
        type: String,
        default: "已取消此操作"
      },
      id: {
        type: String,
        default: "nihao"
      }
    },
    created() {
      this.openBox()
    },
    methods: {
      openBox() {
        // getIndexDatas().then(res => {
        //   console.log(res);
        // })
        this.$confirm(this.message, this.tittle, {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          showConfirmButton: this.showConfirmButton,
          showCancelButton: this.showCancelButton,
          lockScroll: true,
          type: 'warning',
          center: true
        }).then(() => {
          console.log(1)

          console.log(2);
          this.$emit("confirmBtn", "box")
          this.$message({
            type: 'success',
            message: this.confirmMessage,
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: this.cancelMessage
          });
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  .messageBox {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }


</style>
