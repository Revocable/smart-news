// código desenvolvido por: Fábio Machado, Murilo Scolari e Yuri Ferraz

function getTime() {
  const date = new Date();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  return `${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}`;
}

function updateTime() {
  const clock = document.getElementById('clock');
  if (clock) {
    clock.innerText = getTime();
  }
}

updateTime();
setInterval(updateTime, 1000);
buscarCategorias();

const registerBtn = document.querySelector('#registerBtn');
const headerCategorias = document.querySelector('.header');
const boxForm = document.querySelector('.boxForm');
let noticias = [];
let categorias = [];
let categoriaForm = ""

// puxa as categorias do servidor
function buscarCategorias() {
  fetch("https://ifsp.ddns.net/webservices/noticiario/categorias")
    .then(resposta => {
      if (!resposta.ok) {
        throw new Error("Houve algum erro");
      }
      return resposta.json();
    })
    .then(dados => {
      categorias = dados;

      let botoesNav = "";
      for (let i = 0; i < categorias.length; i++) {
        botoesNav += `<li><button class="nav" id="${categorias[i]["id"]}">${categorias[i]["nome"]}</button></li>`;
        categoriaForm += `<option id="${categorias[i]["id"]}">${categorias[i]["nome"]}</option>`
      }

      headerCategorias.innerHTML = `
    <nav id="nav" class="navbar navbar-dark px-5 pt-3">
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
    <form id="formNotices" class="m-0">
	  <div class="form-group">
      <label class="text-light">Categoria</label>
      <select class="form-select" id="categoriaForm" name="categoria">
        <option selected>Selecione a categoria...</option>
        ${categoriaForm}
      </select>
    </div>
  
    <div class="form-group mt-2">
      <label class="text-light">Título</label>
      <input type="text" class="form-control" id="titulo" name="titulo" placeholder="Digite o título da notícia">
    </div>
  
    <div class="form-group mt-2">
      <label class="text-light">Subtítulo</label>
      <input type="text" class="form-control" id="subtitulo" name="subtitulo" placeholder="Digite o subtítulo">
    </div>
                
    <div class="form-group mt-2">
      <label class="text-light">Descrição</label>
      <textarea class="form-control" id="texto" name="descricao" placeholder="Digite a descrição da notícia"></textarea>
    </div>
                
    <button type="button" id="registerConfirm">Cadastrar</button>
    <button type="button" id="registerClear">Resetar</button>
  </form>`
          boxForm.classList.remove('hide');

          let confirmBtn = document.querySelector('#registerConfirm');
          confirmBtn.addEventListener("click", validarFormulario);
          confirmBtn.addEventListener('click', () => {
            let categoriaId = document.querySelector("#categoriaForm").options[document.querySelector("#categoriaForm").selectedIndex].id;
            document.getElementById(categoriaId).click();
          });
          confirmBtn.addEventListener('click', () => {
            form.reset();
          });

          let registerClearBtn = document.querySelector('#registerClear');
          let form = document.querySelector('#formNotices');

          registerClearBtn.addEventListener('click', () => {
            form.reset();
          });
        }, 200);
      }

      registerBtn.addEventListener('focus', criarCategoria);
    })
}

// valida o formulário
function validarFormulario() {
  let titulo = document.querySelector("input[name=titulo]").value;
  let subtitulo = document.querySelector("input[name=subtitulo]").value;
  let descricao = document.querySelector("textarea[name=descricao]").value;
  let categoriaId = document.querySelector("#categoriaForm").options[document.querySelector("#categoriaForm").selectedIndex].id;

  if (titulo.trim() === "") {
    Toastify({
      text: "Por favor, preencha o Subtítulo.",
      duration: 3000,
      backgroundColor: "linear-gradient(to right, #f44336, #ff5722)",
      position: "right",
      gravity: "top",
      offset: {
        x: 20,
        y: 20
      }
    }).showToast();
    return false;
  }

  if (subtitulo.trim() === "") {
    Toastify({
      text: "Por favor, preencha o Subtítulo.",
      duration: 3000,
      style: {
        background: "linear-gradient(to right, #f44336, #ff5722)",
      },
      position: "right",
      gravity: "top",
      offset: {
        x: 20,
        y: 20
      }
    }).showToast();
    return false;
  }

  if (descricao.trim() === "") {
    Toastify({
      text: "Por favor, preencha o campo Descrição.",
      duration: 3000,
      style: {
        background: "linear-gradient(to right, #f44336, #ff5722)",
      },
      position: "right",
      gravity: "top",
      offset: {
        x: 20,
        y: 20
      }
    }).showToast();
    return false;
  }

  if (categoriaId === "") {
    Toastify({
      text: "Por favor, preencha o campo Categoria.",
      duration: 3000,
      style: {
        background: "linear-gradient(to right, #f44336, #ff5722)",
      },
      position: "right",
      gravity: "top",
      offset: {
        x: 20,
        y: 20
      }
    }).showToast();
    return false;
  }
  enviarDados();
}

// envia os dados do formulário
function enviarDados() {
  let titulo = document.querySelector("input[name=titulo]").value;
  let subtitulo = document.querySelector("input[name=subtitulo]").value;
  let descricao = document.querySelector("textarea[name=descricao]").value;
  let categoriaId = document.querySelector("#categoriaForm").options[document.querySelector("#categoriaForm").selectedIndex].id;

  let dados = {
    titulo: titulo,
    subtitulo: subtitulo,
    conteudo: descricao,
    idCategoria: categoriaId
  };

  let params = new URLSearchParams();
  for (let chave in dados) {
    params.append(chave, dados[chave]);
  }

  let query = params.toString();
  let options = {
    method: "POST",
    body: query,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  }

  fetch("https://ifsp.ddns.net/webservices/noticiario/noticias", options)
    .then(resposta => {
      if (!resposta.ok) {
        throw new Error("Erro na comunicação");
      }
      return resposta.json();
    })
    .then(dados => {
      console.log(dados);
      Toastify({
        text: "Cadastro realizado com sucesso!",
        duration: 3000,
        style: {
          background: "linear-gradient(to right, #00b09b, #96c93d)",
        },
        position: "right",
        gravity: "top",
        offset: {
          x: 20,
          y: 20
        }
      }).showToast();
    })
    .catch(erro => {
      console.error("Erro encontrado: ", erro);
      Toastify({
        text: "Erro ao cadastrar notícia...",
        duration: 3000,
        style: {
          background: "linear-gradient(to right, #f44336, #ff5722)",
        },
        position: "right",
        gravity: "top",
        offset: {
          x: 20,
          y: 20
        }
      }).showToast();
    })
}

// exibe as notícias
function showNotices(event) {
  event.preventDefault();
  let smartDiv = document.querySelector('.smartImg');

  let newSmartDiv = document.createElement('div');
  newSmartDiv.classList.add('smartImg');

  newSmartDiv.style.backgroundImage = 'url(./assets/smartphoneremove.png)';

  smartDiv.parentNode.replaceChild(newSmartDiv, smartDiv);

  smartDiv = newSmartDiv;

  let idCategoria = parseInt(event.target.id);
  exibirNoticias(idCategoria);
}

function exibirNoticias(idCategoria) {
  let smartDiv = document.querySelector('.smartImg');

  fetch(`https://ifsp.ddns.net/webservices/noticiario/noticias?idCategoria=${idCategoria}`)
    .then(resposta => {
      if (!resposta.ok) {
        throw new Error("Houve algum erro");
      }
      return resposta.json();
    })
    .then(dados => {
      const nomeCategoria = categorias.find(categoria => categoria.id === idCategoria).nome;
      const noticiasFiltradas = dados.filter(noticia => noticia.idCategoria === idCategoria);
      let boxNotices = document.createElement('div');
      boxNotices.id = 'divNotices';
      smartDiv.appendChild(boxNotices);

      if (noticiasFiltradas.length === 0) {
        const mensagem = document.createElement('p');
        mensagem.innerHTML = `
          <div id="alertBox">
            <p id="nameCategory">${nomeCategoria}</p>
            <hr>  
            <p>Sem notícias cadastradas para esta categoria...</p>
          </div>`;
        boxNotices.appendChild(mensagem);
        return;
      }

      let noticiasHtml = "";
      for (let i = 0; i < noticiasFiltradas.length; i++) {
        const noticia = noticiasFiltradas[i];
        let excluirBtn = "";
        if (noticia.editavel !== 0) {
          excluirBtn = `<button id="btnRemove" data-id="${noticia.id}">Excluir</button>`;
        }
        noticiasHtml += `
      <div class="noticia">
        <div class="headerBox">
          <p>${nomeCategoria}</p>
        </div> 
        <hr>
        <div class="tituloBox">
          <p>${noticia.titulo}</p>
        </div>
        <hr>
        <div class="subtituloBox">
          <p>${noticia.subtitulo}</p>
        </div>
        <div class="descricaoBox">
          <p>${noticia.conteudo}</p>
        </div>
        <hr>
        <div class="dataBox">
        ${excluirBtn}
          <p>${noticia.data}</p>
        </div>
      </div>
    `;
      }

      boxNotices.innerHTML = noticiasHtml;

      const btnRemoverList = document.querySelectorAll('#btnRemove');
      btnRemoverList.forEach(btnRemover => {
        btnRemover.addEventListener('click', () => {
          const idNoticia = btnRemover.getAttribute('data-id');
          removerNoticias(idNoticia)
            .then(() => {
              const divNoticia = btnRemover.closest('.noticia');
              divNoticia.remove();
              document.getElementById(idCategoria).click();
            })
            .catch(erro => {
              console.error("Erro encontrado: ", erro);
            });
        });
      });
    })

    .catch(erro => {
      console.error("Erro encontrado: ", erro);
    });
}

// remove as notícias
function removerNoticias(id) {
  let options = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  }
  return fetch(`https://ifsp.ddns.net/webservices/noticiario/noticias/${id}`, options)
    .then(resposta => {
      if (!resposta.ok) {
        throw new Error("Erro na comunicação");
      }
      return resposta.json();
    })
    .then(dados => {
      console.log(dados);
      Toastify({
        text: "Notícia removida com sucesso!",
        duration: 3000,
        style: {
          background: "linear-gradient(to right, #00b09b, #96c93d)"
        },
        position: "right",
        gravity: "top",
        offset: {
          x: 20,
          y: 20
        }
      }).showToast();
    })
    .catch(erro => {
      console.error("Erro encontrado: ", erro);
      Toastify({
        text: "Erro ao remover notícia...",
        duration: 3000,
        style: {
          background: "linear-gradient(to right, #f44336, #ff5722)",
        },
        position: "right",
        gravity: "top",
        offset: {
          x: 20,
          y: 20
        }
      }).showToast();
    });
}

// exibe a pagina inicial
function showIndex(event) {
  event.preventDefault();

  boxForm.innerHTML = '';

  let smartDivremove = document.querySelector('.smartImg');

  let newSmartDivremove = document.createElement('div');
  newSmartDivremove.classList.add('smartImg');

  newSmartDivremove.style.backgroundImage = 'url(./assets/smartphone.png)';

  const clockDiv = document.createElement('div');
  clockDiv.id = 'clock';

  newSmartDivremove.appendChild(clockDiv);

  function updateTime() {
    const time = getTime();
    clockDiv.innerText = time;
  }

  updateTime();
  setInterval(updateTime, 1000);

  smartDivremove.parentNode.replaceChild(newSmartDivremove, smartDivremove);

  smartDivremove = newSmartDivremove;
}