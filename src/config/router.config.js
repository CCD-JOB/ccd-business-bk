// eslint-disable-next-line
import { UserLayout, BasicLayout, RouteView } from '@/layouts'
/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [
  {
    path: '/',
    name: 'index',
    redirect: '/welcome',
    component: BasicLayout,
    children: [
      // 欢迎
      {
        path: '/welcome',
        name: 'welcome',
        meta: {
          title: '欢迎'
        },
        hidden: true,
        component: () =>
          import(/* webpackChunkName: "welcome" */ '@/views/welcome')
      },
      // 顾问管理
      {
        path: '/consultantAction',
        component: RouteView,
        children: [
          {
            path: 'addconsultant',
            name: 'addConsultant',
            hidden: true,
            component: () =>
              import('@/views/consultantmanagement/modules/AddConsultant'),
            meta: {
              title: '顾问管理-添加顾问',
              dutyName: 'consultant',
              keepAlive: false
            }
          },
          {
            path: 'editconsultant',
            name: 'editConsultant',
            hidden: true,
            component: () =>
              import('@/views/consultantmanagement/modules/EditConsultant'),
            meta: {
              title: '顾问管理-编辑顾问',
              dutyName: 'consultant',
              keepAlive: false
            }
          }
        ]
      },
      // 分支机构管理
      {
        path: '/branchesAction',
        component: RouteView,
        children: [
          {
            path: 'addbranch',
            name: 'addBranch',
            hidden: true,
            component: () => import('@/views/branches/modules/AddBranch'),
            meta: {
              title: '机构管理-添加机构',
              dutyName: 'branches',
              keepAlive: false
            }
          },
          {
            path: 'editbranch',
            name: 'editBranch',
            hidden: true,
            component: () => import('@/views/branches/modules/EditBranch'),
            meta: {
              title: '机构管理-编辑机构',
              dutyName: 'branches',
              keepAlive: false
            }
          }
        ]
      },
      // 精彩活动管理
      {
        path: '/activitiesAction',
        component: RouteView,
        children: [
          {
            path: 'viewactivities',
            name: 'viewActivities',
            hidden: true,
            component: () =>
              import('@/views/excitingActivities/modules/ViewActivities'),
            meta: {
              title: '精彩活动管理-查看活动',
              dutyName: 'activities',
              keepAlive: false
            }
          },
          {
            path: 'addactivities',
            name: 'addActivities',
            hidden: true,
            component: () =>
              import('@/views/excitingActivities/modules/AddActivities'),
            meta: {
              title: '精彩活动管理-新增活动',
              dutyName: 'activities',
              keepAlive: false
            }
          },
          {
            path: 'editactivities',
            name: 'editActivities',
            hidden: true,
            component: () =>
              import('@/views/excitingActivities/modules/EditActivities'),
            meta: {
              title: '精彩活动管理-编辑活动',
              dutyName: 'activities',
              keepAlive: false
            }
          }
        ]
      }
    ]
  },

  {
    path: '/brandselect',
    name: 'brandselect',
    meta: {
      title: '品牌选择'
    },
    hidden: true,
    component: () => import('@/views/brandselect')
  },
  {
    path: '/user',
    component: UserLayout,
    redirect: '/user/login',
    hidden: true,
    children: [
      {
        path: 'login',
        name: 'login',
        component: () =>
          import(/* webpackChunkName: "user" */ '@/views/user/Login')
      }
    ]
  },
  {
    path: '/404',
    component: () =>
      import(/* webpackChunkName: "fail" */ '@/views/exception/404')
  }
]

export const asyncRouterMap = []
