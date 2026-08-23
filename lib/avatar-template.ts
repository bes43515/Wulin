/**
 * Q 版武林角色模板：所有可穿戴圖層都使用同一張 1024×1024 畫布與固定人體定位。
 * 請勿以 CSS 縮放修正錯位素材；新素材必須依此資料於生成階段對位。
 */
export const avatarCanvas = { width: 1024, height: 1024, aspectRatio: 1 } as const;

export type AvatarRect = { x: number; y: number; width: number; height: number };
export type AvatarAnchorName = "head_center" | "shoulder_left" | "shoulder_right" | "hand_left" | "hand_right" | "waist" | "foot_left" | "foot_right";
export type AvatarSafeZone = "face" | "outfit" | "hair" | "head_accessory" | "hand_weapon" | "back" | "aura";
export type AvatarLayerSlot = "aura_back" | "back_accessory" | "base_body" | "outfit" | "hair_back" | "weapon_back" | "weapon_front" | "hair_front" | "head_accessory" | "aura_front";

export const avatarAnchors: Record<AvatarAnchorName, { x: number; y: number }> = {
  head_center: { x: 512, y: 250 },
  shoulder_left: { x: 372, y: 365 },
  shoulder_right: { x: 652, y: 365 },
  hand_left: { x: 350, y: 575 },
  hand_right: { x: 674, y: 575 },
  waist: { x: 512, y: 540 },
  foot_left: { x: 430, y: 900 },
  foot_right: { x: 594, y: 900 },
};

export const avatarSafeZones: Record<AvatarSafeZone, AvatarRect> = {
  face: { x: 360, y: 120, width: 300, height: 230 },
  outfit: { x: 250, y: 310, width: 530, height: 590 },
  hair: { x: 330, y: 50, width: 360, height: 300 },
  head_accessory: { x: 310, y: 35, width: 400, height: 315 },
  hand_weapon: { x: 585, y: 410, width: 360, height: 500 },
  back: { x: 180, y: 300, width: 665, height: 610 },
  aura: { x: 100, y: 80, width: 824, height: 850 },
};

export const avatarLayerOrder: readonly AvatarLayerSlot[] = [
  "aura_back",
  "back_accessory",
  "base_body",
  "outfit",
  "hair_back",
  "weapon_back",
  "weapon_front",
  "hair_front",
  "head_accessory",
  "aura_front",
] as const;

export const avatarLayerDepth: Record<AvatarLayerSlot, number> = Object.fromEntries(avatarLayerOrder.map((slot, index) => [slot, index])) as Record<AvatarLayerSlot, number>;

/** 定義每個實際圖層可繪製的範圍，供資料驗證與素材交接使用。 */
export const avatarLayerSafeZones: Record<AvatarLayerSlot, readonly AvatarSafeZone[]> = {
  aura_back: ["aura"],
  back_accessory: ["back"],
  base_body: ["face", "outfit", "hair"],
  outfit: ["outfit"],
  hair_back: ["hair"],
  weapon_back: ["back"],
  weapon_front: ["hand_weapon"],
  hair_front: ["hair"],
  head_accessory: ["head_accessory"],
  aura_front: ["aura"],
};

export const avatarFaceProtection = avatarSafeZones.face;

export function avatarLayerHasValidSafeZone(layer: AvatarLayerSlot, zones: readonly AvatarSafeZone[]) {
  return zones.length > 0 && zones.every((zone) => avatarLayerSafeZones[layer].includes(zone));
}
