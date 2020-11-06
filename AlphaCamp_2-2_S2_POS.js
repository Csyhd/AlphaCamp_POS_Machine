// 3.變數宣告
const menu = document.getElementById('menu')
const cart = document.getElementById('cart')
const totalAmount = document.getElementById('total-amount')
const button = document.getElementById('submit-button')
const resetButton = document.getElementById('reset-button')
let total = 0
let productData = []
let cartItems = []
// [
//   {
//     id: 'product-1',
//     name: '馬卡龍',
//     price: 60,
//     quantity: 1
//   },
//   {
//     id: 'product-2',
//     name: '草莓',
//     price: 100,
//     quantity: 2
//   }, 
// ]

// 4.GET API 菜單產品資料
axios.get('https://ac-w3-dom-pos.firebaseio.com/products.json')
  .then(function (res) {
    productData = res.data
    displayProducts(productData)
  })
  .catch(function (err) {
    console.log(err)
  })

// 5.將產品資料加入菜單區塊
// function displayProducts(products) {
//   products.forEach(product => {
//     menu.innerHTML += `
//       <div class="col-3">
//         <div class="card" >
//           <img src=${product.imgUrl} class="card-img-top" alt="...">
//           <div class="card-body">
//             <h5 class="card-title">${product.name}</h5>
//             <p class="card-text">${product.price}</p>
//             <a id=${product.id} href="javascript:;" class="btn btn-primary">加入購物車</a>
//           </div>
//         </div>
//       </div>
//     `
//   })
// }

function displayProducts(products) {
  products.forEach(product => {
    menu.innerHTML += `
      <div class="col-3">
        <div id="${product.id}" class="card">
          <img src=${product.imgUrl} class="card-img-top" alt="...">
          <div class="card-body">
            <h5 class="card-title">${product.name}</h5>
            <p class="card-text">${product.price}</p>
            <a href="javascript:;" class="btn btn-primary">加入購物車</a>
          </div>
        </div>
      </div>`
  })
}

// 6.加入購物車
function addToCart(event) {
  // 找到觸發event的node元素，並用closest找到最近的className為card的Element取得ID
  const id = event.target.closest('.card').id
  // 在productData的資料裡，找到點擊的產品資訊 name, price
  const addedProduct = productData.find(product => product.id === id)
  const name = addedProduct.name
  const price = addedProduct.price

  // 加入購物車變數cartItems 分：有按過、沒按過
  const targetCartItem = cartItems.find(item => item.id === id)
  // 有按過 換數量的值
  if (targetCartItem) {
    targetCartItem.quantity += 1
  } else {
    // 沒按過 加入新資料
    cartItems.push({
      id, // id: id
      name, // name: name
      price, // price: price
      quantity: 1
    })
  }
  randerHTML()
  calculateTotal(price, 'add')
}

// 畫面顯示購物車清單
function randerHTML() {
  cart.innerHTML = cartItems.map((item) => {
    if (item.quantity > 0) {
      return `<div id="${item.id}" class="cart-name row mb-2">
    <li class="list-group-item col-6">${item.name} X ${item.quantity} 小計：${item.price * item.quantity}</li>
    <a href="javascript:;" id="add-cart" class="btn btn-primary col-2 ml-1">+</a>
    <a href="javascript:;" id="remove-cart" class="btn btn-primary col-2 ml-1">-</a>
  </div>`
    }
  }).join('')
}

// 7.判斷並且計算總金額
function calculateTotal(amount, priceStatus) {
  if (priceStatus === 'add') {
    total += amount
  } else {
    total -= amount
  }
  totalAmount.textContent = total
}

// 8.送出訂單
function submit() {
  cartContent = cartItems.map(item => `
    ${item.name} X ${item.quantity} 小計：${item.price * item.quantity}`).join('')
  console.log(cartContent)
  alert(`訂單內容:${cartContent}
訂單總金額為: ${total}  訂單完成！！ `)
}

// 9.重置資料
function reset(event) {
  cartItems = []
  randerHTML()
  total = 0
  totalAmount.textContent = total
}

//10.調整購物車數量
function cartAmount(event) {
  let priceStatus = ''
  console.log(event.target.id)
  const id = event.target.closest('.cart-name').id
  const targetCartItem = cartItems.find(item => item.id === id)
  if (event.target.id === 'add-cart') {
    targetCartItem.quantity += 1
    priceStatus = 'add'
    randerHTML()
    calculateTotal(targetCartItem.price, priceStatus)
  } else if (event.target.id === 'remove-cart') {
    targetCartItem.quantity -= 1
    priceStatus = 'remove'
    randerHTML()
    calculateTotal(targetCartItem.price, priceStatus)
  }
}

// 10. 加入事件監聽
menu.addEventListener('click', addToCart)
button.addEventListener('click', submit)
cart.addEventListener('click', cartAmount)
resetButton.addEventListener('click', reset)

