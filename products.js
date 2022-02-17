// 作業步驟拆解：
// --- w3 ---
// 1. 建立Vue環境
// 2. 載入切好的版型
// 3. 登入驗證
// 4. 取得列表 products
// 5. 展開 modal 
// 6. 先做新增
// 7. 編輯 + 多圖上傳
// 8. 最後做刪除

// --- w4 ---
// 9. 分頁元件：先在data內定義pagination
// 10. 建立 modal 新增元件
// 12. 刪除元件

// cookie sameSime 同源政策：後端的cookie是不能傳到前端的


import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.0.9/vue.esm-browser.js';

//匯入 pagination 元件
import pagination from './pagination.js';

const apiUrl = 'https://vue3-course-api.hexschool.io/v2';//作業用API
const apiPath = 'jesse-food-3';//作業用個人路徑

//在外層定義modal，可以給其他地方使用
let productModal = null;
let delProductModal = null;

const app = createApp({
  //區域註冊 可多個 => vue的物件屬性components
  components:{
    pagination
  },
  data() {
    return {
      products:[],
      tempProduct: {
        imagesUrl: [],
      },
      isNew: false,//是否為新增
      pagination:{},
    }//.return
  },//.data
  methods:{
    // 登出功能---怪怪的，按鈕點擊不會觸發？
    logout(){
      alert('logout');
      const logout = 'https://vue3-course-api.hexschool.io/v2/logout';
      axios.post(logout)
        .then((response)=>{
          //登出需要使用這支 API 發出 POST 請求，在 .then 的時候將頁面轉址回 登入頁面
          alert(response.data.message);
          window.location = 'index.html';
        }).catch((error)=>{
          console.dir(error);
          alert(error.data.message);//顯示錯誤訊息
        });//.catch
    },//.logout
    //3. 登入驗證
    checkLogin() {
      //取出 Token
      const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
      //給全部axios共用的headers
      axios.defaults.headers.common.Authorization = token;
      const url = `${apiUrl}/api/user/check`;
      axios.post(url)
        .then(() => {
          this.getData();
        })//.then
        .catch((error) => {
          console.dir(error);
          alert(error.data.message);//顯示錯誤訊息
          window.location = 'index.html';//失敗轉回登入畫面
        })//.catch
    },//.checkLogin
    //4. 取得產品列表  //9. 新增參數預設值1 =>無參數時會預設帶入1
    getData(page = 1) {
      //9. 參數querym用問號去帶參數 ?page=${page}
      const url = `${apiUrl}/api/${apiPath}/admin/products/?page=${page}`;
      axios.get(url)
        .then((response) => {
          this.products = response.data.products;//取出產品列表
          this.pagination = response.data.pagination;//取出分頁資料
        })//.then
        .catch((error) => {
          console.dir(error);
          alert(error.data.message);//顯示錯誤訊息
        })//.catch
    },//.getData
    // 5. 打開 modal
    openModal(isNew, item) {
      //新增
      if (isNew === 'new') {
        //清空資料
        this.tempProduct = {
          imagesUrl: [],
        };
        this.isNew = true;
        productModal.show();
      //編輯
      } else if (isNew === 'edit') {
        //將item的淺拷貝改成深拷貝來避免多圖新增、修改、刪除會有傳參考問題
        this.tempProduct = JSON.parse(JSON.stringify(item));
        //多圖不是必填，若是沒有多圖，預先加上一個空陣列，給之後編輯時使用
        //this.tempProduct.imagesUrl 為 undefined
        if( ! this.tempProduct.imagesUrl) {
          this.tempProduct.imagesUrl = []
        };
        this.isNew = false;
        productModal.show();
      // 刪除
      } else if (isNew === 'delete') {
        this.tempProduct = { ...item };
        delProductModal.show()
      }
    },//.openModal
    //modal 產品：新增 + 編輯
    updateProduct() {  
      let url = `${apiUrl}/api/${apiPath}/admin/product`;
      let http = 'post';
      //如果不是新增
      if (!this.isNew) {
        url = `${apiUrl}/api/${apiPath}/admin/product/${this.tempProduct.id}`;
        http = 'put'
      }
      axios[http](url, { data: this.tempProduct })
      .then((response) => {
        console.log(response);
        alert(response.data.message);
        productModal.hide();
        this.getData();
      }).catch((error) => {
        console.dir(error);
        alert(error.data.message);//顯示錯誤訊息
      })
    },//.updateProduct
    //modal 產品：刪除
    removeProduct() {
      const url = `${apiUrl}/api/${apiPath}/admin/product/${this.tempProduct.id}`;
      axios.delete(url)
      .then((response) => {
        alert(response.data.message);
        delProductModal.hide();
        this.getData();
      }).catch((error) => {
        console.dir(error);
        alert(error.data.message);//顯示錯誤訊息
      })
    },//.removeProduct
  },//.methods
  mounted() {
    // 3. 執行 登入驗證
    this.checkLogin();
    // 5. 載入 modal
    productModal = new bootstrap.Modal(document.getElementById('productModal'), {
      keyboard: false,//只是設定鍵盤是否能使用，可以刪除
    });
    delProductModal = new bootstrap.Modal(document.getElementById('delProductModal'));

    // modal 的操作方式
    // productModal.show();
    // setTimeout(()=>{
    //   productModal.hide();
    // },3000)

  },//.mounted
});//.app

//全域註冊：一次是一個，而且是一個方法，必須在 createApp之後 & mount之前
//10. 建立 modal 全域元件
app.component('productModal',{
  props:['tempProduct'],//把外層的tempProduct傳進來，同名參數tempProduct
  template:'#templateForProductModa',
  methods:{
    //複製外層app的直接貼過來
    updateProduct() {  
      let url = `${apiUrl}/api/${apiPath}/admin/product`;
      let http = 'post';
      //如果不是新增
      if (!this.isNew) {
        url = `${apiUrl}/api/${apiPath}/admin/product/${this.tempProduct.id}`;
        http = 'put'
      }
      axios[http](url, { data: this.tempProduct })
      .then((response) => {
        console.log(response);
        alert(response.data.message);
        productModal.hide();
        //this.getData(); //沒有getData不能直接更新產品資料 (這是外層的方法)

        //改用$emit來觸發事件給外層，這裡不用帶入參數
        this.$emit('get-data');


      }).catch((error) => {
        console.dir(error);
        alert(error.data.message);//顯示錯誤訊息
      })
    },//.updateProduct
  },
})


app.mount('#product');