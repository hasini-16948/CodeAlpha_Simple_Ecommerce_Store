const API_BASE_URL = 'http://localhost:5000/api';

document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('shopzone_token');
    const path = window.location.pathname;

    if (!token && !path.endsWith('login.html')) {
        window.location.href = 'login.html';
        return;
    }

    updateHeader();

    if (path.endsWith('index.html') || path === '/' || path.endsWith('/')) {
        loadProducts();
    } else if (path.endsWith('cart.html')) {
        loadCart();
    } else if (path.endsWith('orders.html')) {
        loadOrders();
    }
});

function updateHeader() {
    const navElement = document.getElementById('navbar-links');
    if (!navElement) return;

    const cart = JSON.parse(localStorage.getItem('shopzone_cart')) || [];
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    navElement.innerHTML = `
        <a href="index.html">Home</a>
        <a href="orders.html">My Orders</a>
        <div class="cart-icon-container" onclick="window.location.href='cart.html'">
            <span>🛒 Cart</span>
            <span class="cart-badge">(${totalCount})</span>
        </div>
        <button class="logout-btn" onclick="handleLogout()">Logout</button>
    `;
}

function handleLogout() {
    localStorage.clear();
    window.location.href = 'login.html';
}

let allProducts = [];

function loadProducts() {
    fetch(`${API_BASE_URL}/products`)
        .then(res => res.json())
        .then(products => {
            allProducts = products;
            renderProducts(products);
        })
        .catch(err => console.error('Error fetching catalog:', err));
}

function renderProducts(products) {
    const grid = document.getElementById('product-grid');
    if (!grid) return;
    grid.innerHTML = '';

    const cart = JSON.parse(localStorage.getItem('shopzone_cart')) || [];

    products.forEach(p => {
        const cartItem = cart.find(item => item.product.id === p._id);
        const quantityInCart = cartItem ? cartItem.quantity : 0;

        let interactionHtml = '';
        if (quantityInCart > 0) {
            interactionHtml = `
                <div class="qty-adjuster">
                    <button onclick="changeQty('${p._id}', -1)">-</button>
                    <span>${quantityInCart}</span>
                    <button onclick="changeQty('${p._id}', 1)">+</button>
                </div>
            `;
        } else {
            interactionHtml = `
                <div class="action-btn-group">
                    <button class="btn-primary-action" onclick="addToCartDirectly('${p._id}')">Add to Cart</button>
                    <button class="btn-secondary" onclick="showFullscreenDetails('${p._id}')">View Details</button>
                </div>
            `;
        }

        grid.innerHTML += `
            <div class="item-card">
                <div class="item-img-wrapper">
                    <img src="${p.image}" alt="${p.name}" style="width:100%; height:100%; object-fit:cover;">
                </div>
                <div class="item-card-title">${p.name}</div>
                <div class="item-card-price">₹${p.price.toLocaleString('en-IN')}</div>
                ${interactionHtml}
            </div>
        `;
    });
}

function addToCartDirectly(id) {
    const product = allProducts.find(p => p._id === id);
    if (!product) return;

    let cart = JSON.parse(localStorage.getItem('shopzone_cart')) || [];
    const itemIndex = cart.findIndex(item => item.product.id === id);

    if (itemIndex > -1) {
        if (cart[itemIndex].quantity >= product.stock) {
            alert(`Only ${product.stock} items left in stock.`);
            return;
        }
        cart[itemIndex].quantity += 1;
    } else {
        if (product.stock < 1) {
            alert("Out of stock.");
            return;
        }
        cart.push({
            product: { id: product._id, name: product.name, price: product.price, image: product.image },
            quantity: 1
        });
    }

    localStorage.setItem('shopzone_cart', JSON.stringify(cart));
    updateHeader();
    
    const detailView = document.getElementById('details-fullscreen-view');
    if (detailView && detailView.style.display === 'block') {
        showFullscreenDetails(id);
    } else {
        renderProducts(allProducts);
    }
}

function changeQty(id, delta) {
    let cart = JSON.parse(localStorage.getItem('shopzone_cart')) || [];
    const itemIndex = cart.findIndex(item => item.product.id === id);
    if (itemIndex === -1) return;

    const product = allProducts.find(p => p._id === id);

    if (delta === 1 && product && cart[itemIndex].quantity >= product.stock) {
        alert(`Only ${product.stock} items left in stock.`);
        return;
    }

    cart[itemIndex].quantity += delta;

    if (cart[itemIndex].quantity <= 0) {
        cart.splice(itemIndex, 1);
    }

    localStorage.setItem('shopzone_cart', JSON.stringify(cart));
    updateHeader();
    
    const detailView = document.getElementById('details-fullscreen-view');
    if (detailView && detailView.style.display === 'block') {
        showFullscreenDetails(id);
    } else {
        const path = window.location.pathname;
        if (path.endsWith('index.html') || path === '/' || path.endsWith('/')) {
            renderProducts(allProducts);
        } else {
            loadCart();
        }
    }
}

function showFullscreenDetails(id) {
    const product = allProducts.find(p => p._id === id);
    if (!product) return;

    document.getElementById('main-catalog-view').style.display = 'none';
    const container = document.getElementById('details-fullscreen-view');
    container.style.display = 'block';

    const cart = JSON.parse(localStorage.getItem('shopzone_cart')) || [];
    const cartItem = cart.find(item => item.product.id === id);
    const quantityInCart = cartItem ? cartItem.quantity : 0;

    let actionButtonHtml = '';
    if (quantityInCart > 0) {
        actionButtonHtml = `
            <div class="qty-adjuster" style="max-width: 220px;">
                <button onclick="changeQty('${product._id}', -1)">-</button>
                <span>In Cart: ${quantityInCart}</span>
                <button onclick="changeQty('${product._id}', 1)">+</button>
            </div>
        `;
    } else {
        actionButtonHtml = `
            <button class="btn-primary-action" style="padding: 12px 30px;" onclick="addToCartDirectly('${product._id}')">Add to Cart</button>
        `;
    }

    container.innerHTML = `
        <div class="back-link" onclick="hideFullscreenDetails()">← Continue Shopping</div>
        <div class="details-layout">
            <div class="details-image-container">
                <img src="${product.image}" alt="${product.name}" style="width:100%; max-height:400px; object-fit:contain;">
            </div>
            <div class="details-content-box">
                <h2>${product.name}</h2>
                <div style="color:var(--txt-muted); margin-bottom: 10px;">Category: ${product.category}</div>
                <div class="details-stock-label">Items in stock: ${product.stock} available</div>
                <hr style="border: 0; border-top: 1px solid var(--border-color); margin-bottom: 15px;">
                <div style="font-weight: bold; margin-bottom: 5px; color: var(--dark-purple-text);">Details:</div>
                <p class="details-desc-text">${product.description}</p>
                <div style="font-size: 24px; font-weight: bold; margin-bottom: 20px; color: var(--primary-purple);">Price: ₹${product.price.toLocaleString('en-IN')}</div>
                ${actionButtonHtml}
            </div>
        </div>
    `;
}

function hideFullscreenDetails() {
    document.getElementById('details-fullscreen-view').style.display = 'none';
    document.getElementById('main-catalog-view').style.display = 'block';
    renderProducts(allProducts);
}

function loadCart() {
    const body = document.getElementById('cart-table-body');
    const grandTotalElement = document.getElementById('grand-total');
    if (!body) return;

    const cart = JSON.parse(localStorage.getItem('shopzone_cart')) || [];
    body.innerHTML = '';

    if (cart.length === 0) {
        body.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:40px; color:var(--txt-muted);">Your cart is empty.</td></tr>`;
        if (grandTotalElement) grandTotalElement.textContent = '₹0';
        return;
    }

    let grandTotal = 0;
    cart.forEach(item => {
        const subtotal = item.product.price * item.quantity;
        grandTotal += subtotal;

        body.innerHTML += `
            <tr>
                <td>
                    <div style="display:flex; align-items:center; gap:15px;">
                        <img src="${item.product.image}" style="width:50px; height:50px; object-fit:cover; background:#f5f4fd; border-radius:6px;">
                        <strong>${item.product.name}</strong>
                    </div>
                </td>
                <td>₹${item.product.price.toLocaleString('en-IN')}</td>
                <td>
                    <div class="qty-adjuster" style="max-width:110px;">
                        <button onclick="changeQty('${item.product.id}', -1)">-</button>
                        <span>${item.quantity}</span>
                        <button onclick="changeQty('${item.product.id}', 1)">+</button>
                    </div>
                </td>
                <td>₹${subtotal.toLocaleString('en-IN')}</td>
                <td><button style="background:none; border:none; cursor:pointer; font-size:16px;" onclick="removeItemCompletely('${item.product.id}')">❌</button></td>
            </tr>
        `;
    });

    if (grandTotalElement) grandTotalElement.textContent = '₹' + grandTotal.toLocaleString('en-IN');
}

function removeItemCompletely(id) {
    let cart = JSON.parse(localStorage.getItem('shopzone_cart')) || [];
    cart = cart.filter(item => item.product.id !== id);
    localStorage.setItem('shopzone_cart', JSON.stringify(cart));
    updateHeader();
    loadCart();
}

function processCheckout(event) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }

    const token = localStorage.getItem('shopzone_token');
    const cart = JSON.parse(localStorage.getItem('shopzone_cart')) || [];

    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    const total = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

    fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ items: cart, total })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            localStorage.removeItem('shopzone_cart');
            
            // SYSTEM INJECTION SAFETY: Freezes layout state so no transitions hide text
            alert("🎉 ShopZone - Order Placed Successfully!\n\nYour transaction went through beautifully. Thank you for choosing us!");
            
            window.location.href = 'orders.html';
        } else {
            alert(data.message);
        }
    })
    .catch(err => console.error('Checkout failure:', err));
}

function showCelebrationModal() {
    // Left empty since we are tracking native alerts now to stop flash-reload loops
}

function dismissCelebration() {
    window.location.href = 'orders.html';
}

function loadOrders() {
    const list = document.getElementById('orders-display-area');
    const token = localStorage.getItem('shopzone_token');
    if (!list) return;

    fetch(`${API_BASE_URL}/orders`, {
        headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(orders => {
        list.innerHTML = '';
        if (orders.length === 0) {
            list.innerHTML = `<p style="color:var(--txt-muted); text-align:center; padding:30px;">No placed orders recorded yet.</p>`;
            return;
        }

        orders.forEach(order => {
            const dateStr = new Date(order.date).toLocaleDateString('en-IN');
            let itemsBlock = '';
            
            order.items.forEach(i => {
                itemsBlock += `<div style="display:flex; justify-content:space-between; margin-bottom:8px; font-size:14px;">
                    <span>• ${i.product.name} (x${i.quantity})</span>
                    <span>₹${(i.product.price * i.quantity).toLocaleString('en-IN')}</span>
                </div>`;
            });

            list.innerHTML += `
                <div style="background:white; border-radius:12px; padding:20px; margin-bottom:20px; border:1px solid var(--border-color); box-shadow: 0 4px 12px rgba(0,0,0,0.01);">
                    <div style="display:flex; justify-content:space-between; margin-bottom:12px; border-bottom:1px solid var(--border-color); padding-bottom:8px; font-size:13px; color:var(--txt-muted);">
                        <span>Order Reference ID: ${order._id}</span>
                        <span>Date: ${dateStr}</span>
                    </div>
                    <div>${itemsBlock}</div>
                    <div style="text-align:right; font-weight:bold; color:var(--primary-purple); margin-top:10px; font-size:16px;">Paid Total: ₹${order.total.toLocaleString('en-IN')}</div>
                </div>
            `;
        });
    });
}