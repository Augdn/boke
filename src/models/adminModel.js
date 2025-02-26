import AdminController from "@/services/admin";

export default {
  //命名空间
  namespace:'admin',
  //仓库数据
  state:{
    adminList:[],    //存储所有的管理员信息
    adminInfo:null,  //存储当前登录的管理员信息
  },
  //同步更新仓库的状态数据
  reducers:{
    initAdminList(state,{ payload }){
      // console.log(payload,'111')
      const newState = { ...state };
      newState.adminList = payload
      return newState
    },

    //删除管理员
    deleteAdmin(state,{ payload}){
      const newState = {...state};
      const index = newState.adminList.indexOf(payload)
      const arr = [...newState.adminList]
      arr.splice(index,1)
      newState.adminList = arr
      return newState
    },
    //更新管理员信息
    updateAdmin(state,{payload}){
      const newState = {...state};
      for(let i = 0; i<newState.adminList.length;i++){
        if(newState.adminList[i] === payload.adminInfo._id){
          for(let key in payload.newAdminInfo){
            if(payload.newAdminInfo.hasOwnProperty(key)){
              newState.adminList[i][key] = payload.newAdminInfo[key]
            }
          }
          break
        }
        return newState
      }
    }, 
    
   // 新增管理员
   addAdmin(state, { payload }){
    console.log(payload);
    const newState = { ...state };
    const arr = [...newState.adminList];
    arr.push(payload);
    newState.adminList = arr;
    // console.log(newState);
    return newState;
}
  },
  //处理异步副作业
  effects:{
    //初始化管理员列表
    *_initAdminList(_,{ put, call }){
      //拿到服务器数据
      const {data} = yield call(AdminController.getAdmin)
      // console.log(data,"222")
      //调用reducer更新本地仓库
      yield put({
        type:"initAdminList",
        payload: data
      })
    },
    //删除管理员
    *_deleteAdmin({payload},{put,call}){
      //和服务器通信
      yield call(AdminController.deleteAdmin,payload._id)
      //更新本地 仓库
      yield put({
        type:"deleteAdmin",
        payload
      })
    },

    //更新管理员
    *_editAdmin({payload},{put,call}){
       yield call(AdminController.editAdmin,payload.adminInfo._id,payload.newAdminInfo)

      yield put({
        type:"updateAdmin",
        payload
      })
    },

    //新增管理员
    *_addAdmin({payload},{put,call}){
      //和服务器通信
      const  {data} =  yield call(AdminController.addAdmin, payload)

      //更新本地状态仓库
      yield put({
        type:"addAdmin",
        payload:data
      })
    }
   
  }
}