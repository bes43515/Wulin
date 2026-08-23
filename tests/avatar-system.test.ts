import { describe, expect, it } from "vitest";

import { avatarItemById, avatarItems, avatarItemSafetyViolations, avatarLayersFor, avatarRarityForEquipmentChange, defaultAvatarEquipment, profileFromEquipment } from "../lib/avatar-system";
import { avatarLayerOrder, avatarSafeZones } from "../lib/avatar-template";

describe("Q 版 avatar-system", () => {
  it("renders the initial Q-version model with the baked-in body, cloth and hair plus the right-hand weapon", () => {
    expect(avatarLayersFor(defaultAvatarEquipment).map((layer) => layer.slot)).toEqual(["base_body", "weapon_front"]);
  });

  it("keeps aura, cape, body, outfit, weapon, hair and head accessory in the prescribed stack", () => {
    const equipment = {
      ...defaultAvatarEquipment,
      outfit: "avatar-outfit-sect",
      weapon: "avatar-weapon-iron",
      head_accessory: "avatar-headband-blue",
      back_accessory: "avatar-back-cape-plain",
      aura: "avatar-aura-innerglow",
    };
    expect(avatarLayersFor(equipment).map((layer) => layer.slot)).toEqual(["aura_back", "back_accessory", "base_body", "outfit", "weapon_front", "head_accessory", "aura_front"]);
  });

  it("gives every wearable asset a valid declared safety zone", () => {
    expect(avatarItems.flatMap(avatarItemSafetyViolations)).toEqual([]);
  });

  it("keeps every outfit out of the face protection rectangle", () => {
    const outfits = avatarItems.filter((entry) => entry.type === "outfit");
    expect(outfits.every((entry) => entry.safe_zones.length === 1 && entry.safe_zones[0] === "outfit")).toBe(true);
    expect(avatarSafeZones.face).toEqual({ x: 360, y: 120, width: 300, height: 230 });
  });

  it("maps the requested five-step try-on equipment into the shared persistent profile", () => {
    const testLook = {
      ...defaultAvatarEquipment,
      outfit: "avatar-outfit-sect",
      head_accessory: "avatar-headband-blue",
      weapon: "avatar-weapon-iron",
      back_accessory: "avatar-back-cape-plain",
      aura: "avatar-aura-innerglow",
    };
    const profile = profileFromEquipment(testLook);
    expect(profile.current_outfit_id).toBe("avatar-outfit-sect");
    expect(profile.current_head_accessory_id).toBe("avatar-headband-blue");
    expect(profile.current_weapon_id).toBe("avatar-weapon-iron");
    expect(profile.current_back_accessory_id).toBe("avatar-back-cape-plain");
    expect(profile.current_aura_id).toBe("avatar-aura-innerglow");
  });

  it("keeps the requested complete wardrobe and dedicated layer asset keys", () => {
    const names = avatarItems.map((entry) => entry.name);
    expect(names).toEqual(expect.arrayContaining(["門派弟子袍", "青雲俠客服", "赤焰披風袍", "木劍", "鐵劍", "雲紋長劍", "龍淵古劍", "金絲斗笠", "赤焰披風", "金色宗師光環"]));
    expect(new Set(avatarItems.map((entry) => entry.asset_url)).size).toBe(avatarItems.length);
  });

  it("maintains a complete canonical layer order and rarity transition behaviour", () => {
    expect(avatarLayerOrder).toEqual(["aura_back", "back_accessory", "base_body", "outfit", "hair_back", "weapon_back", "weapon_front", "hair_front", "head_accessory", "aura_front"]);
    const legendary = { ...defaultAvatarEquipment, weapon: "avatar-weapon-dragon" };
    expect(avatarRarityForEquipmentChange(defaultAvatarEquipment, legendary)).toBe("legendary");
    expect(avatarRarityForEquipmentChange(legendary, defaultAvatarEquipment)).toBe("legendary");
    expect(avatarItemById("avatar-head-hat-gold")?.safe_zones).toEqual(["head_accessory"]);
  });
});
