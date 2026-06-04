import { useState, type ChangeEvent } from "react";
import FoodList from "./FoodList";
import type { FoodItem } from "../types/food";

export default function Menu() {
  const [searchTerm, setSearchTerm] = useState<string>("");

  const food: FoodItem[] = [
    { name: "burger", price: 8 },
    { name: "fries", price: 4 },
    { name: "soup", price: 10 },
    { name: "cookie", price: 3 },
    { name: "sugar cookie", price: 3 },
    { name: "milkshake", price: 8 },
    { name: "oreo cookie", price: 3 },
    { name: "ice cream", price: 7 },
  ];

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSearch = () => {
    console.log(searchTerm);
  };

  const filteredFood = food.filter((f) =>
    f.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <>
      <input type="text" onChange={handleInputChange} />
      <button onClick={handleSearch}>Search</button>
      {filteredFood.map((f, key: number) => (
        <FoodList key={key} food={f} />
      ))}
    </>
  );
}
