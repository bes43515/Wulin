export type AvatarSlot = "outfit" | "weapon" | "hair" | "head_accessory" | "back_accessory" | "aura";
export type AvatarLayerSlot = "base_body" | "hair" | "outfit" | "back_accessory" | "weapon_back" | "weapon_front" | "head_accessory" | "aura_effect";
export type AvatarRarity = "common" | "rare" | "epic" | "legendary";

export type AvatarItem = {
  id: string;
  name: string;
  type: AvatarSlot;
  rarity: AvatarRarity;
  description: string;
  price_coin: number;
  asset_url: string;
  layer_order: AvatarLayerSlot;
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

export type AvatarEquipment = Record<AvatarSlot, string | null>;

export const avatarBaseBodyAsset = "/manus-storage/avatar-base-body_5b4712cb.png";
export const avatarBrandMark = "/manus-storage/wulin-mountain-gate-mark_00e65824.png";
const createdAt = "2026-08-23T00:00:00.000Z";

export const avatarItems: AvatarItem[] = [
  { id: "avatar-hair-black-topknot", name: "黑色髮髻", type: "hair", rarity: "common", description: "初入江湖的俐落髮髻。", price_coin: 0, asset_url: "/manus-storage/avatar-hair-black-topknot_7e6039ba.png", layer_order: "hair", compatible_character_type: "young_wuxia", unlock_condition: "初始持有", created_at: createdAt },
  { id: "avatar-outfit-cloth", name: "布衣少俠", type: "outfit", rarity: "common", description: "適合每日修煉的簡潔布衣。", price_coin: 0, asset_url: "/manus-storage/avatar-outfit-cloth_f6f09e54.png", layer_order: "outfit", compatible_character_type: "young_wuxia", unlock_condition: "初始持有", created_at: createdAt },
  { id: "avatar-outfit-sect", name: "門派弟子袍", type: "outfit", rarity: "rare", description: "帶著門派徽記的修煉長袍。", price_coin: 200, asset_url: "/manus-storage/avatar-outfit-sect_061cea1d.png", layer_order: "outfit", compatible_character_type: "young_wuxia", unlock_condition: "江湖商鋪", created_at: createdAt },
  { id: "avatar-outfit-qingyun", name: "青雲俠客服", type: "outfit", rarity: "epic", description: "雲紋隨身，行走江湖更顯從容。", price_coin: 500, asset_url: "/manus-storage/avatar-outfit-qingyun_9d43aac3.png", layer_order: "outfit", compatible_character_type: "young_wuxia", unlock_condition: "江湖商鋪", created_at: createdAt },
  { id: "avatar-outfit-redflame", name: "赤焰披風袍", type: "outfit", rarity: "legendary", description: "赤焰映身，象徵傳說級修煉。", price_coin: 1000, asset_url: "/manus-storage/avatar-outfit-redflame_82967987.png", layer_order: "outfit", compatible_character_type: "young_wuxia", unlock_condition: "江湖商鋪", created_at: createdAt },
  { id: "avatar-weapon-wood", name: "木劍", type: "weapon", rarity: "common", description: "萬丈高樓，先從木劍起。", price_coin: 0, asset_url: "/manus-storage/avatar-weapon-wood-front_7d6ca50b.png", layer_order: "weapon_front", compatible_character_type: "young_wuxia", unlock_condition: "初始持有", created_at: createdAt },
  { id: "avatar-weapon-iron", name: "鐵劍", type: "weapon", rarity: "rare", description: "一寸鐵，一寸心。", price_coin: 150, asset_url: "/manus-storage/avatar-weapon-iron-front_b0d3fd0b.png", layer_order: "weapon_front", compatible_character_type: "young_wuxia", unlock_condition: "江湖商鋪", created_at: createdAt },
  { id: "avatar-weapon-cloud", name: "雲紋長劍", type: "weapon", rarity: "epic", description: "雲紋劍氣，回應悟性修煉。", price_coin: 400, asset_url: "/manus-storage/avatar-weapon-cloud-front_377229ef.png", layer_order: "weapon_front", compatible_character_type: "young_wuxia", unlock_condition: "江湖商鋪", created_at: createdAt },
  { id: "avatar-weapon-dragon", name: "龍淵古劍", type: "weapon", rarity: "legendary", description: "古劍內斂，非有緣人不可持。", price_coin: 900, asset_url: "/manus-storage/avatar-weapon-dragon-front_414282a2.png", layer_order: "weapon_front", compatible_character_type: "young_wuxia", unlock_condition: "江湖商鋪", created_at: createdAt },
  { id: "avatar-headband-blue", name: "青布髮帶", type: "head_accessory", rarity: "common", description: "樸實卻不失俐落的髮帶。", price_coin: 0, asset_url: "/manus-storage/avatar-headband-blue_326e942a.png", layer_order: "head_accessory", compatible_character_type: "young_wuxia", unlock_condition: "初始持有", created_at: createdAt },
  { id: "avatar-head-ornament-sect", name: "門派額飾", type: "head_accessory", rarity: "rare", description: "以門派徽飾見證修煉心志。", price_coin: 180, asset_url: "/manus-storage/avatar-head-ornament-sect_05830add.png", layer_order: "head_accessory", compatible_character_type: "young_wuxia", unlock_condition: "江湖商鋪", created_at: createdAt },
  { id: "avatar-head-hat-gold", name: "金絲斗笠", type: "head_accessory", rarity: "epic", description: "金絲收邊，替少俠遮下江湖風霜。", price_coin: 420, asset_url: "/manus-storage/avatar-head-hat-gold_6ecef93a.png", layer_order: "head_accessory", compatible_character_type: "young_wuxia", unlock_condition: "江湖商鋪", created_at: createdAt },
  { id: "avatar-back-cape-plain", name: "素色披風", type: "back_accessory", rarity: "rare", description: "風起時，披風亦替少俠作答。", price_coin: 220, asset_url: "/manus-storage/avatar-back-cape-plain_2b575a2c.png", layer_order: "back_accessory", compatible_character_type: "young_wuxia", unlock_condition: "江湖商鋪", created_at: createdAt },
  { id: "avatar-back-cape-redflame", name: "赤焰披風", type: "back_accessory", rarity: "epic", description: "赤焰流轉，步入山門亦自成氣勢。", price_coin: 560, asset_url: "/manus-storage/avatar-back-cape-redflame_f7178022.png", layer_order: "back_accessory", compatible_character_type: "young_wuxia", unlock_condition: "江湖商鋪", created_at: createdAt },
  { id: "avatar-back-swordcase", name: "背劍匣", type: "back_accessory", rarity: "legendary", description: "收束劍意，也收束持劍之心。", price_coin: 800, asset_url: "/manus-storage/avatar-back-swordcase_a233ee42.png", layer_order: "back_accessory", compatible_character_type: "young_wuxia", unlock_condition: "江湖商鋪", created_at: createdAt },
  { id: "avatar-aura-innerglow", name: "內力微光", type: "aura", rarity: "rare", description: "內力流轉，修為在身外凝成微光。", price_coin: 260, asset_url: "/manus-storage/avatar-aura-innerglow_4ea66813.png", layer_order: "aura_effect", compatible_character_type: "young_wuxia", unlock_condition: "江湖商鋪", created_at: createdAt },
  { id: "avatar-aura-swordqi", name: "青雲劍氣", type: "aura", rarity: "epic", description: "劍氣迴旋，如青雲護體。", price_coin: 520, asset_url: "/manus-storage/avatar-aura-swordqi_000897bd.png", layer_order: "aura_effect", compatible_character_type: "young_wuxia", unlock_condition: "江湖商鋪", created_at: createdAt },
  { id: "avatar-aura-goldmaster", name: "金色宗師光環", type: "aura", rarity: "legendary", description: "宗師氣機環抱，劍意收放自如。", price_coin: 980, asset_url: "/manus-storage/avatar-aura-goldmaster_290a18d2.png", layer_order: "aura_effect", compatible_character_type: "young_wuxia", unlock_condition: "江湖商鋪", created_at: createdAt },
];

export const defaultAvatarEquipment: AvatarEquipment = { outfit: "avatar-outfit-cloth", weapon: "avatar-weapon-wood", hair: "avatar-hair-black-topknot", head_accessory: null, back_accessory: null, aura: null };
export const avatarSlotLabel: Record<AvatarSlot, string> = { outfit: "服飾", weapon: "武器", hair: "髮型", head_accessory: "頭飾", back_accessory: "背飾", aura: "特效" };
export const avatarRarityLabel: Record<AvatarRarity, string> = { common: "常見", rare: "稀有", epic: "史詩", legendary: "傳說" };
export const avatarRarityColor: Record<AvatarRarity, string> = { common: "#72918A", rare: "#2E8B91", epic: "#7661B5", legendary: "#C94D42" };
export const avatarRarityRank: Record<AvatarRarity, number> = { common: 1, rare: 2, epic: 3, legendary: 4 };
export const avatarRarityEffect: Record<AvatarRarity, { glowColor: string; ringColor: string; sealColor: string; sealTextColor: string; sealLabel: string; flashStart: number; flashEnd: number; flashPeakOpacity: number; impactDuration: number; settleDuration: number }> = {
  common: { glowColor: "rgba(173, 214, 186, 0.58)", ringColor: "#D8F2DE", sealColor: "#5F8C73", sealTextColor: "#F4FFF1", sealLabel: "素裝", flashStart: 0.74, flashEnd: 1.08, flashPeakOpacity: 0.52, impactDuration: 105, settleDuration: 205 },
  rare: { glowColor: "rgba(93, 205, 203, 0.62)", ringColor: "#A9FFF5", sealColor: "#277C84", sealTextColor: "#E6FFFB", sealLabel: "靈裝", flashStart: 0.72, flashEnd: 1.15, flashPeakOpacity: 0.64, impactDuration: 120, settleDuration: 240 },
  epic: { glowColor: "rgba(158, 126, 222, 0.68)", ringColor: "#E5D2FF", sealColor: "#6F58A8", sealTextColor: "#F9F0FF", sealLabel: "真訣", flashStart: 0.68, flashEnd: 1.25, flashPeakOpacity: 0.74, impactDuration: 135, settleDuration: 280 },
  legendary: { glowColor: "rgba(247, 191, 79, 0.76)", ringColor: "#FFF0A7", sealColor: "#C27828", sealTextColor: "#FFF8D9", sealLabel: "傳說", flashStart: 0.62, flashEnd: 1.38, flashPeakOpacity: 0.88, impactDuration: 155, settleDuration: 330 },
};
export const avatarItemById = (id: string | null | undefined) => avatarItems.find((item) => item.id === id);

/** 當一次操作改變多個槽位時，以最高稀有度作為換裝特效等級；卸下時也會保留原物品的特效層級。 */
export function avatarRarityForEquipmentChange(previous: AvatarEquipment, next: AvatarEquipment): AvatarRarity {
  const candidates = (Object.keys(next) as AvatarSlot[]).flatMap((slot) => previous[slot] === next[slot] ? [] : [previous[slot], next[slot]]).map((id) => avatarItemById(id)?.rarity).filter((rarity): rarity is AvatarRarity => Boolean(rarity));
  return candidates.sort((left, right) => avatarRarityRank[right] - avatarRarityRank[left])[0] ?? "common";
}

export type AvatarLayer = { slot: AvatarLayerSlot; assetUrl: string };
export function avatarLayersFor(equipment: AvatarEquipment): AvatarLayer[] {
  const itemFor = (slot: AvatarSlot) => avatarItemById(equipment[slot]);
  const assetFor = (slot: AvatarSlot, layer: AvatarLayerSlot) => {
    const item = itemFor(slot);
    if (!item) return undefined;
    // 初始角色已將布衣與髮髻繪入基礎身體，避免重複套圖造成深色底圖或輪廓重影。
    if (item.id === "avatar-hair-black-topknot" || item.id === "avatar-outfit-cloth") return undefined;
    return item.asset_layers?.[layer] ?? (item.layer_order === layer ? item.asset_url : undefined);
  };
  const layers: AvatarLayer[] = [{ slot: "base_body", assetUrl: avatarBaseBodyAsset }];
  // 保持資料序列與裝備規格一致；視覺上的披風、光效前後關係由 CharacterAvatar 的 zIndex 明確控制。
  ([
    ["hair", "hair"],
    ["outfit", "outfit"],
    ["back_accessory", "back_accessory"],
    ["weapon", "weapon_back"],
    ["weapon", "weapon_front"],
    ["head_accessory", "head_accessory"],
    ["aura", "aura_effect"],
  ] as const).forEach(([slot, layer]) => { const assetUrl = assetFor(slot, layer); if (assetUrl) layers.push({ slot: layer, assetUrl }); });
  return layers;
}

export function profileFromEquipment(equipment: AvatarEquipment): UserProfile {
  return { user_id: "local-jianghu-player", base_body_asset_url: avatarBaseBodyAsset, current_outfit_id: equipment.outfit, current_weapon_id: equipment.weapon, current_hair_id: equipment.hair, current_head_accessory_id: equipment.head_accessory, current_back_accessory_id: equipment.back_accessory, current_aura_id: equipment.aura };
}
