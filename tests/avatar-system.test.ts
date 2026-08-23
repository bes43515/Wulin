import { describe, expect, it } from "vitest";

import { avatarItemById, avatarItems, avatarLayersFor, avatarRarityForEquipmentChange, defaultAvatarEquipment, profileFromEquipment } from "../lib/avatar-system";

describe("avatar-system", () => {
  it("renders the base body before hair, outfit and front weapon layers", () => {
    const layers = avatarLayersFor(defaultAvatarEquipment);
    expect(layers.map((layer) => layer.slot)).toEqual(["base_body", "hair", "outfit", "weapon_front"]);
  });

  it("inserts selected accessories in the prescribed stack order", () => {
    const layers = avatarLayersFor({ ...defaultAvatarEquipment, head_accessory: "avatar-head-ornament-sect", back_accessory: "avatar-back-cape-plain", aura: "avatar-aura-innerglow" });
    expect(layers.map((layer) => layer.slot)).toEqual(["base_body", "hair", "outfit", "back_accessory", "weapon_front", "head_accessory", "aura_effect"]);
  });

  it("maps currently equipped slots into the persistent profile fields", () => {
    const profile = profileFromEquipment({ ...defaultAvatarEquipment, outfit: "avatar-outfit-sect", weapon: "avatar-weapon-iron" });
    expect(profile.current_outfit_id).toBe("avatar-outfit-sect");
    expect(profile.current_weapon_id).toBe("avatar-weapon-iron");
    expect(profile.current_aura_id).toBeNull();
  });

  it("includes the requested initial wardrobe categories", () => {
    const names = avatarItems.map((item) => item.name);
    expect(names).toEqual(expect.arrayContaining(["門派弟子袍", "青雲俠客服", "赤焰披風袍", "木劍", "鐵劍", "雲紋長劍", "龍淵古劍", "金絲斗笠", "赤焰披風", "金色宗師光環"]));
  });

  it("uses dedicated assets for every completed legendary wardrobe layer", () => {
    const goldHat = avatarItemById("avatar-head-hat-gold");
    const redCape = avatarItemById("avatar-back-cape-redflame");
    const masterAura = avatarItemById("avatar-aura-goldmaster");
    expect(goldHat?.asset_url).toMatch(/avatar-head-hat-gold/);
    expect(redCape?.asset_url).toMatch(/avatar-back-cape-redflame/);
    expect(masterAura?.asset_url).toMatch(/avatar-aura-goldmaster/);
    expect(new Set([goldHat?.asset_url, redCape?.asset_url, masterAura?.asset_url]).size).toBe(3);
  });

  it("uses the highest rarity of changed equipment for both equipping and unequipping effects", () => {
    const legendary = { ...defaultAvatarEquipment, weapon: "avatar-weapon-dragon" };
    expect(avatarRarityForEquipmentChange(defaultAvatarEquipment, legendary)).toBe("legendary");
    expect(avatarRarityForEquipmentChange(legendary, defaultAvatarEquipment)).toBe("legendary");
  });
});
