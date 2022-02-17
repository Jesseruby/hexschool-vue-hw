// 作業步驟拆解：
// --- w5 ---------------------------------------------------------------------
// 1. 建立購物車用的API
// 2. 第4周改HTML版型
// 3. 加入購物車
// 4. 局部讀取效果：loading 套件
// 5. 表單驗證：VeeValidate 套件

import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.0.9/vue.esm-browser.js';

const apiUrl = 'https://vue3-course-api.hexschool.io/v2';//作業用API
const apiPath = 'jesse-food-3';//購物車用的API

//--- 在外層定義modal，可以給其他地方使用 ---
let productModal = null;

const app = createApp({
  data() {
    return {
      //--- 產品列表 ---
      products:[],
      tempProduct: {},//查看更多
      //--- 購物車---
      cart: {},
      isLoading: '',//局部讀取效果
      qty: 1,//modal加入數量，預設值=1
      //--- 表單驗證 ---
      form: {
        user: {
          name: '',
          email: '',
          tel: '',
          address: '',
        },
        message: '',
      },
    }//.return
  },//.data
  methods:{
    //--------------- 產品列表 ------------------------------------------
    //--- 登入：驗證 ---
    checkLogin() {
      //取出 Token
      const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
      //給全部axios共用的headers
      axios.defaults.headers.common.Authorization = token;
      axios.post(`${apiUrl}/api/user/check`)
        .then(() => {
          this.getData();
        })//.then
        .catch((error) => {
          console.dir(error);
          alert(error.data.message);//顯示錯誤訊息
          window.location = 'index.html';//失敗轉回登入畫面
        })//.catch
    },//.checkLogin
    //--- 取得：產品列表 ---
    getData() {
      axios.get(`${apiUrl}/api/${apiPath}/admin/products/`)
        .then((response) => {
          this.products = response.data.products;//載入資料：產品列表
        })//.then
        .catch((error) => {
          alert(error.data.message);//顯示錯誤訊息
        })//.catch
    },//.getData
    //--- 打開：modal ---
    openModal(item) {
      //查看更多：抓出指定的產品內容
      this.tempProduct = JSON.parse(JSON.stringify(item));
      this.isModal = false;
      productModal.show();
    },//.openModal

    //--------------- 加入購物車 ------------------------------------------
    //--- 購物車：取得資料 ---
    getCart() {
      axios.get(`${apiUrl}/api/${apiPath}/cart`)
        .then((response) => {
          this.cart = response.data.data;//載入資料：購物車
        })//.then
        .catch((error) => {
          alert(error.data.message);//顯示錯誤訊息
        })//.catch
    },//.getCart
    //--- 購物車：加入 ---
    addCart(id, qty = 1) {
      const data = {
        product_id: id,
        qty,
      };
      this.isLoading = id;//局部讀取效果
      axios.post(`${apiUrl}/api/${apiPath}/cart`, { data })
        .then(() => {
          this.getCart();//執行：取得購物車
          this.isLoading = '';//加入完後要清空
          productModal.hide();//關閉購物車modal
        })//.then
        .catch((error) => {
          alert(error.data.message);//顯示錯誤訊息
        })//.catch
    },//.addCart
    //--- 購物車：刪除特定選項 ---
    removeCart(id) {
      this.isLoading = id;//局部讀取效果
      axios.delete(`${apiUrl}/api/${apiPath}/cart/${id}`)
        .then(() => {
          this.getCart();//執行：取得購物車
          this.isLoading = '';//加入完後要清空
        })//.then
        .catch((error) => {
          alert(error.data.message);//顯示錯誤訊息
        })//.catch
    },//.removeCart
    //--- 購物車：更新數量 ---
    updateCart(item) {
      const data = {
        product_id: item.id,
        qty: item.qty,
      };
      this.isLoading = item.id;//局部讀取效果
      axios.put(`${apiUrl}/api/${apiPath}/cart/${item.id}`, { data })
        .then(() => {
          this.getCart();//執行：取得購物車
          this.isLoading = '';//加入完後要清空
        })//.then
        .catch((error) => {
          alert(error.data.message);//顯示錯誤訊息
        })//.catch
    },//.removeCart

    //--- 購物車：刪除全部 ---
    deleteCarts() {
      axios.delete(`${apiUrl}/api/${apiPath}/carts`).then((response) => {
        alert(response.data.message);
        this.getCart();//執行：取得購物車
        this.isLoading = '';//加入完後要清空
      }).catch((err) => {
        alert(err.data.message);//顯示錯誤訊息
      });
    },//.deleteCarts

    //--------------- 購物車 表單 ------------------------------------------
    submitCart() {
      console.log(this.form.user.email);
      //--- 表單：驗證 ---
      if( this.form.user.email ==='' ||
          this.form.user.name ==='' ||
          this.form.user.tel ==='' ||
          this.form.user.address ===''){
          alert('必填 有缺！');
          return;
      };
      //--- 表單：送出 ---
      axios.post(`${apiUrl}/api/${apiPath}/order`, { data: this.form })
      .then((response) => {
        alert(response.data.message);
        //this.$refs.form.resetForm();//範例的程式碼，不知道做什麼用的？
        //this.getCart();//執行：取得購物車
        //this.isLoading = '';//加入完後要清空
      })//.then
      .catch((err) => {
        alert(err.data.message);
      });//.catch
    },//.submitCart
 
  },//.methods
  mounted() {
    //this.checkLogin();//初始畫面：加驗證取得產品資料
    //this.getCart();
    // 載入 modal
    productModal = new bootstrap.Modal(document.getElementById('productModal'), {
      keyboard: false,//只是設定鍵盤是否能使用，可以刪除
    });
  },//.mounted
});//.app


app.mount('#product');
