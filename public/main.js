// COMMENTING MODAL

// Open the modal
const modal = document.querySelector('#modal-container');

const testButton = () => {
  modal.style.display = "block";
}

const closeModal = () => {
  modal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}