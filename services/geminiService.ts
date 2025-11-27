import { GoogleGenAI, Type } from "@google/genai";
import { MenuDatabase, UserProfile, AnalysisResult, MenuItem } from "../types";

const getAI = () => {
    const apiKey = process.env.API_KEY || "";
    if (!apiKey) {
      console.warn("API Key not found. Please ensure process.env.API_KEY is set.");
    }
    return new GoogleGenAI({ apiKey });
};

// Prompt 1: Generate Menu Database
export const generateMenuDatabase = async (): Promise<MenuDatabase | null> => {
  const ai = getAI();
  const prompt = `
    Generate a food database for NutriWheel with:
    - 15 main_dish items
    - 10 snack items
    - 10 drink items

    Follow this JSON structure exactly:
    {
      "version": "1.0",
      "categories": {
        "main_dish": [ ... ],
        "snack": [ ... ],
        "drink": [ ... ]
      }
    }

    Each item must have: id (unique string), name_th, name_en, description_th, calories_kcal, protein_g, fat_g, carb_g, sugar_g, fiber_g, caffeine_level (none|low|medium|high), health_score (1-10), type_tag (healthy|normal|high_calorie|low_carb|high_protein).
    Mix Thai and International food. For plain water: 0 kcal, health_score 10.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });
    
    return JSON.parse(response.text || "{}") as MenuDatabase;
  } catch (error) {
    console.error("Failed to generate menu:", error);
    return null;
  }
};

// Prompt 2: Analyze Menu
export const analyzeSelectedMenu = async (
  profile: UserProfile,
  selectedMenu: { main_dish: MenuItem; snack: MenuItem; drink: MenuItem },
  candidates: { drink: MenuItem[] } // Send candidates for better alternatives
): Promise<AnalysisResult | null> => {
  const ai = getAI();
  
  const userMessage = {
    user_profile: profile,
    selected_menu: {
      main_dish: {
        name_th: selectedMenu.main_dish.name_th,
        calories_kcal: selectedMenu.main_dish.calories_kcal,
        protein_g: selectedMenu.main_dish.protein_g,
        fat_g: selectedMenu.main_dish.fat_g,
        carb_g: selectedMenu.main_dish.carb_g,
        sugar_g: selectedMenu.main_dish.sugar_g,
        health_score: selectedMenu.main_dish.health_score,
      },
      snack: {
        name_th: selectedMenu.snack.name_th,
        calories_kcal: selectedMenu.snack.calories_kcal,
        sugar_g: selectedMenu.snack.sugar_g,
        health_score: selectedMenu.snack.health_score,
      },
      drink: {
        name_th: selectedMenu.drink.name_th,
        calories_kcal: selectedMenu.drink.calories_kcal,
        sugar_g: selectedMenu.drink.sugar_g,
        caffeine_level: selectedMenu.drink.caffeine_level,
        health_score: selectedMenu.drink.health_score,
      },
    },
    candidate_alternatives: {
      drink: candidates.drink.map(d => ({
        name_th: d.name_th,
        calories_kcal: d.calories_kcal,
        sugar_g: d.sugar_g,
        caffeine_level: d.caffeine_level,
        health_score: d.health_score
      })).slice(0, 5) // Limit context size
    }
  };

  const systemPrompt = `
    You are "Nutri Advisor", an AI nutrition coach.
    Analyze the provided user profile and selected menu.
    
    Output JSON:
    {
      "summary_th": "Short summary of meal in Thai",
      "evaluation_th": "ดี / พอใช้ / ควรระวัง + reason",
      "risk_factors_th": ["Risk 1", "Risk 2"],
      "advice_th": "Friendly advice in Thai",
      "health_score_overall": number (1-10),
      "suggested_alternatives": [
        { "from_category": "string", "name_th": "string", "reason_th": "string" }
      ]
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        { role: "user", parts: [{ text: JSON.stringify(userMessage) }] },
        { role: "model", parts: [{ text: " " }] } // Prefill for safety
      ],
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
      },
    });

    return JSON.parse(response.text || "{}") as AnalysisResult;
  } catch (error) {
    console.error("Failed to analyze menu:", error);
    return null;
  }
};
