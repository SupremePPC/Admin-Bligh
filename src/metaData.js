// Assuming you have a function to update meta data in the head of the HTML document
export function updateMeta(newMetaData) {
    document.querySelector('meta[name="description"]').setAttribute('content', newMetaData);
    // You can add similar logic for other meta tags as needed
  }
  