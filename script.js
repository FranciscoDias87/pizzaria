// carrinho
let cart = [];

// definindo a quantidade de pizzas sempre em 1
let modalQt = 1;

// adicionar uma chave a modal
let modalkey = 0

// convertnto o querySelector e querySelectorAll 
// em constantes para ajudar a entender o código
const qS = (el)=> document.querySelector(el);
const qsAll = (el) => document.querySelectorAll(el);

// Listagem das Pizzas
pizzaJson.map((item, index)=>{
    let pizzaItem = qS('.models .pizza-item').cloneNode(true);

    pizzaItem.setAttribute('data-key', index);
    pizzaItem.querySelector('.pizza-item--img img').src = item.img;
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`;
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;
    pizzaItem.querySelector('a').addEventListener('click', (e)=>{
        e.preventDefault();

        // pegando as informações do elemento que foi clicado
        // e colocando dentro da modal (reconhece qual é a pizza)
        let key = e.target.closest('.pizza-item').getAttribute('data-key');
        
        // inicializando a modalQt (reseta a quantidade)
        modalQt = 1;
    
        // adicionar uma chave a modal (diz qual é pizza)
        modalkey = key;

        qS('.pizzaBig img').src = pizzaJson[key].img;
        qS('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
        qS('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
        qS('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}`;

        // removendo o selecte do index 2(pizza grande)
        qS('.pizzaInfo--size.selected').classList.remove('selected');

        // adicionando o tamanho da pizzas me gramas
        qsAll('.pizzaInfo--size').forEach((size, sizeIndex)=>{
            // deixando sempre o index 2(pizza grande) selecionado
            // mesmo depois de selecionar pizza de outro sabor
            if (sizeIndex == 2){
                size.classList.add('selected');
            }
            // adicionando o tamanho/peso certo das pizzas
            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];
        });
        
        // valor padrão da variavel modal(quantidade de pizzas)
        qS('.pizzaInfo--qt').innerHTML = modalQt;

        // aplicando o efeito na modal ao clicar em um item da lista
        qS('.pizzaWindowArea').style.opacity = 0;
        qS('.pizzaWindowArea').style.display = 'flex';
        setTimeout(()=>{
            qS('.pizzaWindowArea').style.opacity = 1;
        }, 200);
    });    
    
    qS('.pizza-area').append(pizzaItem);
});

// Eventos especificos do MODAL
// tirando o modal da tela
function closeModal(){
    qS('.pizzaWindowArea').style.opacity = 0;
    setTimeout(()=>{
        qS('.pizzaWindowArea').style.display = 'none';
    }, 500);
}
// adicionando o "fechar" ao evento de clicar ou voltar
qsAll('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item)=>{
    item.addEventListener('click', closeModal);
});

// configurando o aumentar e diminuir quantidade de pizzas
qS('.pizzaInfo--qtmenos').addEventListener('click', ()=>{
    if (modalQt > 1){
        modalQt--;
        qS('.pizzaInfo--qt').innerHTML = modalQt;  
    }    
});

qS('.pizzaInfo--qtmais').addEventListener('click', ()=>{
    modalQt++;
    qS('.pizzaInfo--qt').innerHTML = modalQt;
});

// selecionando o tamanho da pizza
//removendo o selecionado
// aplicando a nova selecção

qsAll('.pizzaInfo--size').forEach((size, sizeIndex)=>{
    size.addEventListener('click',(e)=>{        
        qS('.pizzaInfo--size.selected').classList.remove('selected');        
        size.classList.add('selected');
    });
});

// colocando dentro do carrinho
qS('.pizzaInfo--addButton').addEventListener('click', ()=>{
    let size = parseInt(qS('.pizzaInfo--size.selected').getAttribute('data-key'));
    
    // gerando identificador para o carrinho    
    let identifier = pizzaJson[modalkey].id+'@'+size;

    //vericando no carrinho se ja existe item com o mesmo identifier
    let key = cart.findIndex((item)=> item.identifier == identifier);
    
    if (key > -1){
        // se achou aumenta a quantidade
        cart[key].qt += modalQt;

    }else {
        // se não achou adiciona novo item
        cart.push({
            identifier,
            // qual a pizza
            id:pizzaJson[modalkey].id,
            // tamanho
            size,
            // quantidade
            qt:modalQt
        });
    }
    updateCart();    
    closeModal();
});

//mostrando carrinho mobile
qS('.menu-openner').addEventListener('click', ()=>{
    if(cart.length>0){
        qS('aside').style.left = "0";
    }
});
// fechando/ocultando o carrinho mobile
qS('.menu-closer').addEventListener('click', ()=>{
    qS('aside').style.left = "100vw";
});

// atualizar carrinho
 function updateCart(){
    //  atualizando os tipos de item no carrinho mobile
    qS('.menu-openner span').innerHTML = cart.length;

    // exibindo o carrinho
    if (cart.length > 0){
        qS('aside').classList.add('show');
        qS('.cart').innerHTML = '';

        let subTotal = 0;
        let desconto = 0;
        let total = 0;

        // mapeando o carrinho
        for (let i in cart){
            // identificando a pizza
            let pizzaItem =  pizzaJson.find((item)=> item.id == cart[i].id);
            // calculando subtotal
            subTotal += pizzaItem.price * cart[i].qt;
            
            // clonando o cart-item
            let cartItem = qS('.models .cart--item').cloneNode(true);

            //definindo o tamanho junto ao nome da PIZZA
            let pizzaSizeName;
            switch(cart[i].size){
                case 0:
                    pizzaSizeName = "P";
                    break
                case 1:
                    pizzaSizeName = "M";
                    break
                case 2:
                    pizzaSizeName = "G";
                    break;
            }
            let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`;

            // itens
            cartItem.querySelector('img').src = pizzaItem.img;
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', ()=>{
               if(cart[i].qt > 1){
                   cart[i].qt--; //diminuindo item do carrinho
               }else{
                   cart.splice(i, 1); //removendo item do carrinho
               }
                updateCart();
            });
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', ()=>{
                cart[i].qt++;
                updateCart();
            });

            // adicionando dentro do cartItem
            qS('.cart').append(cartItem);            
        }

        //calculos
        desconto = subTotal * 0.1;
        total = subTotal - desconto;
        //colocando valores
        qS('.subtotal span:last-child').innerHTML = `R$ ${subTotal.toFixed(2)}`;
        qS('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
        qS('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;

    }else{
        qS('aside').classList.remove('show');
        qS('aside').style.left = "100vw";
    }
 }