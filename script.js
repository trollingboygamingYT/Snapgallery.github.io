const mediaInput = document.getElementById('mediaInput');
const uploadButton = document.getElementById('uploadButton');
const gallery = document.getElementById('gallery');
const dropZone = document.getElementById('dropZone');

// Modal elements
const modal = document.getElementById('mediaModal');
const modalContent = document.getElementById('modalContent');
const closeModal = document.getElementById('closeModal');

// Track added media files using a Set for base64 data
const addedMedia = new Set();

function loadMediaFromLocalStorage() {
  const savedMedia = JSON.parse(localStorage.getItem('savedMedia'));
  if (savedMedia) {
    savedMedia.forEach((mediaData) => {
      displayMedia(mediaData);
    });
  }
}

function saveMediaToLocalStorage() {
  const mediaItems = [];
  const mediaWrappers = gallery.querySelectorAll('.media-wrapper');
  mediaWrappers.forEach((wrapper) => {
    const mediaElement = wrapper.querySelector('.media-item');
    if (mediaElement) {
      mediaItems.push(mediaElement.src);
    }
  });
  localStorage.setItem('savedMedia', JSON.stringify(mediaItems));
}

function displayMedia(mediaData) {
  const mediaWrapper = document.createElement('div');
  mediaWrapper.classList.add('media-wrapper');

  let mediaElement;
  const fileType = mediaData.split(';')[0].split('/')[0]; // Extract file type from base64 string

  // Check if it's an image or video
  if (fileType === 'image' || mediaData.includes('image/gif')) {
    mediaElement = document.createElement('img');
    mediaElement.src = mediaData;
    mediaElement.classList.add('media-item');
  } else if (fileType === 'video') {
    mediaElement = document.createElement('video');
    mediaElement.src = mediaData;
    mediaElement.classList.add('media-item');
    mediaElement.controls = true;
  }

  // Add click event to enlarge the media
  mediaElement.addEventListener('click', () => {
    modal.style.display = 'flex';
    modalContent.innerHTML = `<img src="${mediaElement.src}">`;
  });

  // Create delete button
  const deleteButton = document.createElement('button');
  deleteButton.textContent = 'Remove';
  deleteButton.classList.add('delete-button');

  // Remove media on delete button click
  deleteButton.addEventListener('click', () => {
    gallery.removeChild(mediaWrapper);
    addedMedia.delete(mediaData);
    saveMediaToLocalStorage(); // Update localStorage
  });

  mediaWrapper.appendChild(mediaElement);
  mediaWrapper.appendChild(deleteButton);
  gallery.appendChild(mediaWrapper);
}

function handleFiles(files) {
  Array.from(files).forEach((file) => {
    if (file.size > 500 * 1024 * 1024) {
      alert('File size must be under 500MB.');
      return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      const fileType = file.type.split('/')[0]; // Determine the file type

      if (fileType === 'image' || file.type === 'image/gif') {
        const imageData = e.target.result;

        // Check for duplicates using base64 string
        if (addedMedia.has(imageData)) {
          alert('This image has already been added.');
          return;
        }

        addedMedia.add(imageData);
        displayMedia(imageData);
        saveMediaToLocalStorage(); // Save image to localStorage
      } else if (fileType === 'video') {
        const videoData = e.target.result;

        // Check for duplicates using base64 string
        if (addedMedia.has(videoData)) {
          alert('This video has already been added.');
          return;
        }

        addedMedia.add(videoData);
        displayMedia(videoData);
        saveMediaToLocalStorage(); // Save video to localStorage
      } else {
        alert('Only images and videos (MP4, WEBM) are supported.');
      }
    };

    if (file.type.startsWith('image') || file.type === 'image/gif') {
      reader.readAsDataURL(file);
    } else if (file.type.startsWith('video')) {
      reader.readAsDataURL(file);
    } else {
      alert('Unsupported file type');
    }
  });
}

// Handle upload button click
uploadButton.addEventListener('click', () => {
  const files = mediaInput.files;
  if (files.length === 0) {
    alert('Please select at least one media file.');
    return;
  }
  handleFiles(files);
  mediaInput.value = ''; // Clear file input
});

// Handle drag-and-drop functionality
dropZone.addEventListener('dragover', (e) => {
  e.preventDefault();
  dropZone.classList.add('dragging');
});

dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragging'));

dropZone.addEventListener('drop', (e) => {
  e.preventDefault();
  dropZone.classList.remove('dragging');
  handleFiles(e.dataTransfer.files);
});

// Close modal when clicking the close button
closeModal.addEventListener('click', () => (modal.style.display = 'none'));

// Close modal when clicking outside the modal content
modal.addEventListener('click', (e) => {
  if (e.target === modal) modal.style.display = 'none';
});

// Load saved media on page load
window.addEventListener('load', loadMediaFromLocalStorage);
