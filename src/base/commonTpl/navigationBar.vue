<template>
    <div class="defaultActive">
      <!--这边留有两个问题  1.默认路由 2.子路由的配置-->
      <el-menu v-show="navBarTittle == 'menu'" :default-active="this.$route.push" router class="el-menu-demo" mode="horizontal">
        <el-menu-item :index="item.name" v-for="item in navList">{{item.navItem}}</el-menu-item>
      </el-menu>
      <!--第二中导航栏,有子元素-->
      <el-menu v-show="navBarTittle == 'sliderDownMenu'" class="el-menu-demo" mode="horizontal" background-color="#545c64" text-color="#fff"  active-text-color="#ffd04b">
        <el-submenu :index="index.toString()" v-for="(item,index) in submenuNavBar">
          <template slot="title">{{item.tittle}}</template>
          <el-menu-item :index="findSubIndex(index,subIndex)"  v-for="(subItem,subIndex) in item.content">{{subItem}}</el-menu-item>
        </el-submenu>
      </el-menu>
      <!--侧边导航栏-->
      <div class="asideBar">
        <el-row class="tac">
        <el-col :span="12">
          <el-menu
            default-active="0"
            class="el-menu-vertical-demo"
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#ffd04b">
            <el-menu-item :index="index+''" v-for="(item,index) in asideNavBar">
              <i class="el-icon-menu"></i>
              <span slot="title">{{item}}</span>
            </el-menu-item>
          </el-menu>
        </el-col>
      </el-row>
      </div>
    </div>
</template>
<script>
    export default {
        name: "navigationBar",
        props:{
          navBarTittle:{
            type:String,
            default:""
          },
          navList:{
            type:Array,
            default:[]
          },
          submenuNavBar:{
            type:Array,
            default:[]
          },
          asideNavBar:{
            type:Array,
            default:[]
          }
        },
      methods:{
        findSubIndex(index,subIndex){
          return index+"-"+subIndex
        }
      }
    }
</script>

<style scoped>
  .asideBar{
    width:25%;
    height: 100%;
  }
</style>
