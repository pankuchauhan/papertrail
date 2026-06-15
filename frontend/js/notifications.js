// PaperTrail Toast Notification System
class PaperTrailToast {
    constructor() {
        this.container = null;
        this.createContainer();
    }

    createContainer() {
        const existingContainer = document.getElementById('toast-container');
        if (existingContainer) existingContainer.remove();
        
        this.container = document.createElement('div');
        this.container.id = 'toast-container';
        this.container.style.cssText = `position:fixed;top:20px;right:20px;z-index:10000;display:flex;flex-direction:column;gap:12px;`;
        document.body.appendChild(this.container);
    }

    show(options) {
        const { type, title, message, duration = 3000 } = options;
        const toast = document.createElement('div');
        toast.className = 'toast-notification';
        
        let iconClass = 'info', iconHtml = '<i class="fas fa-info-circle"></i>';
        switch(type) {
            case 'success': iconClass = 'success'; iconHtml = '<i class="fas fa-check-circle"></i>'; break;
            case 'error': iconClass = 'error'; iconHtml = '<i class="fas fa-times-circle"></i>'; break;
            case 'warning': iconClass = 'warning'; iconHtml = '<i class="fas fa-exclamation-triangle"></i>'; break;
            case 'cart': iconClass = 'cart'; iconHtml = '<i class="fas fa-shopping-cart"></i>'; break;
            case 'wishlist': iconClass = 'wishlist'; iconHtml = '<i class="fas fa-heart"></i>'; break;
            case 'payment': iconClass = 'payment'; iconHtml = '<i class="fas fa-credit-card"></i>'; break;
            default: iconClass = 'info'; iconHtml = '<i class="fas fa-info-circle"></i>';
        }
        
        toast.innerHTML = `<div class="toast-content"><div class="toast-icon ${iconClass}">${iconHtml}</div><div class="toast-message"><h4>${title}</h4><p>${message}</p></div></div><div class="toast-progress"><div class="toast-progress-bar"></div></div>`;
        this.container.appendChild(toast);
        
        setTimeout(() => { toast.classList.add('fade-out'); setTimeout(() => toast.remove(), 400); }, duration);
        return toast;
    }

    success(title, message, duration = 3000) { return this.show({ type: 'success', title, message, duration }); }
    error(title, message, duration = 3000) { return this.show({ type: 'error', title, message, duration }); }
    info(title, message, duration = 3000) { return this.show({ type: 'info', title, message, duration }); }
    warning(title, message, duration = 3000) { return this.show({ type: 'warning', title, message, duration }); }
    cart(title, message, duration = 2000) { return this.show({ type: 'cart', title, message, duration }); }
    wishlist(title, message, duration = 2000) { return this.show({ type: 'wishlist', title, message, duration }); }
    payment(title, message, duration = 3000) { return this.show({ type: 'payment', title, message, duration }); }
}

window.paperToast = new PaperTrailToast();

function showCartNotification(bookTitle, quantity = 1) { window.paperToast.cart('Added to Cart', `${quantity} × ${bookTitle} added to your cart`); }
function showWishlistNotification(bookTitle, action = 'added') { window.paperToast.wishlist(action === 'added' ? 'Added to Wishlist' : 'Removed from Wishlist', `${bookTitle} has been ${action === 'added' ? 'saved to' : 'removed from'} your wishlist`); }
function showLoginNotification(userName) { window.paperToast.success('Welcome Back!', `Hello ${userName}, you have successfully logged in`); }
function showSignupNotification(userName) { window.paperToast.success('Account Created!', `Welcome ${userName}! Please login to continue`); }
function showLogoutNotification() { window.paperToast.info('Logged Out', 'You have been successfully logged out'); }
function showPaymentNotification(amount, orderId) { window.paperToast.payment('Payment Successful', `₹${amount} paid successfully. Order ID: ${orderId}`); }
function showErrorNotification(message) { window.paperToast.error('Error', message); }
function showSuccessNotification(title, message) { window.paperToast.success(title, message); }
        
        // Create new container
        this.container = document.createElement('div');
        this.container.id = 'toast-container';
        this.container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            display: flex;
            flex-direction: column;
            gap: 12px;
        `;
        document.body.appendChild(this.container);
    }

    show(options) {
        const { type, title, message, duration = 3000 } = options;
        
        // Create toast element
        const toast = document.createElement('div');
        toast.className = 'toast-notification';
        
        // Set icon based on type
        let iconClass = 'info';
        let iconHtml = '<i class="fas fa-info-circle"></i>';
        
        switch(type) {
            case 'success':
                iconClass = 'success';
                iconHtml = '<i class="fas fa-check-circle"></i>';
                break;
            case 'error':
                iconClass = 'error';
                iconHtml = '<i class="fas fa-times-circle"></i>';
                break;
            case 'warning':
                iconClass = 'warning';
                iconHtml = '<i class="fas fa-exclamation-triangle"></i>';
                break;
            case 'cart':
                iconClass = 'cart';
                iconHtml = '<i class="fas fa-shopping-cart"></i>';
                break;
            case 'wishlist':
                iconClass = 'wishlist';
                iconHtml = '<i class="fas fa-heart"></i>';
                break;
            case 'payment':
                iconClass = 'payment';
                iconHtml = '<i class="fas fa-credit-card"></i>';
                break;
            case 'login':
                iconClass = 'success';
                iconHtml = '<i class="fas fa-sign-in-alt"></i>';
                break;
            case 'logout':
                iconClass = 'info';
                iconHtml = '<i class="fas fa-sign-out-alt"></i>';
                break;
            default:
                iconClass = 'info';
                iconHtml = '<i class="fas fa-info-circle"></i>';
        }
        
        toast.innerHTML = `
            <div class="toast-content">
                <div class="toast-icon ${iconClass}">
                    ${iconHtml}
                </div>
                <div class="toast-message">
                    <h4>${title}</h4>
                    <p>${message}</p>
                </div>
            </div>
            <div class="toast-progress">
                <div class="toast-progress-bar"></div>
            </div>
        `;
        
        this.container.appendChild(toast);
        
        // Auto remove after duration
        setTimeout(() => {
            toast.classList.add('fade-out');
            setTimeout(() => {
                toast.remove();
            }, 400);
        }, duration);
        
        return toast;
    }

    success(title, message, duration = 3000) {
        return this.show({ type: 'success', title, message, duration });
    }

    error(title, message, duration = 3000) {
        return this.show({ type: 'error', title, message, duration });
    }

    info(title, message, duration = 3000) {
        return this.show({ type: 'info', title, message, duration });
    }

    warning(title, message, duration = 3000) {
        return this.show({ type: 'warning', title, message, duration });
    }

    cart(title, message, duration = 2000) {
        return this.show({ type: 'cart', title, message, duration });
    }

    wishlist(title, message, duration = 2000) {
        return this.show({ type: 'wishlist', title, message, duration });
    }

    payment(title, message, duration = 3000) {
        return this.show({ type: 'payment', title, message, duration });
    }
}

// Create global toast instance
window.paperToast = new PaperTrailToast();

// ============ HELPER FUNCTIONS ============

// Show cart notification
function showCartNotification(bookTitle, quantity = 1) {
    window.paperToast.cart('Added to Cart', `${quantity} × ${bookTitle} added to your cart`);
    updateCartBadgeAnimation();
}

// Show wishlist notification
function showWishlistNotification(bookTitle, action = 'added') {
    if (action === 'added') {
        window.paperToast.wishlist('Added to Wishlist', `${bookTitle} has been saved to your wishlist`);
    } else {
        window.paperToast.wishlist('Removed from Wishlist', `${bookTitle} has been removed from your wishlist`);
    }
}

// Show login notification
function showLoginNotification(userName) {
    window.paperToast.success('Welcome Back!', `Hello ${userName}, you have successfully logged in`);
}

// Show signup notification
function showSignupNotification(userName) {
    window.paperToast.success('Account Created!', `Welcome ${userName}! Please login to continue`);
}

// Show logout notification
function showLogoutNotification() {
    window.paperToast.info('Logged Out', 'You have been successfully logged out');
}

// Show payment notification
function showPaymentNotification(amount, orderId) {
    window.paperToast.payment('Payment Successful', `₹${amount} paid successfully. Order ID: ${orderId}`);
}

// Show order placed notification
function showOrderPlacedNotification(orderId) {
    window.paperToast.success('Order Placed!', `Your order #${orderId} has been placed successfully`);
}

// Show error notification
function showErrorNotification(message) {
    window.paperToast.error('Error', message);
}

// Show success notification
function showSuccessNotification(title, message) {
    window.paperToast.success(title, message);
}

// Animate cart badge
function updateCartBadgeAnimation() {
    const cartBadge = document.getElementById('cartCount');
    if (cartBadge) {
        cartBadge.classList.add('cart-badge-update');
        setTimeout(() => {
            cartBadge.classList.remove('cart-badge-update');
        }, 300);
    }
}

// Animate wishlist badge
function updateWishlistBadgeAnimation() {
    const wishlistBadge = document.getElementById('wishlistCount');
    if (wishlistBadge) {
        wishlistBadge.classList.add('cart-badge-update');
        setTimeout(() => {
            wishlistBadge.classList.remove('cart-badge-update');
        }, 300);
    }
}