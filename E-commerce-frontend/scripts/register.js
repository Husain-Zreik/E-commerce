const pages = {}

pages.base_url = "http://127.0.0.1:8000/api/";

pages.print_message = (message) =>{
    console.log(message);
}

pages.postAPI = async (api_url, api_data) => {

    try{
        return await fetch(api_url,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(api_data)
        })
        .then(res =>{
            return res.json()
        } )
        .then(data => {
            console.log(data)
            return data
        })
    
    }catch(error){
        pages.print_message("Error from Linking (POST) " + error)
    }
}

pages.getAPI = async (api_url) => {

    try{
        return await fetch(api_url)
        .then(res =>{
            return res.json()
        } )
        .then(data => {
            console.log(data)
            return data
        })
    
    }catch(error){
        pages.print_message("Error from Linking (POST) " + error)
    }
}

pages.submit = (page) => {
    console.log("submit")
    const form = document.getElementById("form")

    form.addEventListener('submit',async (event) => {
        
        console.log("i am in submit")
        event.preventDefault()

        const password = document.getElementById("password")
        const check_password = document.getElementById("check-password")
        
        const forgot_div = document.getElementById("forgot")
        const existingError = document.getElementById("error-message");

        if (existingError) {
            form.removeChild(existingError);
        }

        const passwordError = document.getElementById("error-password");
        if (passwordError) {
            forgot_div.removeChild(passwordError);
        }

        if(page!="signup" || password.value === check_password.value){
            const form_data = new FormData(form)
            const data = Object.fromEntries(form_data)
            console.log(data)
            pages.loadFor(page,data)
        } else {
            
            const errorDiv = document.createElement("div");
            errorDiv.innerText = "Passwords do not match. Try again.";
            errorDiv.id = "error-message";
            form.appendChild(errorDiv);
        }
    })
}

pages.page_display_product = async () => {
    console.log("i am in display product")
    const get_product_url = pages.base_url + "get_products"
    const response = await pages.getAPI(get_product_url)
    
    if (response.status === "success") 
    {
        
        const product_List = document.getElementById('product-list');
        
        response.product.forEach((data)=>{     
            const product_elemet = document.createElement('div');
            product_elemet.innerHTML =
            `<div class="card">
            <div class="front">
                <img class="collage2" src="${data.image_url}" alt="watch photo">
            </div>
            <div class="back">
            <ul class="product_description_list"><b>${data.name}</b>
                    <li>Price: ${data.price}$</li>
                    <li>Category: ${data.category}</li>
                    <li>Discreption: ${data.description}</li>
                </ul>
                <div class="card-buttons">
                    <button class="favorite-btn" id="fav${data.id}">Favorite</button>
                    <button class="add-to-cart-btn" id="cart${data.id}">Add to Cart</button>
                </div>
            </div>
            </div>`
            product_List.appendChild(product_elemet);
        })


        const favoriteButtons = document.querySelectorAll(".favorite-btn");
        const addToCartButtons = document.querySelectorAll(".add-to-cart-btn");

        favoriteButtons.forEach((button) => {
            button.addEventListener("click", async (event) => {
                const product_id = button.id.slice(3);     
                const user_data = localStorage.getItem("myData");
                const parsedData = JSON.parse(user_data);
            
                const user_id = parsedData.user.id
                const data = {user_id: user_id,product_id: product_id};
            pages.page_add_to_favorite(data)
            
        });
    });
    
    addToCartButtons.forEach((button) => {
        button.addEventListener("click", async (event) => {
            const product_id = button.id.slice(4);    
            const user_data = localStorage.getItem("myData");
            const parsedData = JSON.parse(user_data);

            const user_id = parsedData.user.id
            const data = {user_id: user_id,product_id: product_id};
            pages.page_add_to_cart(data)

        })
        });
    
    }else{
        console.log(response.message)
    }
    
}

pages.page_add_to_cart = async(data)=>{
    console.log("i am in add to cart")
    const add_to_cart_url = pages.base_url + "add_to_cart"
    const response = await pages.postAPI(add_to_cart_url,data)
    
    if (response.status === "success") {
        console.log(response.message)
        localStorage.setItem('cartProducts', JSON.stringify(data));

    }else{
        console.log(response.message)
    }
}

pages.page_add_to_favorite = async(data)=>{
    console.log("i am in add to favorite")
    const add_to_favorite_url = pages.base_url + "add_to_favorite"
    const response = await pages.postAPI(add_to_favorite_url,data)
    
    if (response.status === "success") {
        console.log(response.message)
        localStorage.setItem('favoriteProducts', JSON.stringify(data));
    }else{
        console.log(response.message)
    }
}


pages.page_get_favorite_product = async () => {
    console.log("i am in favorit get product")
    const data = JSON.parse(localStorage.getItem('favoriteProducts'));

    const get_favorite_product_url = pages.base_url + "get_favorite_product"
    const response = await pages.postAPI(get_favorite_product_url,data)
    
    if (response.status === "success") {
        console.log(response.message)

        const productsBody = document.getElementById('productsBody');
        response.product.forEach(product => {
            const row = document.createElement('tr');

            const nameCell = document.createElement('td');
            nameCell.textContent = product.name;
            row.appendChild(nameCell);

            const priceCell = document.createElement('td');
            priceCell.textContent = product.price +" $";
            row.appendChild(priceCell);

            const categoryCell = document.createElement('td');
            categoryCell.textContent = product.category;
            row.appendChild(categoryCell);
            
            productsBody.appendChild(row);
        })
    }else{
        console.log(response.message)
    }
}

pages.page_get_cart_product = async () => {
    console.log("i am in get cart product")
    const data = JSON.parse(localStorage.getItem('cartProducts'));

    const get_cart_product_url = pages.base_url + "get_cart_product"
    const response = await pages.postAPI(get_cart_product_url,data)
    
    if (response.status === "success") {
        console.log(response.message)
        
        let total_element = document.getElementById("total");
        let total = parseInt(total_element.textContent, 10);

        const productsBody = document.getElementById('productsBody');
        response.product.forEach(product => {

            total=total +product.price*product.quantity

            const row = document.createElement('tr');
            
            const nameCell = document.createElement('td');
            nameCell.textContent = product.name;
            row.appendChild(nameCell);
            
            const priceCell = document.createElement('td');
            priceCell.textContent = product.price*product.quantity +" $";
            row.appendChild(priceCell);
            
            const categoryCell = document.createElement('td');
            categoryCell.textContent = product.category;
            row.appendChild(categoryCell);
            
            const quantityCell = document.createElement('td');
            quantityCell.textContent = product.quantity;
            row.appendChild(quantityCell);
            
            productsBody.appendChild(row);
        })
        total_element.textContent= total
    }else{
        console.log(response.message)
    }
}

pages.page_get_product = async () => {
    console.log("i am in get product")
    const get_product_url = pages.base_url + "get_products"
    const response = await pages.getAPI(get_product_url)
    
    if (response.status === "success") {
        console.log(response.message)

        const productsBody = document.getElementById('productsBody');
        response.product.forEach(product => {
            const row = document.createElement('tr');

            const idCell = document.createElement('td');
            idCell.textContent = product.id; 
            row.appendChild(idCell);

            const nameCell = document.createElement('td');
            nameCell.textContent = product.name;
            row.appendChild(nameCell);

            const priceCell = document.createElement('td');
            priceCell.textContent = product.price +" $";
            row.appendChild(priceCell);

            const categoryCell = document.createElement('td');
            categoryCell.textContent = product.category;
            row.appendChild(categoryCell);
            
            const descriptionCell = document.createElement('td');
            descriptionCell.textContent = product.description;
            row.appendChild(descriptionCell);
            
            const imageCell = document.createElement('td');
            imageCell.className = "image-col"
            imageCell.textContent = product.image_url;
            row.appendChild(imageCell);

            productsBody.appendChild(row);
        })
    }else{
        console.log(response.message)
    }
}

pages.page_add_product = async (data) => {
    console.log("i am in add product")
    console.log(data)
    const add_product_url = pages.base_url + "add_product"
    const response = await pages.postAPI(add_product_url,data)
    
    if (response.status === "success") {
        console.log(response.message)
    }else{
        console.log(response.message)
    }
}

pages.page_update_product = async (data) => {
    console.log("i am in update product")
    const update_product_url = pages.base_url + "update_product"
    const response = await pages.postAPI(update_product_url,data)

    if (response.status === "success") {
        console.log(response.message)
    }else{
        console.log(response.message)
    }
}

pages.page_delete_product = async (data) => {
    console.log("i am in delete product")
    const delete_product_url = pages.base_url + "delete_product"
    const response = await pages.postAPI(delete_product_url,data)

    if (response.status === "success") {
        console.log(response.message)
    }else{
        console.log(response.message)
    }
}

pages.page_signup = async (data) => {
    console.log("i am in register")
    const signup_url = pages.base_url + "sign_up"
    const response = await pages.postAPI(signup_url,data)
    if (response.status === "success") {
        console.log(response.message)
        window.location.href = 'templates/log_in.html';        
    }else{
        console.log(response.message)
    }
}

pages.page_login = async (data) => {
    console.log("i am in login")
    const login_url = pages.base_url + "sign_in"
    const response = await pages.postAPI(login_url,data)
    const forgot_div = document.getElementById("forgot")
    localStorage.removeItem('myData')
    localStorage.clear()

    if (response.status === "logged in") {
        localStorage.setItem('myData', JSON.stringify(response));

        if(response.user.type === "user"){
            window.location.href = `./store.html`;
        }else{
            window.location.href = `./admin-read.html`;
        }
        
    }else{
        console.log(response.message)
        if(response.message ==="Email not found"){
            const errorDiv = document.createElement("div");
            errorDiv.innerText = "Email doesn't exist";
            errorDiv.id = "error-password";
            forgot_div.appendChild(errorDiv);
        }else{
            const errorDiv = document.createElement("a");
            errorDiv.innerText = "Forgot your Password?";
            errorDiv.id = "error-password";
            // errorDiv.href = "./forgot_pass.html";
            forgot_div.appendChild(errorDiv);
        }
    }
}

pages.loadFor = (page,data) => {
    eval("pages.page_" + page + "(" + JSON.stringify(data) + ");");
}