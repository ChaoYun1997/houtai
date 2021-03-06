// eslint-disable-next-line
import { UserLayout, BasicLayout, BlankLayout } from '@/layouts'
import { bxAnaalyse, appStore, comment, database } from '@/core/icons'

const RouteView = {
  name: 'RouteView',
  render: h => h('router-view')
}

export const asyncRouterMap = [
  {
    path: '/',
    name: 'index',
    component: BasicLayout,
    meta: { title: 'menu.home' },
    redirect: '/dashboard/home',
    children: [
      // dashboard
      {
        path: '/dashboard',
        name: 'dashboard',
        redirect: '/dashboard/home',
        component: RouteView,
        meta: { title: '网站信息', keepAlive: true, icon: bxAnaalyse },
        children: [
          {
            path: '/dashboard/home',
            name: 'Home',
            component: () => import('@/views/home/Home'),
            meta: { title: '网站信息', keepAlive: true }
          }
        ]
      },
      // 网站配置
      {
        path: '/configuration',
        name: 'configuration',
        component: RouteView,
        redirect: '/configuration/pageManage',
        meta: { title: '网站管理', icon: comment },
        children: [
          {
            path: '/configuration/pageManage',
            name: 'configurationPageManage',
            hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
            component: () => import('@/views/configuration/PageManage'),
            meta: { title: '页面管理', keepAlive: true }
          },
          {
            path: '/configuration/pageDetails/:id?',
            name: 'configurationPageDetails',
            hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
            component: () => import('@/views/configuration/PageDetails'),
            meta: { title: '新增页面', keepAlive: true }
          },
          {
            path: '/configuration/functionManage',
            name: 'configurationFunction',
            hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
            component: () => import('@/views/configuration/FunctoinManage'),
            meta: { title: '功能管理', keepAlive: true }
          }
        ]
      },
      // 产品
      {
        path: '/products',
        name: 'products',
        component: RouteView,
        redirect: '/products/product-list',
        meta: { title: '产品管理', icon: appStore },
        children: [
          // {
          //   path: '/products/test',
          //   name: 'TableListWrapper',
          //   hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
          //   component: () => import('@/views/products/Details'),
          //   meta: { title: 'test', keepAlive: true }
          // },
          {
            path: '/products/product-list/:pageNo([1-9]\\d*)?',
            name: 'ProductList',
            hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
            component: () => import('@/views/products/ProductList'),
            meta: { title: '产品管理', keepAlive: true }
          },
          {
            path: '/products/add-product/:id?',
            name: 'AddProduct',
            component: () => import('@/views/products/ProductDetail'),
            meta: { title: '产品添加', keepAlive: true }
          },
          // {
          //   path: '/products/product-sort',
          //   name: 'ProductSort',
          //   component: () => import('@/views/products/ProductSort'),
          //   meta: { title: '产品排序', keepAlive: true }
          // },
          {
            path: '/products/category-manage',
            name: 'ProductCategory',
            component: () => import('@/views/products/Category'),
            meta: { title: '分类管理', keepAlive: true }
          },
          // {
          //   path: '/products/product-cate-sort',
          //   name: 'ProductCateSort',
          //   component: () => import('@/views/products/ProductCateSort'),
          //   meta: { title: '产品分类排序', keepAlive: true }
          // },
          {
            path: '/products/add-category/:id?',
            name: 'AddProductCategory',
            component: () => import('@/views/products/CatetoryDetail'),
            meta: { title: '分类添加', keepAlive: true }
          },
          // {
          //   path: '/products/field-manage',
          //   name: 'fieldManage',
          //   component: () => import('@/views/list/search/SearchLayout'),
          //   redirect: '/list/search/article',
          //   meta: { title: '管理自定义字段', keepAlive: true }
          // },
          {
            path: '/products/watermark',
            name: 'Watermark',
            component: () => import('@/views/products/Watermark'),
            meta: { title: '设置水印', keepAlive: true }
          },
          {
            path: '/products/recycle-bin',
            name: 'ProductsRecycleBin',
            component: () => import('@/views/products/RecycleBin'),
            meta: { title: '产品回收', keepAlive: true }
          }
        ]
      },
      // 关键词
      {
        path: '/keyword',
        name: 'keyword',
        component: RouteView,
        redirect: '/keyword/keyword-list',
        meta: { title: '关键词库', icon: 'form' },
        children: [
          {
            path: '/keyword/keyword-list/:pageNo([1-9]\\d*)?',
            name: 'keywordManage',
            hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
            component: () => import('@/views/keyword/KeywordList'),
            meta: { title: '关键词词库', keepAlive: true }
          },
          {
            path: '/keyword/setting',
            name: 'keywordSetting',
            component: () => import('@/views/keyword/KeywordSetting'),
            meta: { title: '关键词规则', keepAlive: true }
          }
        ]
      },
      // 文件银行
      {
        path: '/fileBank',
        name: 'fileBank',
        component: RouteView,
        meta: { title: '文件银行', icon: database },
        redirect: '/fileBank/list',
        hideChildrenInMenu: true,
        children: [
          {
            path: '/fileBank/list/:type?',
            name: 'filiBankList',
            hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
            component: () => import('@/views/fileBank/FileBank'),
            meta: { title: '文件银行', keepAlive: true },
            hidden: true
          }
        ]
      },
      // 文章
      {
        path: '/articles',
        name: 'articles',
        component: RouteView,
        redirect: '/articles/article-list',
        meta: { title: '文章管理', icon: 'profile' },
        children: [
          {
            path: '/articles/article-list',
            name: 'articleManage',
            hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
            component: () => import('@/views/article/ArticleList'),
            meta: { title: '文章列表', keepAlive: true }
          },
          {
            path: '/articles/add-article/:id?',
            name: 'addArticle',
            component: () => import('@/views/article/ArticleDetail'),
            meta: { title: '添加文章', keepAlive: true }
          },
          // {
          //   path: '/articles/sort',
          //   name: 'articleSort',
          //   component: () => import('@/views/article/Sort'),
          //   meta: { title: '文章排序', keepAlive: true }
          // },
          {
            path: '/articles/article-category',
            name: 'articleCategory',
            component: () => import('@/views/article/Category'),
            meta: { title: '管理分类', keepAlive: true }
          },
          // {
          //   path: '/articles/article-cate-sort',
          //   name: 'ArticleCateSort',
          //   component: () => import('@/views/article/ArticleCateSort'),
          //   meta: { title: '文章分类排序', keepAlive: true }
          // },
          {
            path: '/articles/add-category/:id?',
            name: 'addAriticleCategory',
            component: () => import('@/views/article/CategoryDetail'),
            meta: { title: '添加分类', keepAlive: true }
          },
          {
            path: '/articles/recycle-bin',
            name: 'articleRecycleBin',
            hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
            component: () => import('@/views/article/RecycleBin'),
            meta: { title: '文章回收', keepAlive: true }
          }
        ]
      },
      // 询盘
      {
        path: '/enquiry',
        name: 'enquiry',
        component: RouteView,
        redirect: '/enquiry/enquiry-list',
        meta: { title: '询盘管理', icon: comment },
        children: [
          {
            path: '/enquiry/enquiry-list/:pageNo([1-9]\\d*)?',
            name: 'enquiryManage',
            hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
            component: () => import('@/views/enquiry/EnquiryList'),
            meta: { title: '询盘管理', keepAlive: true }
          },
          {
            path: '/enquiry/detail/:id?',
            name: 'enquiryDetail',
            hidden: true,
            hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
            component: () => import('@/views/enquiry/EnquiryDetail'),
            meta: { title: '询单详情', keepAlive: true }
          },
          {
            path: '/enquiry/recycle-bin',
            name: 'enquiryRecycleBin',
            component: () => import('@/views/enquiry/EnquiryRecycleBin'),
            meta: { title: '询盘回收', keepAlive: true }
          },
          {
            path: '/enquiry/setting',
            name: 'EnquirySetting',
            component: () => import('@/views/enquiry/EnquirySetting'),
            meta: { title: '询盘设置', keepAlive: true }
          }
        ]
      }

      // forms
      // {
      //   path: '/form',
      //   redirect: '/form/base-form',
      //   component: RouteView,
      //   meta: { title: '表单页', icon: 'form', permission: ['form'] },
      //   children: [
      //     {
      //       path: '/form/base-form',
      //       name: 'BaseForm',
      //       component: () => import('@/views/form/basicForm'),
      //       meta: { title: '基础表单', keepAlive: true, permission: ['form'] }
      //     },
      //     {
      //       path: '/form/step-form',
      //       name: 'StepForm',
      //       component: () => import('@/views/form/stepForm/StepForm'),
      //       meta: { title: '分步表单', keepAlive: true, permission: ['form'] }
      //     },
      //     {
      //       path: '/form/advanced-form',
      //       name: 'AdvanceForm',
      //       component: () => import('@/views/form/advancedForm/AdvancedForm'),
      //       meta: { title: '高级表单', keepAlive: true, permission: ['form'] }
      //     }
      //   ]
      // },

      // list
      // {
      //   path: '/list',
      //   name: 'list',
      //   component: RouteView,
      //   redirect: '/list/table-list',
      //   meta: { title: '列表页', icon: 'table', permission: [ 'table' ] },
      //   children: [
      //     {
      //       path: '/list/table-list/:pageNo([1-9]\\d*)?',
      //       name: 'TableListWrapper',
      //       hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
      //       component: () => import('@/views/list/TableList'),
      //       meta: { title: '查询表格', keepAlive: true, permission: [ 'table' ] }
      //     },
      //     {
      //       path: '/list/basic-list',
      //       name: 'BasicList',
      //       component: () => import('@/views/list/BasicList'),
      //       meta: { title: '标准列表', keepAlive: true, permission: [ 'table' ] }
      //     },
      //     {
      //       path: '/list/card',
      //       name: 'CardList',
      //       component: () => import('@/views/list/CardList'),
      //       meta: { title: '卡片列表', keepAlive: true, permission: [ 'table' ] }
      //     },
      //     {
      //       path: '/list/search',
      //       name: 'SearchList',
      //       component: () => import('@/views/list/search/SearchLayout'),
      //       redirect: '/list/search/article',
      //       meta: { title: '搜索列表', keepAlive: true, permission: [ 'table' ] },
      //       children: [
      //         {
      //           path: '/list/search/article',
      //           name: 'SearchArticles',
      //           component: () => import('../views/list/search/Article'),
      //           meta: { title: '搜索列表（文章）', permission: [ 'table' ] }
      //         },
      //         {
      //           path: '/list/search/project',
      //           name: 'SearchProjects',
      //           component: () => import('../views/list/search/Projects'),
      //           meta: { title: '搜索列表（项目）', permission: [ 'table' ] }
      //         },
      //         {
      //           path: '/list/search/application',
      //           name: 'SearchApplications',
      //           component: () => import('../views/list/search/Applications'),
      //           meta: { title: '搜索列表（应用）', permission: [ 'table' ] }
      //         }
      //       ]
      //     }
      //   ]
      // },

      // profile
      // {
      //   path: '/profile',
      //   name: 'profile',
      //   component: RouteView,
      //   redirect: '/profile/basic',
      //   meta: { title: '详情页', icon: 'profile', permission: ['profile'] },
      //   children: [
      //     {
      //       path: '/profile/basic',
      //       name: 'ProfileBasic',
      //       component: () => import('@/views/profile/basic'),
      //       meta: { title: '基础详情页', permission: ['profile'] }
      //     },
      //     {
      //       path: '/profile/advanced',
      //       name: 'ProfileAdvanced',
      //       component: () => import('@/views/profile/advanced/Advanced'),
      //       meta: { title: '高级详情页', permission: ['profile'] }
      //     }
      //   ]
      // },

      // result
      // {
      //   path: '/result',
      //   name: 'result',
      //   component: RouteView,
      //   redirect: '/result/success',
      //   meta: { title: '结果页', icon: 'check-circle-o', permission: ['result'] },
      //   children: [
      //     {
      //       path: '/result/success',
      //       name: 'ResultSuccess',
      //       component: () => import(/* webpackChunkName: "result" */ '@/views/result/Success'),
      //       meta: { title: '成功', keepAlive: false, hiddenHeaderContent: true, permission: ['result'] }
      //     },
      //     {
      //       path: '/result/fail',
      //       name: 'ResultFail',
      //       component: () => import(/* webpackChunkName: "result" */ '@/views/result/Error'),
      //       meta: { title: '失败', keepAlive: false, hiddenHeaderContent: true, permission: ['result'] }
      //     }
      //   ]
      // },

      // Exception
      // {
      //   path: '/exception',
      //   name: 'exception',
      //   component: RouteView,
      //   redirect: '/exception/403',
      //   meta: { title: '异常页', icon: 'warning', permission: ['exception'] },
      //   children: [
      //     {
      //       path: '/exception/403',
      //       name: 'Exception403',
      //       component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/403'),
      //       meta: { title: '403', permission: ['exception'] }
      //     },
      //     {
      //       path: '/exception/404',
      //       name: 'Exception404',
      //       component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404'),
      //       meta: { title: '404', permission: ['exception'] }
      //     },
      //     {
      //       path: '/exception/500',
      //       name: 'Exception500',
      //       component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/500'),
      //       meta: { title: '500', permission: ['exception'] }
      //     }
      //   ]
      // },

      // account
      // {
      //   path: '/account',
      //   component: RouteView,
      //   redirect: '/account/center',
      //   name: 'account',
      //   meta: { title: '个人页', icon: 'user', keepAlive: true, permission: ['user'] },
      //   children: [
      //     {
      //       path: '/account/center',
      //       name: 'center',
      //       component: () => import('@/views/account/center'),
      //       meta: { title: '个人中心', keepAlive: true, permission: ['user'] }
      //     },
      //     {
      //       path: '/account/settings',
      //       name: 'settings',
      //       component: () => import('@/views/account/settings/Index'),
      //       meta: { title: '个人设置', hideHeader: true, permission: ['user'] },
      //       redirect: '/account/settings/base',
      //       hideChildrenInMenu: true,
      //       children: [
      //         {
      //           path: '/account/settings/base',
      //           name: 'BaseSettings',
      //           component: () => import('@/views/account/settings/BaseSetting'),
      //           meta: { title: '基本设置', hidden: true, permission: ['user'] }
      //         },
      //         {
      //           path: '/account/settings/security',
      //           name: 'SecuritySettings',
      //           component: () => import('@/views/account/settings/Security'),
      //           meta: { title: '安全设置', hidden: true, keepAlive: true, permission: ['user'] }
      //         },
      //         {
      //           path: '/account/settings/custom',
      //           name: 'CustomSettings',
      //           component: () => import('@/views/account/settings/Custom'),
      //           meta: { title: '个性化设置', hidden: true, keepAlive: true, permission: ['user'] }
      //         },
      //         {
      //           path: '/account/settings/binding',
      //           name: 'BindingSettings',
      //           component: () => import('@/views/account/settings/Binding'),
      //           meta: { title: '账户绑定', hidden: true, keepAlive: true, permission: ['user'] }
      //         },
      //         {
      //           path: '/account/settings/notification',
      //           name: 'NotificationSettings',
      //           component: () => import('@/views/account/settings/Notification'),
      //           meta: { title: '新消息通知', hidden: true, keepAlive: true, permission: ['user'] }
      //         }
      //       ]
      //     }
      //   ]
      // }

      // other
      /*
      {
        path: '/other',
        name: 'otherPage',
        component: PageView,
        meta: { title: '其他组件', icon: 'slack', permission: [ 'dashboard' ] },
        redirect: '/other/icon-selector',
        children: [
          {
            path: '/other/icon-selector',
            name: 'TestIconSelect',
            component: () => import('@/views/other/IconSelectorView'),
            meta: { title: 'IconSelector', icon: 'tool', keepAlive: true, permission: [ 'dashboard' ] }
          },
          {
            path: '/other/list',
            component: RouteView,
            meta: { title: '业务布局', icon: 'layout', permission: [ 'support' ] },
            redirect: '/other/list/tree-list',
            children: [
              {
                path: '/other/list/tree-list',
                name: 'TreeList',
                component: () => import('@/views/other/TreeList'),
                meta: { title: '树目录表格', keepAlive: true }
              },
              {
                path: '/other/list/edit-table',
                name: 'EditList',
                component: () => import('@/views/other/TableInnerEditList'),
                meta: { title: '内联编辑表格', keepAlive: true }
              },
              {
                path: '/other/list/user-list',
                name: 'UserList',
                component: () => import('@/views/other/UserList'),
                meta: { title: '用户列表', keepAlive: true }
              },
              {
                path: '/other/list/role-list',
                name: 'RoleList',
                component: () => import('@/views/other/RoleList'),
                meta: { title: '角色列表', keepAlive: true }
              },
              {
                path: '/other/list/system-role',
                name: 'SystemRole',
                component: () => import('@/views/role/RoleList'),
                meta: { title: '角色列表2', keepAlive: true }
              },
              {
                path: '/other/list/permission-list',
                name: 'PermissionList',
                component: () => import('@/views/other/PermissionList'),
                meta: { title: '权限列表', keepAlive: true }
              }
            ]
          }
        ]
      }
      */
    ]
  },
  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
]

/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [
  {
    path: '/user',
    component: UserLayout,
    redirect: '/user/login',
    hidden: true,
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/login')
      },
      {
        path: 'register',
        name: 'register',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/register')
      },
      {
        path: 'register-result',
        name: 'registerResult',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/registerResult')
      },
      {
        path: 'recover',
        name: 'recover',
        component: undefined
      }
    ]
  },

  {
    path: '/404',
    component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404')
  }
]
