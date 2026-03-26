// Shopping Cart Functionality
let cart = JSON.parse(localStorage.getItem('afrooticCart')) || [];

function addToCart(id, name, price, image) {
    const existingItem = cart.find(item => item.id === id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: id,
            name: name,
            price: parseInt(price),
            image: image,
            quantity: 1
        });
    }
    
    saveCart();
    updateCartCount();
    showNotification(name);
}

function saveCart() {
    localStorage.setItem('afrooticCart', JSON.stringify(cart));
}

function updateCartCount() {
    const countElement = document.getElementById('cart-count');
    if (countElement) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        countElement.textContent = totalItems;
    }
}

function showNotification(productName) {
    const existing = document.querySelector('.cart-notification');
    if (existing) existing.remove();
    
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.innerHTML = '✓ ' + productName + ' added to cart!';
    document.body.appendChild(notification);
    
    setTimeout(function() {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(function() {
        notification.classList.remove('show');
        setTimeout(function() {
            notification.remove();
        }, 300);
    }, 2000);
}

document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
    
    const buttons = document.querySelectorAll('.add-to-cart-btn');
    buttons.forEach(function(button) {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const id = this.getAttribute('data-id');
            const name = this.getAttribute('data-name');
            const price = this.getAttribute('data-price');
            const image = this.getAttribute('data-image');
            
            if (id && name && price) {
                addToCart(id, name, price, image);
            }
        });
    });
});
