import Vue from 'vue'
import Router from 'vue-router'
import api from './../common/js/index'

Vue.use(Router);

const router = new Router({
	mode: 'history',
	routes: [{
			path: '/',
			component: (resolve) => {
				require(['../view/login/Login'], resolve)
			},
			hidden: true
		},
		{
			path: '*', //*号表示匹配任意内容
			meta: {
				requireAuth: true
			},
			component: (resolve) => {
				require(['../view/login/Login'], resolve)
			},
			hidden: true
		},
		{
			path: '/login',
			component: (resolve) => {
				require(['../view/login/Login'], resolve)
			},
			hidden: true
		},
		{
			path: '/index',
			component: (resolve) => {
				require(['../view/login/Login'], resolve)
			},
			hidden: true
		},
		{
			path: '/home',
			meta: {
				requireAuth: true
			},
			component: (resolve) => {
				require(['../frame/home/Home'], resolve)
			},
			children: [{
					path: '/pageIndex',
					name: '主页',
					meta: {
						requireAuth: true
					},
					component: (resolve) => {
						require(['../view/index/Index'], resolve)
					}
				},
				{
					path: '/opsAudit',
					name: '运维管理 > 资源审核',
					// meta: {
					// 	requireAuth: true
					// },
					component: (resolve) => {
						require(['../view/operationManage/ResourceAudit'], resolve)
					}
				},
				{
					path: '/opsBaseconfig',
					name: '运维管理 > 基础配置',
					// meta: {
					// 	requireAuth: true
					// },
					component: (resolve) => {
						require(['../view/operationManage/BaseConfig'], resolve)
					}
				},
				// middleware
				{
					path: '/opsApplication',
					name: '运维管理 > 资源申请',
					// meta: {
					// 	requireAuth: true
					// },
					component: (resolve) => {
						require(['../view/operationManage/ResourceApply'], resolve)
					}
				},
				{
					path: '/opsMdware',
					name: '运维管理 > 中间件',
					// meta: {
					// 	requireAuth: true
					// },
					component: (resolve) => {
						require(['../view/operationManage/Middleware'], resolve)
					}
				},
				{
					path: '/NewMiddleware',
					name: '运维管理 > 中间件 > 创建应用',
					// meta: {
					// 	requireAuth: true
					// },
					component: (resolve) => {
						require(['../view/operationManage/NewMiddleware'], resolve)
					}
				},
				{
					path: '/DeploymentDetail',
					name: '运维管理 > 中间件 > 部署详情',
					// meta: {
					// 	requireAuth: true
					// },
					component: (resolve) => {
						require(['../view/operationManage/DeploymentDetail'], resolve)
					}
				},
				{
					path: '/opsImage',
					name: '运维管理 > 镜像仓库',
					// meta: {
					// 	requireAuth: true
					// },
					component: (resolve) => {
						require(['../view/operationManage/MirroredWarehouse'], resolve)
					}
				},
        {
          path: '/serverNode',
          name: '运维管理 > 服务器维护',
          // meta: {
          // 	requireAuth: true
          // },
          component: (resolve) => {
            require(['../view/operationManage/NetworkNodeServer'], resolve)
          }
        },
        {
          path: '/EditNodeLabel',
            name: '运维管理 > 服务器维护>标签维护',
            component: (resolve) => {
              require(['../view/operationManage/EditNodeLabel'], resolve)
            }
        },
				{
					path: '/sysuser',
					name: '用户中心 > 用户管理',
					// meta: {
					//   requireAuth: true
					// },
					component: (resolve) => {
						require(['../view/user/SysUser'], resolve)
					}
				},
				{
					path: '/roleMgr',
					name: '用户中心 > 角色管理',
					// meta: {
					//   requireAuth: true
					// },
					component: (resolve) => {
						require(['../view/user/RoleMgr'], resolve)
					}
				},
				{
					path: '/project',
					name: '用户中心 > 项目组管理',
					// meta: {
					//   requireAuth: true
					// },
					component: (resolve) => {
						require(['../view/user/ProJect'], resolve)
					}
				},
        {
          path: '/cicd',
          name: 'devops > 持续集成与发布',
          // meta: {
          //   requireAuth: true
          // },
          component: (resolve) => {
            require(['../view/devops/Cicds'], resolve)
          }
        },
        {
          path: '/devops',
          name: 'devops > 持续集成与发布',
          // meta: {
          //   requireAuth: true
          // },
          component: (resolve) => {
            require(['../view/devops/Devops'], resolve)
          }
        },
        {
          path: '/DeployEnv',
          name: 'devops > 持续集成与发布 > 环境信息',
          // meta: {
          //   requireAuth: true
          // },
          component: (resolve) => {
            require(['../view/devops/DevopsEnv.vue'], resolve)
          }
        },
        {
          path: '/DeployConfig',
          name: 'devops > 持续集成与发布 > 配置',
          // meta: {
          //   requireAuth: true
          // },
          component: (resolve) => {
            require(['../view/devops/DevopsConfig.vue'], resolve)
          }
        },
        {
          path: '/DeployPlay',
          name: 'devops > 持续集成与发布 > 部署',
          // meta: {
          //   requireAuth: true
          // },
          component: (resolve) => {
            require(['../view/devops/DevopsPlay.vue'], resolve)
          }
        },
				{
					path: '/newProiect',
					name: 'devops > 新建项目',
					// meta: {
					//   requireAuth: true
					// },
					component: (resolve) => {
						require(['../view/devops/NewProject'], resolve)
					}
				},
				{
					path: '/newApplication',
					name: 'devops > 新建应用',
					// meta: {
					//   requireAuth: true
					// },
					component: (resolve) => {
						require(['../view/devops/NewApplication'], resolve)
					}
				},
			]
		}
	]
})

//  判断是否需要登录权限 以及是否登录
router.beforeEach((to, from, next) => {
	if (to.path != '/opsImage') {
		next();
	}
	return;
	// if(to.matched.some(res => res.meta.requireAuth)) { // 判断是否需要登录权限
	// 	var user = api.sGetObject("_user");
	// 	if(user == null) {
	// 		user = {
	// 			token: ''
	// 		};
	// 	}
	// 	if(user.token) { // 判断是否登录
	// 		next()
	// 	} else { // 没登录则跳转到登录界面
	// 		next({
	// 			path: '/',
	// 			// query: {redirect: to.fullPath}
	// 		})
	// 	}
	// } else {
	// 	next()
	// }
})

export default router
