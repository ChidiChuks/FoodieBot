import { DynamicTool } from "@langchain/core/tools";
import { z } from "zod";
import { foodMenu } from "@/data/foodMenu";
import { addOrder } from "./menuService";

// --- Menu Tool ---
export const menuTool = new DynamicTool({
  name: "get_menu",
  description: "Get food menu items by category: burgers, pizzas, salads, sides, drinks",
  func: async (input: string) => {
    const category = z.enum(["burgers", "pizzas", "salads", "sides", "drinks"]).parse(input.toLowerCase());
    const items = foodMenu.filter(item => item.category === category);
    return JSON.stringify(items);
  }
});

// --- Order Tool ---
export const orderTool = new DynamicTool({
  name: "place_order",
  description: "Submit food order. Input should be a JSON string with an 'items' array of order objects.",
  func: async (input: string) => {
    const schema = z.object({
      items: z.array(z.object({
        id: z.string().min(1, "id is required"),
        quantity: z.number().min(1, "quantity is required"),
        specialRequest: z.string().optional()
      }))
    });

    // Validate and parse input
    const order = schema.parse(JSON.parse(input));

    // Ensure the parsed order matches the expected type for addOrder
    const result = await addOrder({
      items: order.items.map(item => ({
        id: item.id,
        quantity: item.quantity,
        specialRequest: item.specialRequest
      }))
    });

    return JSON.stringify(result);
  }
});
