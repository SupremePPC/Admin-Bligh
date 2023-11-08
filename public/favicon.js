// favicon.js

const updateFavicon = async () => {
  const storageRef = ref(storage, "gs://bligh-db.appspot.com/logos/favicon/");

  try {
    const faviconUrl = await getDownloadURL(storageRef);
    const faviconElement = document.getElementById("favicon");

    if (faviconElement) {
      faviconElement.href = faviconUrl;
    }
  } catch (error) {
    console.error("Error updating favicon:", error);
  }
};

// Wait for the DOM to fully load before executing the updateFavicon function
document.addEventListener("DOMContentLoaded", updateFavicon);
