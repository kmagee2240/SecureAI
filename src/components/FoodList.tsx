import type { FoodItem } from "../types/food";

interface FoodProp {
  food: FoodItem;
}

export default function FoodList({ food }: FoodProp) {
  return (
    <div style={{ margin: "1rem" }}>
      {food.name}: ${food.price}
    </div>
  );
}
