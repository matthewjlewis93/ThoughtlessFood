import favorite from "../assets/favorite.svg";
import notfavorite from "../assets/notfavorite.svg";
import { useContext, useState } from "react";
import { AppContext } from "../Providers/ContextProvider";

export default function FavoriteButton({ item, link, update }) {
  const [isFavorite, setIsFavorite] = useState(item.favorite);
  const { APIUrl } = useContext(AppContext);

  const handleToggleFavorite = async () => {
    const res = await fetch(`${APIUrl}${link}/${item._id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...item, favorite: !item.favorite }),
    });

    setIsFavorite(!isFavorite);
    update(item);
  };

  return (
    <img
      onClick={handleToggleFavorite}
      style={{ position: "absolute", top: "5px", right: "5px" }}
      src={isFavorite ? favorite : notfavorite}
    />
  );
}
