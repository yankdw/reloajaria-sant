// Import the Swal library
const Swal = window.Swal

// Carregar contagem do carrinho ao inicializar
document.addEventListener("DOMContentLoaded", () => {
  updateCartCount()
})

// Função para adicionar produto ao carrinho
function addToCart(productId) {
  fetch("api/cart.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      action: "add",
      product_id: productId,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        Swal.fire({
          icon: "success",
          title: "Produto adicionado!",
          text: "O produto foi adicionado ao seu carrinho.",
          timer: 2000,
          showConfirmButton: false,
        })
        updateCartCount()
      } else {
        Swal.fire({
          icon: "error",
          title: "Erro!",
          text: data.message || "Erro ao adicionar produto ao carrinho.",
        })
      }
    })
    .catch((error) => {
      console.error("Erro:", error)
      Swal.fire({
        icon: "error",
        title: "Erro!",
        text: "Erro de conexão. Tente novamente.",
      })
    })
}

// Função para atualizar contagem do carrinho
function updateCartCount() {
  fetch("api/cart.php?action=count")
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        var cartCount = document.getElementById("cart-count")
        if (cartCount) {
          cartCount.textContent = data.count
          cartCount.style.display = data.count > 0 ? "flex" : "none"
        }
      }
    })
    .catch((error) => {
      console.error("Erro ao atualizar carrinho:", error)
    })
}

// Função para remover item do carrinho
function removeFromCart(productId) {
  Swal.fire({
    title: "Tem certeza?",
    text: "Deseja remover este item do carrinho?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#e74c3c",
    cancelButtonColor: "#6c757d",
    confirmButtonText: "Sim, remover!",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      fetch("api/cart.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "remove",
          product_id: productId,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            location.reload()
          } else {
            Swal.fire("Erro!", data.message, "error")
          }
        })
    }
  })
}

// Função para atualizar quantidade no carrinho
function updateQuantity(productId, quantity) {
  if (quantity < 1) {
    removeFromCart(productId)
    return
  }

  fetch("api/cart.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      action: "update",
      product_id: productId,
      quantity: quantity,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        location.reload()
      } else {
        Swal.fire("Erro!", data.message, "error")
      }
    })
}

// Função para finalizar compra
function checkout() {
  Swal.fire({
    title: "Finalizar Compra",
    text: "Deseja finalizar sua compra?",
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#28a745",
    cancelButtonColor: "#6c757d",
    confirmButtonText: "Sim, finalizar!",
    cancelButtonText: "Continuar comprando",
  }).then((result) => {
    if (result.isConfirmed) {
      fetch("api/checkout.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            Swal.fire({
              icon: "success",
              title: "Compra Finalizada!",
              text: "Seu pedido foi realizado com sucesso.",
              confirmButtonText: "OK",
            }).then(() => {
              window.location.href = "index.php"
            })
          } else {
            Swal.fire("Erro!", data.message, "error")
          }
        })
    }
  })
}

// Função para deletar produto (vendedor/admin)
function deleteProduct(productId) {
  Swal.fire({
    title: "Tem certeza?",
    text: "Esta ação não pode ser desfeita!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#e74c3c",
    cancelButtonColor: "#6c757d",
    confirmButtonText: "Sim, deletar!",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      fetch("api/products.php", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: productId,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            Swal.fire("Deletado!", "Produto removido com sucesso.", "success").then(() => {
              location.reload()
            })
          } else {
            Swal.fire("Erro!", data.message, "error")
          }
        })
    }
  })
}

// Preview de imagem no upload
function previewImage(input) {
  if (input.files && input.files[0]) {
    var reader = new FileReader()
    reader.onload = (e) => {
      var preview = document.getElementById("image-preview")
      if (preview) {
        preview.src = e.target.result
        preview.style.display = "block"
      }
    }
    reader.readAsDataURL(input.files[0])
  }
}

// Smooth scroll para âncoras
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault()
    var target = document.querySelector(this.getAttribute("href"))
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  })
})

// Animação de fade-in para elementos
var observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
}

var observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("fade-in")
    }
  })
}, observerOptions)

document.querySelectorAll(".card, .hero-section").forEach((el) => {
  observer.observe(el)
})
