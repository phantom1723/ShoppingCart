class AddProduct {
    addProduct() {
        let i = 0;
        for (let i = 0; i < information.products.length; i++) {
            let products = document.querySelector('.products');

            let li = document.createElement("li");
            li.className = "product";
            products.appendChild(li);

            let h2 = document.createElement("h2");
            h2.innerHTML = information.products[i].title;
            li.appendChild(h2);

            let about = document.createElement("p");
            about.className = "about";
            about.innerHTML = information.products[i].body_html;
            li.appendChild(about);

            let price = document.createElement("p");
            price.className = "price";
            price.innerHTML = information.products[i].variants[0].price;
            li.appendChild(price);

            let image = document.createElement("img");
            image.className = "product-image";
            image.src = information.products[i].images[0].src || "http://placehold.it/150";
            li.appendChild(image);

            this.changeImage(i, li, image);


            let addButton = document.createElement("button");
            addButton.className = "addButton";
            addButton.innerHTML = "Add to shopping-cart";
            li.appendChild(addButton);
        }
    }

    changeImage(i, li, image) {
        let y = 0;

        if (information.products[i].images.length > 1) {
            let left = document.createElement("button");
            left.className = "left-button";
            left.innerHTML = '<';
            li.appendChild(left);

            let right = document.createElement("button");
            right.className = "right-button";
            right.innerHTML = '>';
            li.appendChild(right);

            right.addEventListener('click', function () {
                if (y < information.products[i].images.length - 1) {
                    image.src = information.products[i].images[++y].src || "http://placehold.it/150";
                }
            });

            left.addEventListener('click', function () {
                if (y > 0) {
                    image.src = information.products[i].images[--y].src || "http://placehold.it/150";
                }
            });

        }
    }
}


let addProduct = new AddProduct();

let xhr = new XMLHttpRequest();
xhr.open('GET', 'https://shop.bremont.com/products.json', false);
xhr.send();
let information = JSON.parse(xhr.responseText);
if (xhr.status != 200) {
    alert(xhr.status + ': ' + xhr.statusText);
} else {
    addProduct.addProduct();
}


class ShoppingCart {

    emptyCart() {
        let title = document.querySelectorAll('.title');
        let cart = document.querySelector('.shopping-cart');
        let totalPrice = document.querySelector('.total-price-wrap');

        let emptyNote = document.querySelector('.empty-cart-note');
        if (emptyNote) {
            emptyNote.parentNode.removeChild(emptyNote);
        }

        if (localStorage.length === 0) {
            for (let i = 0; i < title.length; i++) {
                title[i].style.opacity = '0';
            }

            totalPrice.style.opacity = '0';

            let note = document.createElement('p');
            note.className = "empty-cart-note";
            note.innerHTML = 'is empty';
            cart.appendChild(note);

        } else {
            for (let i = 0; i < title.length; i++) {
                title[i].style.opacity = '1';
            }
            totalPrice.style.opacity = '1';

            let emptyNote = document.querySelector('.empty-cart-note');
            if (emptyNote) {
                emptyNote.parentNode.removeChild(emptyNote);
            }
        }
    }

    createShoppingCartItem(i) {
        let shoppingCartProducts = document.querySelector('.shopping-cart-products');

        let shoppingCartItem = document.createElement('li');
        shoppingCartItem.className = "shopping-cart-item";
        shoppingCartItem.id = information.products[i].id;
        shoppingCartProducts.appendChild(shoppingCartItem);

        let title = document.createElement('h3');
        title.className = 'cart-title';
        title.innerHTML = information.products[i].title;
        shoppingCartItem.appendChild(title);

        let amountOfGoods = document.createElement('p');
        amountOfGoods.id = 'amount' + i;
        amountOfGoods.className = 'cart-amount';
        amountOfGoods.innerHTML = 1;
        shoppingCartItem.appendChild(amountOfGoods);

        let price = document.createElement('p');
        price.id = 'price' + i;
        price.className = 'cart-price';
        price.innerHTML = information.products[i].variants[0].price;
        shoppingCartItem.appendChild(price);


        let deleteButton = document.createElement("button");
        deleteButton.id = "deleteButton" + i;
        deleteButton.className = "deleteButton";
        deleteButton.innerHTML = "X";
        shoppingCartItem.appendChild(deleteButton);

    }


    deleteButton(i) {
        let deleteButton = document.querySelector("#deleteButton" + i);
        let that = this;

        if (deleteButton) {
            deleteButton.addEventListener('click', function () {
                this.parentNode.parentNode.removeChild(this.parentNode);
                localStorage.removeItem('id' + i);
                that.shoppingCartItemsAmount();
                that.emptyCart();
                that.totalPrice();
            });
        }
    }

    addToShoppingCart() {
        let addButton = document.querySelectorAll(".addButton");
        let that = this;

        for (let y = 0; y < localStorage.length; y++) {
            let item = JSON.parse(localStorage.getItem('id' + y));
            for (let z = 0; z < information.products.length; z++) {
                if (information.products[z].id === item) {
                    that.createShoppingCartItem(z);
                }
            }
            that.deleteButton(y);
            that.shoppingCartItemsAmount();
            that.totalPrice();
        }

        for (let i = 0; i < addButton.length; i++) {
            addButton[i].addEventListener('click', function () {
                let item = JSON.parse(localStorage.getItem('id' + i));

                if ((localStorage.length === 0) || (+item !== +information.products[i].id)) {
                    that.createShoppingCartItem(i);
                    localStorage.setItem('id' + i, information.products[i].id);
                } else {
                    let amount = document.querySelector('#amount' + i);
                    +amount.textContent++;

                    let price = document.querySelector('#price' + i);
                    price.innerHTML = +price.textContent + +information.products[i].variants[0].price;
                }
                that.deleteButton(i);
                that.shoppingCartItemsAmount();
                that.totalPrice();
            });
        }

    }

    shoppingCartItemsAmount() {
        let cartItemsAmount = document.querySelector('.cart-items-amount');
        cartItemsAmount.innerHTML = localStorage.length;
    }

    showShoppingCart() {
        let cartButton = document.querySelector('.fa-shopping-cart');
        let cart = document.querySelector('.cart-shim');
        let body = document.querySelector('body');
        let close = document.querySelector('.close');
        let that = this;

        cartButton.addEventListener('click', function () {
            cart.classList.remove('invisible');
            body.style.overflow = 'hidden';
            that.emptyCart();

        });

        close.addEventListener('click', function () {
            cart.classList.add('invisible');
            body.style.overflow = 'auto';
        })
    }

    totalPrice () {
        let cartPrice = document.querySelectorAll('.cart-price');
        let totalPrice = document.querySelector('.total-price');
        let price = 0;

        for(let i = 0; i < cartPrice.length; i++) {
            console.log(cartPrice[i].textContent);
            price += +cartPrice[i].textContent;
        }
        totalPrice.innerHTML = price.toFixed(2) ;

    }
}

let shoppingCart = new ShoppingCart();
shoppingCart.addToShoppingCart();
shoppingCart.showShoppingCart();
shoppingCart.emptyCart();
shoppingCart.totalPrice();



