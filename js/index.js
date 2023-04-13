function getTime() {
    const date = new Date();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return `${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}`;
}

function updateTime() {
    const clock = document.getElementById('clock');
    clock.innerText = getTime();
}

updateTime();
setInterval(updateTime, 1000);


const registerBtn = document.querySelector('#registerBtn');
const headerCategorias = document.querySelector(".header");
const boxForm = document.querySelector('.boxForm');
let noticias = [];
let categorias = [];
let categoriaForm = ""

fetch("https://ifsp.ddns.net/webservices/noticiario/categorias")
    .then(resposta => {
        if (!resposta.ok) {
            throw new Error("Houve algum erro");
        }
        return resposta.json();
    })
    .then(dados => {
        console.log(dados);
        categorias = dados;


        let botoesNav = "";
        for (let i = 0; i < categorias.length; i++) {
            botoesNav += `<li><button class="nav" id="${categorias[i]["id"]}">${categorias[i]["nome"]}</button></li>`;
            categoriaForm += `<option>${categorias[i]["nome"]}`
        }

        headerCategorias.innerHTML = `<nav id="nav" class="navbar navbar-dark px-5 pt-3">
<a class="navbar-brand">
<button id="logoButton" type="button">
  <img src="assets/logo.png" height="55" class="d-inline-block align-top mt-3" alt="">
</button>
</a>
<ul class="nav justify-content-center nav-pills" id="categorias" >
    ${botoesNav}
</ul>
</nav>`

        let btnNavs = document.querySelectorAll('.nav');
        btnNavs.forEach(btn => {
            btn.addEventListener('click', showNotices);
        });
        let btnLogo = document.querySelector('#logoButton');
        btnLogo.addEventListener('click', showIndex);



        function criarCategoria(event) {
            event.preventDefault();

            boxForm.innerHTML = ''

            boxForm.classList.add('hide');
            setTimeout(() => {
                boxForm.innerHTML += `
    <form class="m-0">
	  <div class="form-group">
      <label class="text-light" for="categoria">Categoria</label>
      <select class="form-select" id="categoria">
        <option selected>Selecione a categoria...</option>
        ${categoriaForm}
      </select>
    </div>
  
    <div class="form-group mt-2">
      <label class="text-light" for="titulo">Título</label>
      <input type="text" class="form-control" id="titulo" placeholder="Digite o título da notícia" maxlength="25">
    </div>
  
    <div class="form-group mt-2">
      <label class="text-light" for="autor">Subtítulo</label>
      <input type="text" class="form-control" id="autor" placeholder="Digite o nome do autor"  maxlength="50">
    </div>
                
    <div class="form-group mt-2">
      <label class="text-light" for="texto">Descrição</label>
      <textarea class="form-control" id="texto" placeholder="Digite a descrição da notícia" maxlength="200"></textarea>
    </div>
                
    <button type="button" id="registerConfirm">Cadastrar</button>
    <button type="button" id="registerClear">Resetar</button>
  </form>`

                boxForm.classList.remove('hide');
            }, 200);
        }

        registerBtn.addEventListener('focus', criarCategoria);
    })

function exibirNoticias(idCategoria) {
    let smartDiv = document.querySelector('.smartImg'); // Definindo a variável smartDiv aqui
    fetch(`https://ifsp.ddns.net/webservices/noticiario/noticias?idCategoria=${idCategoria}`)
        .then(resposta => {
            if (!resposta.ok) {
                throw new Error("Houve algum erro");
            }
            return resposta.json();
        })
        .then(dados => {

            const noticiasFiltradas = dados.filter(noticia => noticia.idCategoria === idCategoria);
            let boxNotices = document.createElement('div');


            boxNotices.id = 'divNotices';

            smartDiv.appendChild(boxNotices);
            let noticiasHtml = "";
            for (let i = 0; i < noticiasFiltradas.length; i++) {
                const noticia = noticiasFiltradas[i];
                noticiasHtml += `
          <div class="noticia">
            <p id="titulo">• ${noticia.titulo}</h2>
            <p id="subtitulo">${noticia.subtitulo}</h2>
            <p id="descricao">${noticia.conteudo}</p>
            <p id="data">- ${noticia.data}</p>
          </div>
        `;
            }
            boxNotices.innerHTML = noticiasHtml;
        })
        .catch(erro => {
            console.error("Erro encontrado: ", erro);
        });
}

function showNotices(event) {
    event.preventDefault();
    boxForm.innerHTML = '';

    let smartDiv = document.querySelector('.smartImg');

    let newSmartDiv = document.createElement('div');
    newSmartDiv.classList.add('smartImg');

    setTimeout(() => {
        newSmartDiv.style.backgroundImage = 'url(../assets/smartphoneremove.png)';
    }, 0);

    smartDiv.parentNode.replaceChild(newSmartDiv, smartDiv);

    smartDiv = newSmartDiv;

    let idCategoria = parseInt(event.target.id);
    exibirNoticias(idCategoria);
}

function showIndex(event) {
    event.preventDefault();

    boxForm.innerHTML = '';

    let smartDivremove = document.querySelector('.smartImg');

    let newSmartDivremove = document.createElement('div');
    newSmartDivremove.classList.add('smartImg');

    setTimeout(() => {
        newSmartDivremove.style.backgroundImage = 'url(../assets/smartphone.png)';
    }, 9999999);

    const boxNotices = document.createElement('div');
    boxNotices.id = 'divNotices';

    const clockDiv = document.createElement('div');
    clockDiv.id = 'clock';

    boxNotices.appendChild(clockDiv);

    function updateTime() {
        const time = getTime();
        clockDiv.innerText = time;
    }

    updateTime();
    setInterval(updateTime, 1000);

    newSmartDivremove.appendChild(boxNotices);

    smartDivremove.parentNode.replaceChild(newSmartDivremove, smartDivremove);

    smartDivremove = newSmartDivremove;
}