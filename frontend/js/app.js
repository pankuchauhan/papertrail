const API_URL = 'http://localhost:5000/api';
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

// Toast notification
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = 'toast-msg';
    toast.style.backgroundColor = type === 'success' ? '#28a745' : '#dc3545';
    toast.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'} me-2"></i>${message}`;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// Update navbar based on login
function updateNavbar() {
    const userEmail = localStorage.getItem('userEmail');
    const navUser = document.getElementById('navUser');
    if (!navUser) return;
    
    if (userEmail) {
        navUser.innerHTML = `
            <li class="nav-item"><a class="nav-link" href="pages/wishlist.html"><i class="fas fa-heart"></i> Wishlist <span class="cart-badge" id="wishlistCount">${wishlist.length}</span></a></li>
            <li class="nav-item"><a class="nav-link" href="pages/seller-dashboard.html"><i class="fas fa-store"></i> Sell</a></li>
            <li class="nav-item"><a class="nav-link" href="pages/profile.html"><i class="fas fa-user"></i> Profile</a></li>
            <li class="nav-item"><a class="nav-link" href="#" onclick="logout()"><i class="fas fa-sign-out-alt"></i> Logout</a></li>
        `;
    } else {
        navUser.innerHTML = `
            <li class="nav-item"><a class="nav-link" href="pages/login.html">Login</a></li>
            <li class="nav-item"><a class="nav-link" href="pages/signup.html">Sign Up</a></li>
        `;
    }
    updateWishlistCount();
}

function logout() { localStorage.clear(); window.location.href = 'index.html'; }

// Load books from backend
async function loadBooks() {
    const grid = document.getElementById('booksGrid');
    if (!grid) return;
    
    try {
        const res = await fetch(`${API_URL}/books`);
        const books = await res.json();
        
        if (books.length === 0) {
            grid.innerHTML = '<div class="text-center">No books found. Add some books!</div>';
            return;
        }
        displayBooks(books);
    } catch (error) {
        grid.innerHTML = `<div class="text-center text-danger">Cannot connect to server. Make sure backend is running on port 5000</div>`;
    }
}

function displayBooks(books) {
    const grid = document.getElementById('booksGrid');
    grid.innerHTML = '';
    
    for (const book of books) {
        const imgUrl = book.imageUrl || 'https://covers.openlibrary.org/b/id/8222591-L.jpg';
        const col = document.createElement('div');
        col.className = 'col-md-4 col-lg-3 mb-4';
        col.innerHTML = `
            <div class="card book-card" onclick="window.location.href='pages/book-details.html?id=${book._id}'">
                <img src="${imgUrl}" class="card-img-top" onerror="this.src='https://covers.openlibrary.org/b/id/8222591-L.jpg'">
                <div class="card-body text-center">
                    <h5>${book.title}</h5>
                    <p class="text-muted">${book.author}</p>
                    <p class="price">₹${book.price}</p>
                    <button class="btn-add" onclick="event.stopPropagation(); addToCart('${book._id}', '${book.title}', ${book.price})">🛒 Add to Cart</button>
                </div>
            </div>
        `;
        grid.appendChild(col);
    }
}

// Cart functions
function addToCart(id, title, price) {
    const existing = cart.find(item => item.id === id);
    if (existing) existing.quantity++;
    else cart.push({ id, title, price, quantity: 1 });
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showToast(`${title} added to cart!`);
}

function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    if (cartCount) cartCount.textContent = cart.reduce((s, i) => s + i.quantity, 0);
}

function updateWishlistCount() {
    const wc = document.getElementById('wishlistCount');
    if (wc) wc.textContent = wishlist.length;
}

function searchBooks() {
    const term = document.getElementById('searchInput')?.value.toLowerCase() || '';
    const cards = document.querySelectorAll('#booksGrid .col-md-4');
    cards.forEach(card => {
        const title = card.querySelector('h5')?.innerText.toLowerCase() || '';
        const author = card.querySelector('.text-muted')?.innerText.toLowerCase() || '';
        card.style.display = title.includes(term) || author.includes(term) ? '' : 'none';
    });
}

// Cart page
function loadCartPage() {
    const container = document.getElementById('cartItems');
    if (!container) return;
    
    if (cart.length === 0) {
        container.innerHTML = '<div class="text-center py-5"><h3>Cart is empty</h3><a href="../index.html" class="btn btn-primary">Browse Books</a></div>';
        document.getElementById('cartTotal').innerText = '0';
        return;
    }
    
    let total = 0;
    container.innerHTML = '';
    for (const item of cart) {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        container.innerHTML += `
            <div class="d-flex justify-content-between align-items-center border-bottom py-3">
                <div><h5>${item.title}</h5><p>₹${item.price} x ${item.quantity} = ₹${itemTotal}</p></div>
                <div>
                    <button class="btn btn-sm btn-warning" onclick="updateQty('${item.id}', ${item.quantity - 1})">-</button>
                    <span class="mx-2">${item.quantity}</span>
                    <button class="btn btn-sm btn-warning" onclick="updateQty('${item.id}', ${item.quantity + 1})">+</button>
                    <button class="btn btn-sm btn-danger" onclick="removeItem('${item.id}')">Remove</button>
                </div>
            </div>
        `;
    }
    document.getElementById('cartTotal').innerText = total;
}

function updateQty(id, newQty) {
    if (newQty <= 0) { removeItem(id); return; }
    const item = cart.find(i => i.id === id);
    if (item) { item.quantity = newQty; localStorage.setItem('cart', JSON.stringify(cart)); loadCartPage(); updateCartCount(); }
}

function removeItem(id) {
    cart = cart.filter(item => item.id !== id);
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCartPage();
    updateCartCount();
}

function checkout() { window.location.href = 'checkout.html'; }

// Checkout page
function loadCheckoutPage() {
    const container = document.getElementById('checkoutItems');
    if (!container) return;
    
    if (cart.length === 0) { window.location.href = 'cart.html'; return; }
    
    let total = 0;
    container.innerHTML = '<h6>Order Summary</h6>';
    for (const item of cart) {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        container.innerHTML += `<div class="d-flex justify-content-between py-2"><span>${item.title} x ${item.quantity}</span><span>₹${itemTotal}</span></div>`;
    }
    container.innerHTML += `<hr><div class="d-flex justify-content-between fw-bold"><span>Total:</span><span>₹${total}</span></div>`;
    document.getElementById('checkoutTotal').innerText = total;
}

function proceedToPay() { window.location.href = 'payment.html'; }

// Payment page
function loadPaymentPage() {
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    document.getElementById('paymentTotal').innerText = total;
}

function selectPaymentMethod(method) {
    document.getElementById('selectedMethod').innerText = method.toUpperCase();
    document.getElementById('paymentSection').style.display = 'none';
    document.getElementById('confirmSection').style.display = 'block';
    document.getElementById('finalTotal').innerText = document.getElementById('paymentTotal').innerText;
}

async function completeOrder() {
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const userEmail = localStorage.getItem('userEmail') || 'guest';
    
    try {
        await fetch(`${API_URL}/orders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ items: cart, total, userEmail, paymentMethod: 'cod' })
        });
        localStorage.removeItem('cart');
        cart = [];
        showToast('🎉 Order placed successfully!');
        setTimeout(() => { window.location.href = '../index.html'; }, 1500);
    } catch(error) { showToast('Payment failed!', 'error'); }
}

function goBack() {
    document.getElementById('paymentSection').style.display = 'block';
    document.getElementById('confirmSection').style.display = 'none';
}

// Wishlist
function loadWishlistPage() {
    const container = document.getElementById('wishlistItems');
    if (!container) return;
    
    wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    
    if (wishlist.length === 0) {
        container.innerHTML = '<div class="text-center py-5"><h3>❤️ Wishlist is empty</h3><a href="../index.html" class="btn btn-primary">Browse Books</a></div>';
        return;
    }
    
    container.innerHTML = '';
    for (const book of wishlist) {
        container.innerHTML += `
            <div class="col-md-3 mb-4">
                <div class="card h-100">
                    <img src="${book.image || 'https://via.placeholder.com/200'}" class="card-img-top" style="height: 200px; object-fit: cover;">
                    <div class="card-body text-center">
                        <h6>${book.title}</h6>
                        <p class="text-muted small">${book.author}</p>
                        <p class="text-success fw-bold">₹${book.price}</p>
                        <button class="btn btn-primary btn-sm w-100 mb-1" onclick="window.location.href='book-details.html?id=${book.id}'">View</button>
                        <button class="btn btn-danger btn-sm w-100" onclick="removeFromWishlist('${book.id}')">Remove</button>
                    </div>
                </div>
            </div>
        `;
    }
}

function removeFromWishlist(id) {
    wishlist = wishlist.filter(w => w.id !== id);
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    loadWishlistPage();
    updateWishlistCount();
    showToast('Removed from wishlist');
}

// Auth
async function handleSignup(e) {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    let users = JSON.parse(localStorage.getItem('users')) || [];
    if (users.find(u => u.email === email)) { showToast('Email exists!', 'error'); return; }
    
    users.push({ name, email, password });
    localStorage.setItem('users', JSON.stringify(users));
    showToast('Signup successful! Please login.');
    setTimeout(() => { window.location.href = 'login.html'; }, 1000);
}

async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        localStorage.setItem('userEmail', email);
        localStorage.setItem('userName', user.name);
        showToast(`Welcome back, ${user.name}!`);
        setTimeout(() => { window.location.href = '../index.html'; }, 1000);
    } else { showToast('Invalid credentials!', 'error'); }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    updateNavbar();
    if (document.getElementById('booksGrid')) loadBooks();
    if (document.getElementById('cartItems')) loadCartPage();
    if (document.getElementById('checkoutItems')) loadCheckoutPage();
    if (document.getElementById('paymentTotal')) loadPaymentPage();
    if (document.getElementById('wishlistItems')) loadWishlistPage();
    updateCartCount();
    
    const loginForm = document.getElementById('loginForm');
    if (loginForm) loginForm.addEventListener('submit', handleLogin);
    
    const signupForm = document.getElementById('signupForm');
    if (signupForm) signupForm.addEventListener('submit', handleSignup);
});

window.addToCart = addToCart;
window.updateQty = updateQty;
window.removeItem = removeItem;
window.checkout = checkout;
window.proceedToPay = proceedToPay;
window.completeOrder = completeOrder;
window.searchBooks = searchBooks;
window.logout = logout;
window.removeFromWishlist = removeFromWishlist;
window.selectPaymentMethod = selectPaymentMethod;
window.goBack = goBack;