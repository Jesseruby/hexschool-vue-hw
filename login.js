import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.0.9/vue.esm-browser.js';

createApp({
  data() {
    return {
      user: {
        username:'',
          password:'',
      },//.user
    }//.return
  },//.data
  methods:{
    login(){
      const url = 'https://vue3-course-api.hexschool.io/v2/'; // 請加入站點
      const path = 'jesse-hexschool'; // 請加入個人 API Path
      const api = 'https://vue3-course-api.hexschool.io/v2/admin/signin';
      axios.post(api, this.user)
        .then((response)=>{
          const { token, expired } = response.data;// 驗證後把端傳來的token
          // 寫入cookie token
          // expires 設置到期日 ( 用new Date()轉型成JS用 )
          document.cookie = `hexToken=${token};expire=${new Date(expired)};`; // 把token存到Cookie
          window.location = 'products.html';// 轉址到後台的產品頁面
        }).catch((error)=>{
          console.dir(error);
          alert(error.data.message);//顯示錯誤訊息
        });//.catch
    }//.login
  }//.methods
}).mount('#login');