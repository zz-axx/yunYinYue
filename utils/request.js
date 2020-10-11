// 封装发送请求的方法

/*
* 封装思想：
*   函数：
*     1. 功能点明确
*     2. 函数体保留相同的代码，或者是静态的代码
*     3. 将动态的数据作为参数声明
*     4. 使用者根据使用的需求动态传入实参进而去使用
*
*   组件：
*     1. 功能效果要明确
*     2. 组件内部放置相同的代码或者是静态的数据
*     3. 将动态的数据抽取作为组件的props属性由外部导入
*     4. 使用者需要根据需求动态传入数据，以标签属性的形式传入
*     5. 良好的组件可以规定props属性的必要性和数据类型
*       如: props: {
*         num: {
*           type: Number, // 数据类型
*           isRequired: true // 必须传入
*           default: 0, // 默认值
*         }
*       }
* */
import config from './config'
export default (url, data={}, method='GET') => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: config.host + url,
      data,
      method,
      header: { // 请求头
        // cookie字段要求必须是字符串类型
        cookie: JSON.parse(wx.getStorageSync('cookies') || "[]").toString()
      },
      success: (res) => {
        // console.log(res);
        /*
        * 需求： video页面获取视频列表需要用户的cookie
        * 获取：
        *   1. 用户登录请求成功后res中获取： res.cookies
        * 思路：
        *   1. 用户登录请求成功以后获取res.cookies保存至本地
        *   2. 之后发送请求从本地读取cookies携带cookie
        *
        *
        * */
        if(data.isLogin){ // 登录请求
          wx.setStorage({
            key: 'cookies',
            data: JSON.stringify(res.cookies)
          })
        }
        resolve(res.data);
      },
      fail: (err) => {
        reject(err);
      }
    })
  })
}
