const API_PRODUCTS = "products";
const API_USERS = "users";
const API_CART = "cart";

// Init sample data
if(!localStorage.getItem(API_PRODUCTS)){
    localStorage.setItem(API_PRODUCTS, JSON.stringify([
        {id:1, name:"Laptop", price:55000, desc:"Gaming Laptop 16GB RAM", img:"https://via.placeholder.com/200"},
        {id:2, name:"Mobile", price:25000, desc:"5G Smartphone 128GB", img:"https://via.placeholder.com/200"},
        {id:3, name:"Headphones", price:3000, desc:"Noise Cancelling", img:"https://via.placeholder.com/200"}
    ]))
}
if(!localStorage.getItem(API_USERS)){
    localStorage.setItem(API_USERS, JSON.stringify([{name:"Admin", email:"admin@test.com", password:"123", role:"Admin"}]))
}

function getUser(){ return JSON.parse(localStorage.getItem("currentUser")); }
function checkLogin(){ if(!getUser()) window.location.href = "login.html"; }

// Register + Login
function register(){
    const users = JSON.parse(localStorage.getItem(API_USERS));
    const newUser = {
        name: document.getElementById("reg_name").value,
        email: document.getElementById("reg_email").value,
        password: document.getElementById("reg_password").value,
        role: document.getElementById("reg_role").value
    };
    if(users.find(u => u.email === newUser.email)) return alert("Email already exists");
    users.push(newUser);
    localStorage.setItem(API_USERS, JSON.stringify(users));
    alert("Registered Successfully");
    window.location.href = "login.html";
}

function login(){
    const users = JSON.parse(localStorage.getItem(API_USERS));
    const user = users.find(u => u.email === document.getElementById("login_email").value && u.password === document.getElementById("login_password").value);
    if(user){
        localStorage.setItem("currentUser", JSON.stringify(user));
        window.location.href = user.role === "Admin" ? "admin.html" : "products.html";
    } else alert("Invalid Credentials");
}

function logout(){ localStorage.removeItem("currentUser"); window.location.href = "login.html"; }

// Products
function loadProducts(){
    const products = JSON.parse(localStorage.getItem(API_PRODUCTS));
    document.getElementById("productGrid").innerHTML = products.map(p => `
        <div class="card">
            <img src="${p.img}">
            <h3>${p.name}</h3>
            <p>${p.desc}</p>
            <b>₹${p.price}</b><br>
            <button class="btn" onclick="addToCart(${p.id})">Add to Cart</button>
        </div>
    `).join("");
}

// Cart
function addToCart(id){
    let cart = JSON.parse(localStorage.getItem(API_CART)) || [];
    const product = JSON.parse(localStorage.getItem(API_PRODUCTS)).find(p => p.id === id);
    cart.push(product);
    localStorage.setItem(API_CART, JSON.stringify(cart));
    alert("Added to Cart");
}

function loadCart(){
    const cart = JSON.parse(localStorage.getItem(API_CART)) || [];
    let total = 0;
    document.getElementById("cartItems").innerHTML = cart.map((p,i) => {
        total += p.price;
        return `<tr><td>${p.name}</td><td>₹${p.price}</td><td><button class="btn btn-danger" onclick="removeCart(${i})">Remove</button></td></tr>`
    }).join("");
    document.getElementById("total").innerText = "Total: ₹" + total;
}

function removeCart(i){
    let cart = JSON.parse(localStorage.getItem(API_CART));
    cart.splice(i,1);
    localStorage.setItem(API_CART, JSON.stringify(cart));
    loadCart();
}

// Checkout
function placeOrder(){
    const cart = JSON.parse(localStorage.getItem(API_CART)) || [];
    if(cart.length === 0) return alert("Cart is empty");
    alert("Order Placed Successfully!");
    localStorage.removeItem(API_CART);
    window.location.href = "products.html";
}

// Admin
function loadAdminProducts(){
    const products = JSON.parse(localStorage.getItem(API_PRODUCTS));
    document.getElementById("adminProducts").innerHTML = products.map(p => `
        <tr><td>${p.name}</td><td>₹${p.price}</td><td><button class="btn btn-danger" onclick="deleteProduct(${p.id})">Delete</button></td></tr>
    `).join("");
}

function addProduct(){
    const products = JSON.parse(localStorage.getItem(API_PRODUCTS));
    const newP = {
        id: Date.now(),
        name: document.getElementById("p_name").value,
        price: Number(document.getElementById("p_price").value),
        desc: document.getElementById("p_desc").value,
        img: "https://via.placeholder.com/200"
    };
    products.push(newP);
    localStorage.setItem(API_PRODUCTS, JSON.stringify(products));
    alert("Product Added");
    loadAdminProducts();
}

function deleteProduct(id){
    let products = JSON.parse(localStorage.getItem(API_PRODUCTS));
    products = products.filter(p => p.id !== id);
    localStorage.setItem(API_PRODUCTS, JSON.stringify(products));
    loadAdminProducts();
                             }
