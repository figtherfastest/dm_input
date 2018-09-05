import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/components/index'
import RetrievePassword from '@/components/retrievePassword/retrievePassword'
import BeautyFill from '@/components/beautyFill/beautyFill'
import PersonalCenter from '@/components/personalCenter/personalCenter'
import BeautyFillResult from '@/components/beautyFillResult/beautyFillResult'
import ProjectIndex from '@/components/projectIndex/projectIndex'
import MessageBox from '@/base/commonTpl/messageBox'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index,
    },
    {
      path: '/retrievePassword',
      name: 'RetrievePassword',
      component: RetrievePassword,
    },
    {
      path: '/beautyFill',
      name: 'BeautyFill',
      component: BeautyFill,
      children:[
        {
          path: '/messageBox',
          name: 'messageBox',
          component: MessageBox,
        }
      ]
    },
    {
      path: '/personalCenter',
      name: 'PersonalCenter',
      component: PersonalCenter,
    },
    {
      path: '/beautyFillResult',
      name: 'BeautyFillResult',
      component: BeautyFillResult,
    },
    {
      path: '/projectIndex',
      name: 'ProjectIndex',
      component: ProjectIndex,
    }
  ]
})
