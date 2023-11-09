import { useEffect, useState } from "react";
import { ref, getDownloadURL } from "firebase/storage"; 
import { storage } from "./firebaseConfig/firebase";

const UpdateFavicon = () => {
  const [faviconUrl, setFaviconUrl] = useState("");

  // Function to fetch the favicon image from Firebase Storage
  const fetchFavicon = async () => {
    try {
      const storageRef = ref(storage, "gs://bligh-db.appspot.com/logos/favicon/"); // Update with your storage path
      const url = await getDownloadURL(storageRef);
      setFaviconUrl(url);
    } catch (error) {
      console.error("Error fetching favicon:", error);
    }
  };

  useEffect(() => {
    fetchFavicon();
  }, []);

  useEffect(() => {
    if (faviconUrl) {
      const linkElements = document.querySelectorAll("link[rel='icon']");
      linkElements.forEach((element) => {
        element.href = faviconUrl;
      });
    }
  }, [faviconUrl]);

  return null; 
};

export default UpdateFavicon;
