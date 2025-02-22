// Function to handle file selection and add images to the gallery
document.getElementById('imageUpload').addEventListener('change', handleFileSelect);

function handleFileSelect(event) {
    const files = event.target.files;
    const gallery = document.getElementById('gallery');

    // Loop through each selected file and display it
    for (const file of files) {
        if (file.type.startsWith('image/')) {
            const imgElement = document.createElement('img');
            const reader = new FileReader();

            reader.onload = function() {
                imgElement.src = reader.result;
                imgElement.alt = file.name;

                // Create a remove button for each image
                const removeButton = document.createElement('button');
                removeButton.classList.add('remove-btn');
                removeButton.textContent = 'X';
                removeButton.onclick = () => removeImage(imgElement, reader.result);

                // Append the image and remove button to the gallery
                const imageContainer = document.createElement('div');
                imageContainer.style.position = 'relative';
                imageContainer.appendChild(imgElement);
                imageContainer.appendChild(removeButton);

                // Add click event to open image in lightbox
                imgElement.addEventListener('click', () => openLightbox(reader.result));

                gallery.appendChild(imageContainer);

                // Save the image to localStorage
                saveImageToLocalStorage(reader.result);
            };

            reader.readAsDataURL(file);
        }
    }
}

// Function to remove an image from the gallery and localStorage
function removeImage(imgElement, imgSrc) {
    imgElement.parentElement.remove();
    removeImageFromLocalStorage(imgSrc);
}

// Function to open image in lightbox
function openLightbox(imageSrc) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    lightboxImg.src = imageSrc;
    lightbox.style.display = 'flex';
}

// Function to close lightbox
function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.style.display = 'none';
}

// Function to save image to localStorage
function saveImageToLocalStorage(imageSrc) {
    let savedImages = JSON.parse(localStorage.getItem('galleryImages')) || [];
    savedImages.push(imageSrc);
    localStorage.setItem('galleryImages', JSON.stringify(savedImages));
}

// Function to remove image from localStorage
function removeImageFromLocalStorage(imageSrc) {
    let savedImages = JSON.parse(localStorage.getItem('galleryImages')) || [];
    savedImages = savedImages.filter(img => img !== imageSrc);
    localStorage.setItem('galleryImages', JSON.stringify(savedImages));
}

// Function to load saved images from localStorage
function loadSavedImages() {
    const gallery = document.getElementById('gallery');
    let savedImages = JSON.parse(localStorage.getItem('galleryImages')) || [];

    savedImages.forEach(imageSrc => {
        const imgElement = document.createElement('img');
        imgElement.src = imageSrc;
        imgElement.alt = 'Saved Image';

        // Create a remove button for each image
        const removeButton = document.createElement('button');
        removeButton.classList.add('remove-btn');
        removeButton.textContent = 'X';
        removeButton.onclick = () => removeImage(imgElement, imageSrc);

        // Append the image and remove button to the gallery
        const imageContainer = document.createElement('div');
        imageContainer.style.position = 'relative';
        imageContainer.appendChild(imgElement);
        imageContainer.appendChild(removeButton);

        // Add click event to open image in lightbox
        imgElement.addEventListener('click', () => openLightbox(imageSrc));

        gallery.appendChild(imageContainer);
    });
}

// Load saved images when the page loads
window.onload = loadSavedImages;
