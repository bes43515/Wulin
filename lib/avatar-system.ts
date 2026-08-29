import {
  avatarLayerDepth,
  avatarLayerHasValidSafeZone,
  avatarLayerOrder,
  avatarLayerBone,
  type AvatarLayerSlot,
  type AvatarSafeZone,
} from "./avatar-template";

export type { AvatarLayerSlot } from "./avatar-template";
export type AvatarSlot = "outfit" | "weapon" | "hair" | "head_accessory" | "back_accessory" | "aura";
export type AvatarRarity = "common" | "rare" | "epic" | "legendary";
export type AvatarEquipment = Record<AvatarSlot, string | null>;

/** 素材鍵與本機檔案一一對應；不可再使用未保證可存取的暫時網址。 */
export const avatarAsset = {
  skeletonBaseBody: "avatar-q://skeleton-base-body",
  baseBody: "avatar-q://base-body",
  hairFront: "avatar-q://hair-front",
  outfitCloth: "avatar-q://outfit-cloth",
  outfitSect: "avatar-q://outfit-sect",
  outfitQingyun: "avatar-q://outfit-qingyun",
  outfitRedflame: "avatar-q://outfit-redflame",
  weaponWood: "avatar-q://weapon-wood",
  weaponIron: "avatar-q://weapon-iron",
  weaponCloud: "avatar-q://weapon-cloud",
  weaponDragon: "avatar-q://weapon-dragon",
  headbandBlue: "avatar-q://headband-blue",
  headOrnamentSect: "avatar-q://head-ornament-sect",
  headHatGold: "avatar-q://head-hat-gold",
  capePlain: "avatar-q://back-cape-plain",
  capeRedflame: "avatar-q://back-cape-redflame",
  swordcase: "avatar-q://back-swordcase",
  innerGlowBack: "avatar-q://aura-innerglow-back",
  swordQiBack: "avatar-q://aura-swordqi-back",
  goldMasterBack: "avatar-q://aura-goldmaster-back",
  auraFrontClear: "avatar-q://aura-front-clear",
} as const;

export type AvatarItem = {
  id: string;
  name: string;
  type: AvatarSlot;
  rarity: AvatarRarity;
  description: string;
  price_coin: number;
  asset_url: string;
  layer_order: AvatarLayerSlot;
  safe_zones: readonly AvatarSafeZone[];
  compatible_character_type: "young_wuxia";
  unlock_condition: string;
  created_at: string;
  asset_layers?: Partial<Record<AvatarLayerSlot, string>>;
};

export type UserItem = { user_id: string; item_id: string; quantity: number; owned: boolean; acquired_at: string };
export type UserEquipment = { user_id: string; slot: AvatarSlot; item_id: string | null; equipped_at: string | null };
export type UserProfile = {
  user_id: string;
  base_body_asset_url: string;
  current_outfit_id: string | null;
  current_weapon_id: string | null;
  current_hair_id: string | null;
  current_head_accessory_id: string | null;
  current_back_accessory_id: string | null;
  current_aura_id: string | null;
};

export const avatarBaseBodyAsset = avatarAsset.baseBody;
export const avatarSkeletonBaseBodyAsset = avatarAsset.skeletonBaseBody;
export const avatarBrandMark = "/manus-storage/wulin-mountain-gate-mark_00e65824.png";
const createdAt = "2026-08-24T00:00:00.000Z";

const item = (data: Omit<AvatarItem, "compatible_character_type" | "created_at">): AvatarItem => ({
  ...data,
  compatible_character_type: "young_wuxia",
  created_at: createdAt,
});

/** 每件物品僅保留可見配件；服飾永遠不含頭臉，特效永遠不會使用臉部保護區。 */
export const avatarItems: AvatarItem[] = [
  item({ id: "avatar-hair-black-topknot", name: "黑色髮髻", type: "hair", rarity: "common", description: "固定少俠髮髻已繪入基礎模板，不重複疊加。", price_coin: 0, asset_url: avatarAsset.hairFront, layer_order: "hair_front", safe_zones: ["hair"], asset_layers: {}, unlock_condition: "初始持有" }),
  item({ id: "avatar-outfit-cloth", name: "布衣少俠", type: "outfit", rarity: "common", description: "預設布衣已繪入基礎模板，不重複覆蓋頭臉與身體。", price_coin: 0, asset_url: avatarAsset.outfitCloth, layer_order: "outfit", safe_zones: ["outfit"], asset_layers: {}, unlock_condition: "初始持有" }),
  item({ id: "avatar-outfit-sect", name: "門派弟子袍", type: "outfit", rarity: "rare", description: "玉青門派長袍，領口止於頸部下方。", price_coin: 200, asset_url: avatarAsset.outfitSect, layer_order: "outfit", safe_zones: ["outfit"], asset_layers: { outfit: avatarAsset.outfitSect }, unlock_condition: "江湖商鋪" }),
  item({ id: "avatar-outfit-qingyun", name: "青雲俠客服", type: "outfit", rarity: "epic", description: "青藍雲紋武服，只覆蓋身體安全區。", price_coin: 500, asset_url: avatarAsset.outfitQingyun, layer_order: "outfit", safe_zones: ["outfit"], asset_layers: { outfit: avatarAsset.outfitQingyun }, unlock_condition: "江湖商鋪" }),
  item({ id: "avatar-outfit-redflame", name: "赤焰披風袍", type: "outfit", rarity: "legendary", description: "朱紅傳說武袍，絕不進入臉部範圍。", price_coin: 1000, asset_url: avatarAsset.outfitRedflame, layer_order: "outfit", safe_zones: ["outfit"], asset_layers: { outfit: avatarAsset.outfitRedflame }, unlock_condition: "江湖商鋪" }),
  item({ id: "avatar-weapon-wood", name: "木劍", type: "weapon", rarity: "common", description: "固定於右手外側的木製練習劍。", price_coin: 0, asset_url: avatarAsset.weaponWood, layer_order: "weapon_front", safe_zones: ["hand_weapon"], asset_layers: { weapon_front: avatarAsset.weaponWood }, unlock_condition: "初始持有" }),
  item({ id: "avatar-weapon-iron", name: "鐵劍", type: "weapon", rarity: "rare", description: "右手安全區內的實戰鐵劍。", price_coin: 150, asset_url: avatarAsset.weaponIron, layer_order: "weapon_front", safe_zones: ["hand_weapon"], asset_layers: { weapon_front: avatarAsset.weaponIron }, unlock_condition: "江湖商鋪" }),
  item({ id: "avatar-weapon-cloud", name: "雲紋長劍", type: "weapon", rarity: "epic", description: "雲紋長劍維持右手側的人體對位。", price_coin: 400, asset_url: avatarAsset.weaponCloud, layer_order: "weapon_front", safe_zones: ["hand_weapon"], asset_layers: { weapon_front: avatarAsset.weaponCloud }, unlock_condition: "江湖商鋪" }),
  item({ id: "avatar-weapon-dragon", name: "龍淵古劍", type: "weapon", rarity: "legendary", description: "古劍只在右手外側呈現，避開頭臉與胸口。", price_coin: 900, asset_url: avatarAsset.weaponDragon, layer_order: "weapon_front", safe_zones: ["hand_weapon"], asset_layers: { weapon_front: avatarAsset.weaponDragon }, unlock_condition: "江湖商鋪" }),
  item({ id: "avatar-headband-blue", name: "青布髮帶", type: "head_accessory", rarity: "common", description: "只貼合髮際，保留完整五官。", price_coin: 0, asset_url: avatarAsset.headbandBlue, layer_order: "head_accessory", safe_zones: ["head_accessory"], asset_layers: { head_accessory: avatarAsset.headbandBlue }, unlock_condition: "初始持有" }),
  item({ id: "avatar-head-ornament-sect", name: "門派額飾", type: "head_accessory", rarity: "rare", description: "小型額飾固定於額頭上緣。", price_coin: 180, asset_url: avatarAsset.headOrnamentSect, layer_order: "head_accessory", safe_zones: ["head_accessory"], asset_layers: { head_accessory: avatarAsset.headOrnamentSect }, unlock_condition: "江湖商鋪" }),
  item({ id: "avatar-head-hat-gold", name: "金絲斗笠", type: "head_accessory", rarity: "epic", description: "金絲斗笠框在頭頂，不覆蓋雙眼。", price_coin: 420, asset_url: avatarAsset.headHatGold, layer_order: "head_accessory", safe_zones: ["head_accessory"], asset_layers: { head_accessory: avatarAsset.headHatGold }, unlock_condition: "江湖商鋪" }),
  item({ id: "avatar-back-cape-plain", name: "素色披風", type: "back_accessory", rarity: "rare", description: "披風只位於肩背後方。", price_coin: 220, asset_url: avatarAsset.capePlain, layer_order: "back_accessory", safe_zones: ["back"], asset_layers: { back_accessory: avatarAsset.capePlain }, unlock_condition: "江湖商鋪" }),
  item({ id: "avatar-back-cape-redflame", name: "赤焰披風", type: "back_accessory", rarity: "epic", description: "赤焰披風停留於身體後方。", price_coin: 560, asset_url: avatarAsset.capeRedflame, layer_order: "back_accessory", safe_zones: ["back"], asset_layers: { back_accessory: avatarAsset.capeRedflame }, unlock_condition: "江湖商鋪" }),
  item({ id: "avatar-back-swordcase", name: "背劍匣", type: "back_accessory", rarity: "legendary", description: "背劍匣固定於右肩背側。", price_coin: 800, asset_url: avatarAsset.swordcase, layer_order: "back_accessory", safe_zones: ["back"], asset_layers: { back_accessory: avatarAsset.swordcase }, unlock_condition: "江湖商鋪" }),
  item({ id: "avatar-aura-innerglow", name: "內力微光", type: "aura", rarity: "rare", description: "低透明內力微光環繞足邊，不遮表情。", price_coin: 260, asset_url: avatarAsset.innerGlowBack, layer_order: "aura_back", safe_zones: ["aura"], asset_layers: { aura_back: avatarAsset.innerGlowBack, aura_front: avatarAsset.auraFrontClear }, unlock_condition: "初始持有" }),
  item({ id: "avatar-aura-swordqi", name: "青雲劍氣", type: "aura", rarity: "epic", description: "青雲劍氣置於外圍與足邊。", price_coin: 520, asset_url: avatarAsset.swordQiBack, layer_order: "aura_back", safe_zones: ["aura"], asset_layers: { aura_back: avatarAsset.swordQiBack, aura_front: avatarAsset.auraFrontClear }, unlock_condition: "江湖商鋪" }),
  item({ id: "avatar-aura-goldmaster", name: "金色宗師光環", type: "aura", rarity: "legendary", description: "宗師光環避開臉部保護區。", price_coin: 980, asset_url: avatarAsset.goldMasterBack, layer_order: "aura_back", safe_zones: ["aura"], asset_layers: { aura_back: avatarAsset.goldMasterBack, aura_front: avatarAsset.auraFrontClear }, unlock_condition: "江湖商鋪" }),
];

export const defaultAvatarEquipment: AvatarEquipment = { outfit: "avatar-outfit-cloth", weapon: "avatar-weapon-wood", hair: "avatar-hair-black-topknot", head_accessory: null, back_accessory: null, aura: null };
export const avatarSlotLabel: Record<AvatarSlot, string> = { outfit: "服飾", weapon: "武器", hair: "髮型", head_accessory: "頭飾", back_accessory: "背飾", aura: "特效" };
export const avatarRarityLabel: Record<AvatarRarity, string> = { common: "常見", rare: "稀有", epic: "史詩", legendary: "傳說" };
export const avatarRarityColor: Record<AvatarRarity, string> = { common: "#72918A", rare: "#2E8B91", epic: "#7661B5", legendary: "#C94D42" };
export const avatarRarityRank: Record<AvatarRarity, number> = { common: 1, rare: 2, epic: 3, legendary: 4 };
export const avatarRarityEffect: Record<AvatarRarity, { glowColor: string; ringColor: string; sealColor: string; sealTextColor: string; sealLabel: string; flashStart: number; flashEnd: number; flashPeakOpacity: number; impactDuration: number; settleDuration: number }> = {
  common: { glowColor: "rgba(173, 214, 186, 0.34)", ringColor: "#D8F2DE", sealColor: "#5F8C73", sealTextColor: "#F4FFF1", sealLabel: "素裝", flashStart: 0.74, flashEnd: 1.08, flashPeakOpacity: 0.34, impactDuration: 105, settleDuration: 205 },
  rare: { glowColor: "rgba(93, 205, 203, 0.42)", ringColor: "#A9FFF5", sealColor: "#277C84", sealTextColor: "#E6FFFB", sealLabel: "靈裝", flashStart: 0.72, flashEnd: 1.15, flashPeakOpacity: 0.42, impactDuration: 120, settleDuration: 240 },
  epic: { glowColor: "rgba(158, 126, 222, 0.48)", ringColor: "#E5D2FF", sealColor: "#6F58A8", sealTextColor: "#F9F0FF", sealLabel: "真訣", flashStart: 0.68, flashEnd: 1.25, flashPeakOpacity: 0.48, impactDuration: 135, settleDuration: 280 },
  legendary: { glowColor: "rgba(247, 191, 79, 0.52)", ringColor: "#FFF0A7", sealColor: "#C27828", sealTextColor: "#FFF8D9", sealLabel: "傳說", flashStart: 0.62, flashEnd: 1.38, flashPeakOpacity: 0.52, impactDuration: 155, settleDuration: 330 },
};

export const avatarItemById = (id: string | null | undefined) => avatarItems.find((entry) => entry.id === id);

/** 可在測試與開發期阻擋把服飾錯掛到頭部，或讓特效宣告為臉部素材等資料錯誤。 */
export function avatarItemSafetyViolations(entry: AvatarItem) {
  return Object.entries(entry.asset_layers ?? {}).flatMap(([layer]) => {
    const typedLayer = layer as AvatarLayerSlot;
    return avatarLayerHasValidSafeZone(typedLayer, entry.safe_zones) ? [] : [`${entry.id}:${typedLayer} 不符合 ${entry.safe_zones.join("/")} 安全區域`];
  });
}

export function avatarRarityForEquipmentChange(previous: AvatarEquipment, next: AvatarEquipment): AvatarRarity {
  const candidates = (Object.keys(next) as AvatarSlot[]).flatMap((slot) => previous[slot] === next[slot] ? [] : [previous[slot], next[slot]]).map((id) => avatarItemById(id)?.rarity).filter((rarity): rarity is AvatarRarity => Boolean(rarity));
  return candidates.sort((left, right) => avatarRarityRank[right] - avatarRarityRank[left])[0] ?? "common";
}

export type AvatarLayer = { slot: AvatarLayerSlot; assetUrl: string; depth: number; bone: string; attachment: string };
export function avatarLayersFor(equipment: AvatarEquipment): AvatarLayer[] {
  const selected = (slot: AvatarSlot) => avatarItemById(equipment[slot]);
  const from = (slot: AvatarSlot, layer: AvatarLayerSlot) => selected(slot)?.asset_layers?.[layer];
  const layers: Partial<Record<AvatarLayerSlot, string>> = {
    aura_back: from("aura", "aura_back"),
    back_accessory: from("back_accessory", "back_accessory"),
    base_body: avatarSkeletonBaseBodyAsset,
    outfit: from("outfit", "outfit"),
    hair_back: from("hair", "hair_back"),
    weapon_back: from("weapon", "weapon_back"),
    weapon_front: from("weapon", "weapon_front"),
    hair_front: from("hair", "hair_front"),
    head_accessory: from("head_accessory", "head_accessory"),
    aura_front: from("aura", "aura_front"),
  };
  return avatarLayerOrder.flatMap((slot) => layers[slot] ? [{ slot, assetUrl: layers[slot]!, depth: avatarLayerDepth[slot], bone: avatarLayerBone[slot].bone, attachment: avatarLayerBone[slot].attachment }] : []);
}

export function profileFromEquipment(equipment: AvatarEquipment): UserProfile {
  return { user_id: "local-jianghu-player", base_body_asset_url: avatarSkeletonBaseBodyAsset, current_outfit_id: equipment.outfit, current_weapon_id: equipment.weapon, current_hair_id: equipment.hair, current_head_accessory_id: equipment.head_accessory, current_back_accessory_id: equipment.back_accessory, current_aura_id: equipment.aura };
}
