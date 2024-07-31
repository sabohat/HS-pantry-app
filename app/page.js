"use client"
import { PantryPage } from "@/components/pantry-page";
import { firestore } from "@/firebase";
import { collection, getDocs } from "firebase/firestore"; // Import getDocs
import { Loader } from "lucide-react";
import { useEffect, useState } from "react"; // Import useState

export default function Home () {
  const [pantryItems, setPantryItems] = useState([]); // State to store pantry items
  const [loading, setLoading] = useState(true); // State to track loading status

  useEffect(() => {
    const fetchPantryItems = async () => {
      setLoading(true); // Set loading to true before fetching data
      const pantryCollection = collection(firestore, "pantry");
      const pantrySnapshot = await getDocs(pantryCollection);
      const items = pantrySnapshot.docs.map(doc => { return { ...doc.data(), id: doc.id } });
      setPantryItems(items);
      setLoading(false); // Set loading to false after data is fetched
    };

    fetchPantryItems();
  }, []);

  return (
    <>
      {loading ? (
        <div className="w-full h-screen flex items-center justify-center"><Loader className="mx-auto" /></div>// Display loading message while data is being fetched
      ) : (
        <PantryPage pantryList={pantryItems} />
      )}
    </>
  );
}