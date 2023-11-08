// favicon.js
const updateFavicon = (newFaviconUrl) => {
    const favicon = document.getElementById("favicon");
    if (favicon) {
      favicon.href = newFaviconUrl;
    }
  };
  