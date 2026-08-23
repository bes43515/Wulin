import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

import { avatarItemById, defaultAvatarEquipment, profileFromEquipment, type AvatarEquipment, type AvatarSlot, type UserEquipment, type UserItem, type UserProfile } from "@/lib/avatar-system";

export type TaskType = "inner" | "body" | "wisdom" | "reputation";
export type Difficulty = "normal" | "hard" | "epic";
export type ItemType = "avatar" | "frame" | "weapon" | "clothing" | "consumable";
export type Rarity = "common" | "rare" | "epic" | "legendary";
type CatalogItem = { id: string; name: string; type: ItemType; rarity: Rarity; price: number; description: string; icon: string; minLevel: number; imageUrl?: string; effect?: number; duration?: number };
export type Task = { id: string; title: string; description: string; type: TaskType; difficulty: Difficulty; due: string; completed: boolean; createdAt: string; completedAt?: string };
export type Attributes = { inner: number; body: number; wisdom: number; reputation: number };
export type InventoryItem = { id: string; quantity: number; acquiredAt: string; expiresAt?: string; equipped?: boolean; activeUntil?: string };
export type AchievementTier = "bronze" | "silver" | "gold" | "legendary";
export type AchievementDefinition = { key: string; name: string; description: string; category: "diligence" | "extreme" | "collection" | "social" | "event"; icon: string; tiers: { tier: AchievementTier; target: number; rewardCoin: number; rewardTitle?: string; rewardItemId?: string }[] };
export type GameState = { onboarded: boolean; nickname: string; sect: string; level: number; exp: number; coin: number; streak: number; attributes: Attributes; tasks: Task[]; history: Task[]; ownedItems: string[]; equippedItem: string | null; inventory: InventoryItem[]; userItems: UserItem[]; avatarEquipment: AvatarEquipment; userEquipment: UserEquipment[]; userProfile: UserProfile; achievementLevels: Record<string, number>; titles: string[]; adventureCount: number; loginDays: number; lastActiveDate?: string };
export type Reward = { exp: number; attribute: number; coin: number; type: TaskType; surprise: string | null; leveledUp: boolean; achievementUnlocks: string[]; itemUnlocks: string[] };

type Store = GameState & { completeTask: (id: string) => Reward | null; addTask: (task: Omit<Task, "id" | "createdAt" | "completed">) => void; updateTask: (id: string, task: Partial<Task>) => void; deleteTask: (id: string) => void; buyItem: (id: string) => boolean; buyAvatarItem: (id: string) => boolean; equipItem: (id: string) => void; equipAvatarItem: (id: string) => void; unequipAvatarSlot: (slot: AvatarSlot) => void; useItem: (id: string) => boolean; finishOnboarding: (sect: string, taskTitle: string) => void; reset: () => void };

export const itemCatalog: CatalogItem[] = [
  { id: "clothing-cloth", name: "布衣少俠服飾", type: "clothing" as ItemType, rarity: "common" as Rarity, price: 0, description: "初入江湖的清爽布衣。", icon: "袍", minLevel: 1 },
  { id: "clothing-sect", name: "門派弟子袍", type: "clothing" as ItemType, rarity: "rare" as Rarity, price: 200, description: "帶著門派徽記的修煉長袍。", icon: "派", minLevel: 6 },
  { id: "clothing-cape", name: "俠客披風", type: "clothing" as ItemType, rarity: "epic" as Rarity, price: 500, description: "行走江湖，自有一身瀟灑。", icon: "披", minLevel: 16 },
  { id: "clothing-master", name: "宗師長袍", type: "clothing" as ItemType, rarity: "legendary" as Rarity, price: 1000, description: "沉靜如山的宗師氣度。", icon: "宗", minLevel: 31 },
  { id: "weapon-wood", name: "木劍", type: "weapon" as ItemType, rarity: "common" as Rarity, price: 0, description: "萬丈高樓，先從木劍起。", icon: "劍", imageUrl: "/manus-storage/jianghu-item-sword_38d0b44e.png", minLevel: 1 },
  { id: "weapon-iron", name: "鐵劍", type: "weapon" as ItemType, rarity: "rare" as Rarity, price: 150, description: "一寸鐵，一寸心。", icon: "鐵", minLevel: 6 },
  { id: "weapon-saber", name: "長刀", type: "weapon" as ItemType, rarity: "epic" as Rarity, price: 400, description: "快意恩仇，也快意完成任務。", icon: "刀", minLevel: 16 },
  { id: "weapon-ancient", name: "古劍", type: "weapon" as ItemType, rarity: "legendary" as Rarity, price: 900, description: "劍氣內斂，心法更深。", icon: "古", minLevel: 31 },
  { id: "focus-small", name: "經驗丹（小）", type: "consumable" as ItemType, rarity: "rare" as Rarity, price: 50, description: "一小時內任務經驗增加 10%。", icon: "丹", imageUrl: "/manus-storage/jianghu-item-elixir_90cf9a1d.png", minLevel: 1, effect: 0.1, duration: 3600000 },
  { id: "focus-large", name: "經驗丹（大）", type: "consumable" as ItemType, rarity: "epic" as Rarity, price: 80, description: "兩小時內任務經驗增加 20%。", icon: "大", minLevel: 1, effect: 0.2, duration: 7200000 },
  { id: "streak-charm", name: "連擊保護符", type: "consumable" as ItemType, rarity: "legendary" as Rarity, price: 100, description: "保護一次未完成日的連擊。", icon: "符", minLevel: 1, effect: 1, duration: 86400000 },
] as const;

export const achievementDefinitions: AchievementDefinition[] = [
  { key: "diligent", name: "初出江湖", description: "累計完成任務", category: "diligence", icon: "初", tiers: [{ tier: "bronze", target: 10, rewardCoin: 30 }, { tier: "silver", target: 50, rewardCoin: 100 }, { tier: "gold", target: 200, rewardCoin: 300 }, { tier: "legendary", target: 500, rewardCoin: 800, rewardTitle: "百鍊成鋼", rewardItemId: "avatar-back-swordcase" }] },
  { key: "hard", name: "苦修者", description: "完成困難或史詩任務", category: "extreme", icon: "苦", tiers: [{ tier: "bronze", target: 5, rewardCoin: 50 }, { tier: "silver", target: 20, rewardCoin: 150 }, { tier: "gold", target: 60, rewardCoin: 400 }, { tier: "legendary", target: 150, rewardCoin: 1000, rewardTitle: "苦修宗師" }] },
  { key: "daily", name: "一日三修", description: "單日完成任務數", category: "diligence", icon: "三", tiers: [{ tier: "bronze", target: 3, rewardCoin: 30 }, { tier: "silver", target: 10, rewardCoin: 100 }, { tier: "gold", target: 20, rewardCoin: 250 }, { tier: "legendary", target: 40, rewardCoin: 600 }] },
  { key: "wisdom", name: "勤學不倦", description: "完成悟性任務", category: "diligence", icon: "學", tiers: [{ tier: "bronze", target: 5, rewardCoin: 40 }, { tier: "silver", target: 20, rewardCoin: 120 }, { tier: "gold", target: 60, rewardCoin: 300 }, { tier: "legendary", target: 120, rewardCoin: 700, rewardTitle: "學海無涯" }] },
  { key: "all_rounder", name: "四象俱全", description: "四大屬性總和", category: "extreme", icon: "全", tiers: [{ tier: "bronze", target: 40, rewardCoin: 40 }, { tier: "silver", target: 80, rewardCoin: 120 }, { tier: "gold", target: 140, rewardCoin: 350 }, { tier: "legendary", target: 220, rewardCoin: 900 }] },
  { key: "collector", name: "初窺門徑", description: "擁有不同道具", category: "collection", icon: "藏", tiers: [{ tier: "bronze", target: 3, rewardCoin: 50 }, { tier: "silver", target: 6, rewardCoin: 150 }, { tier: "gold", target: 9, rewardCoin: 350 }, { tier: "legendary", target: 12, rewardCoin: 900, rewardTitle: "萬物皆藏" }] },
  { key: "adventure", name: "江湖奇遇", description: "觸發奇遇事件", category: "event", icon: "遇", tiers: [{ tier: "bronze", target: 1, rewardCoin: 30 }, { tier: "silver", target: 5, rewardCoin: 120 }, { tier: "gold", target: 20, rewardCoin: 350 }, { tier: "legendary", target: 50, rewardCoin: 800 }] },
  { key: "streak", name: "門派模範", description: "連擊天數", category: "diligence", icon: "模", tiers: [{ tier: "bronze", target: 3, rewardCoin: 30 }, { tier: "silver", target: 7, rewardCoin: 100 }, { tier: "gold", target: 14, rewardCoin: 250 }, { tier: "legendary", target: 30, rewardCoin: 700, rewardTitle: "持之以恆" }] },
  { key: "total_tasks", name: "百事可成", description: "累計完成任務", category: "diligence", icon: "成", tiers: [{ tier: "bronze", target: 25, rewardCoin: 40 }, { tier: "silver", target: 100, rewardCoin: 120 }, { tier: "gold", target: 300, rewardCoin: 300 }, { tier: "legendary", target: 800, rewardCoin: 900, rewardTitle: "百事可成" }] },
  { key: "epic_tasks", name: "破境之人", description: "完成史詩任務", category: "extreme", icon: "破", tiers: [{ tier: "bronze", target: 1, rewardCoin: 50 }, { tier: "silver", target: 5, rewardCoin: 150 }, { tier: "gold", target: 20, rewardCoin: 350 }, { tier: "legendary", target: 50, rewardCoin: 900, rewardTitle: "破境之人" }] },
  { key: "all_attribute_tasks", name: "四象初成", description: "完成不同屬性的任務種類", category: "extreme", icon: "象", tiers: [{ tier: "bronze", target: 1, rewardCoin: 30 }, { tier: "silver", target: 2, rewardCoin: 70 }, { tier: "gold", target: 3, rewardCoin: 150 }, { tier: "legendary", target: 4, rewardCoin: 300, rewardTitle: "四象初成" }] },
  { key: "morning_tasks", name: "晨鐘習武", description: "早上八時前完成任務", category: "diligence", icon: "晨", tiers: [{ tier: "bronze", target: 3, rewardCoin: 40, rewardItemId: "avatar-headband-blue" }, { tier: "silver", target: 10, rewardCoin: 120 }, { tier: "gold", target: 30, rewardCoin: 280 }, { tier: "legendary", target: 100, rewardCoin: 700, rewardTitle: "晨型俠客", rewardItemId: "avatar-back-cape-plain" }] },
  { key: "weekend_tasks", name: "週末不荒", description: "週末完成任務", category: "diligence", icon: "週", tiers: [{ tier: "bronze", target: 5, rewardCoin: 40 }, { tier: "silver", target: 20, rewardCoin: 120 }, { tier: "gold", target: 50, rewardCoin: 300 }, { tier: "legendary", target: 100, rewardCoin: 800, rewardTitle: "週末俠客" }] },
  { key: "weapons_collected", name: "百兵之主", description: "收集不同武器", category: "collection", icon: "兵", tiers: [{ tier: "bronze", target: 2, rewardCoin: 50 }, { tier: "silver", target: 4, rewardCoin: 140 }, { tier: "gold", target: 6, rewardCoin: 320 }, { tier: "legendary", target: 8, rewardCoin: 850, rewardTitle: "百兵之主" }] },
  { key: "outfits_collected", name: "千面俠客", description: "收集不同服飾", category: "collection", icon: "衣", tiers: [{ tier: "bronze", target: 2, rewardCoin: 50 }, { tier: "silver", target: 4, rewardCoin: 140 }, { tier: "gold", target: 6, rewardCoin: 320 }, { tier: "legendary", target: 8, rewardCoin: 850, rewardTitle: "千面俠客" }] },
];

const initialTasks: Task[] = [
  { id: "t1", title: "整理今日三件要事", description: "先理清方向，再出招。", type: "inner", difficulty: "normal", due: "今天 18:00", completed: false, createdAt: new Date().toISOString() },
  { id: "t2", title: "快走 20 分鐘", description: "行走江湖，筋骨不可懈怠。", type: "body", difficulty: "normal", due: "今天 20:00", completed: false, createdAt: new Date().toISOString() },
  { id: "t3", title: "閱讀專業文章", description: "每日一頁，積少成多。", type: "wisdom", difficulty: "hard", due: "今天 22:00", completed: false, createdAt: new Date().toISOString() },
  { id: "t4", title: "回覆重要訊息", description: "維繫一段關係，也是江湖修煉。", type: "reputation", difficulty: "normal", due: "今天 19:30", completed: false, createdAt: new Date().toISOString() },
  { id: "t5", title: "深度工作 45 分鐘", description: "關閉干擾，讓內力集中於一處。", type: "inner", difficulty: "hard", due: "今天 21:00", completed: false, createdAt: new Date().toISOString() },
];

const initialAvatarUserItems: UserItem[] = ["avatar-hair-black-topknot", "avatar-outfit-cloth", "avatar-weapon-wood"].map((item_id) => ({ user_id: "local-jianghu-player", item_id, quantity: 1, owned: true, acquired_at: new Date().toISOString() }));
const buildUserEquipment = (equipment: AvatarEquipment): UserEquipment[] => (Object.keys(equipment) as AvatarSlot[]).map((slot) => ({ user_id: "local-jianghu-player", slot, item_id: equipment[slot], equipped_at: equipment[slot] ? new Date().toISOString() : null }));
const initial: GameState = { onboarded: false, nickname: "雲遊少俠", sect: "效率派", level: 3, exp: 185, coin: 420, streak: 6, attributes: { inner: 18, body: 12, wisdom: 20, reputation: 9 }, tasks: initialTasks, history: [], ownedItems: ["clothing-cloth", "weapon-wood"], equippedItem: "clothing-cloth", inventory: [{ id: "focus-small", quantity: 1, acquiredAt: new Date().toISOString() }], userItems: initialAvatarUserItems, avatarEquipment: defaultAvatarEquipment, userEquipment: buildUserEquipment(defaultAvatarEquipment), userProfile: profileFromEquipment(defaultAvatarEquipment), achievementLevels: {}, titles: [], adventureCount: 0, loginDays: 1, lastActiveDate: new Date().toDateString() };
const KEY = "jianghu-xiulian-state-v2";
const expFor = (d: Difficulty) => ({ normal: 10, hard: 25, epic: 50 }[d]);
const attrFor = (d: Difficulty) => ({ normal: 1, hard: 3, epic: 5 }[d]);
const tierLabel: Record<AchievementTier, string> = { bronze: "銅", silver: "銀", gold: "金", legendary: "傳說" };
export const tierColor: Record<AchievementTier, string> = { bronze: "#B87943", silver: "#7D8C8B", gold: "#B38A38", legendary: "#9C3B35" };
export const levelTitle = (level: number) => level >= 51 ? "武林盟主" : level >= 31 ? "武學宗師" : level >= 16 ? "江湖大俠" : level >= 6 ? "門派弟子" : "初出茅廬";
export const characterArt = (level: number) => level >= 31 ? "/manus-storage/jianghu-character-grandmaster_e7567309.png" : level >= 16 ? "/manus-storage/jianghu-character-hero_6ab59adf.png" : level >= 6 ? "/manus-storage/jianghu-character-disciple_7f575a76.png" : "https://files.manuscdn.com/user_upload_by_module/session_file/310519663882326856/UOXqDNTffLDZCxnH.png";
export const itemById = (id: string) => itemCatalog.find((item) => item.id === id);
export const taskArt: Record<TaskType, string> = {
  inner: "/manus-storage/task-inner-power_607ae0b6.png",
  body: "/manus-storage/task-body-training_a4067155.png",
  wisdom: "/manus-storage/task-wisdom_bd69aa52.png",
  reputation: "/manus-storage/task-reputation_1d9674e5.png",
};
export const achievementArt: Record<string, string> = {
  diligent: "/manus-storage/achievement-diligent_72b4d760.png",
  hard: "/manus-storage/achievement-hard_90781ebd.png",
  daily: "/manus-storage/achievement-daily_240af2d1.png",
  wisdom: "/manus-storage/achievement-wisdom_47e3ab0b.png",
  all_rounder: "/manus-storage/achievement-all-rounder_ada3ae6a.png",
  collector: "/manus-storage/achievement-collector_11cacb31.png",
  adventure: "/manus-storage/achievement-adventure_dfb05fb1.png",
  streak: "/manus-storage/achievement-streak_494d99f2.png",
  total_tasks: "/manus-storage/achievement-diligent_72b4d760.png",
  epic_tasks: "/manus-storage/achievement-hard_90781ebd.png",
  all_attribute_tasks: "/manus-storage/achievement-all-rounder_ada3ae6a.png",
  morning_tasks: "/manus-storage/achievement-diligent_72b4d760.png",
  weekend_tasks: "/manus-storage/achievement-streak_494d99f2.png",
  weapons_collected: "/manus-storage/achievement-collector_11cacb31.png",
  outfits_collected: "/manus-storage/achievement-collector_11cacb31.png",
};

export function achievementProgress(key: string, game: Pick<GameState, "history" | "streak" | "attributes" | "inventory" | "ownedItems" | "userItems" | "adventureCount" | "achievementLevels">) {
  const today = new Date().toDateString();
  const definition = achievementDefinitions.find((item) => item.key === key);
  if (!definition) return 0;
  if (key === "diligent" || key === "total_tasks") return game.history.length;
  if (key === "hard") return game.history.filter((task) => task.difficulty !== "normal").length;
  if (key === "epic_tasks") return game.history.filter((task) => task.difficulty === "epic").length;
  if (key === "all_attribute_tasks") return new Set(game.history.map((task) => task.type)).size;
  if (key === "morning_tasks") return game.history.filter((task) => task.completedAt && new Date(task.completedAt).getHours() < 8).length;
  if (key === "weekend_tasks") return game.history.filter((task) => task.completedAt && [0, 6].includes(new Date(task.completedAt).getDay())).length;
  if (key === "daily") return game.history.filter((task) => task.completedAt && new Date(task.completedAt).toDateString() === today).length;
  if (key === "wisdom") return game.history.filter((task) => task.type === "wisdom").length;
  if (key === "all_rounder") return Object.values(game.attributes).reduce((sum, value) => sum + value, 0);
  if (key === "collector") return new Set([...game.ownedItems, ...game.inventory.map((item) => item.id), ...(game.userItems ?? []).filter((item) => item.owned).map((item) => item.item_id)]).size;
  if (key === "weapons_collected") return itemCatalog.filter((item) => item.type === "weapon" && game.ownedItems.includes(item.id)).length;
  if (key === "outfits_collected") return itemCatalog.filter((item) => item.type === "clothing" && game.ownedItems.includes(item.id)).length;
  if (key === "adventure") return game.adventureCount;
  if (key === "streak") return game.streak;
  return 0;
}
export function isAchievementUnlocked(key: string, game: Parameters<typeof achievementProgress>[1]) { const level = game.achievementLevels?.[key] ?? 0; const progress = achievementProgress(key, game); const definition = achievementDefinitions.find((item) => item.key === key); return definition ? level >= definition.tiers.length || progress >= definition.tiers[level]?.target : false; }
export { tierLabel };

const StoreContext = createContext<Store | null>(null);
export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<GameState>(initial);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => { let active = true; AsyncStorage.getItem(KEY).then((raw) => { if (!active || !raw) return; try { const saved = JSON.parse(raw) as Partial<GameState>; const avatarEquipment = { ...defaultAvatarEquipment, ...(saved.avatarEquipment ?? {}) }; setState({ ...initial, ...saved, tasks: Array.isArray(saved.tasks) ? saved.tasks : initial.tasks, history: Array.isArray(saved.history) ? saved.history : [], inventory: Array.isArray(saved.inventory) ? saved.inventory : [], userItems: Array.isArray(saved.userItems) ? saved.userItems : initial.userItems, avatarEquipment, userEquipment: Array.isArray(saved.userEquipment) ? saved.userEquipment : buildUserEquipment(avatarEquipment), userProfile: saved.userProfile ?? profileFromEquipment(avatarEquipment), achievementLevels: saved.achievementLevels ?? {}, ownedItems: Array.isArray(saved.ownedItems) ? saved.ownedItems : initial.ownedItems }); } catch { /* keep initial */ } }).catch(() => undefined).finally(() => { if (active) setHydrated(true); }); return () => { active = false; }; }, []);
  useEffect(() => { if (hydrated) AsyncStorage.setItem(KEY, JSON.stringify(state)).catch(() => undefined); }, [state, hydrated]);
  const value = useMemo<Store>(() => {
    const mutate = (fn: (s: GameState) => GameState) => setState((s) => fn({ ...s, attributes: { ...s.attributes }, tasks: [...s.tasks], history: [...s.history], ownedItems: [...s.ownedItems], inventory: [...s.inventory], userItems: [...s.userItems], avatarEquipment: { ...s.avatarEquipment }, userEquipment: [...s.userEquipment], userProfile: { ...s.userProfile }, achievementLevels: { ...s.achievementLevels }, titles: [...s.titles] }));
    const setAvatarEquipment = (s: GameState, avatarEquipment: AvatarEquipment): GameState => ({ ...s, avatarEquipment, userEquipment: buildUserEquipment(avatarEquipment), userProfile: profileFromEquipment(avatarEquipment) });
    const grantAchievements = (s: GameState) => { let coinBonus = 0; const unlocks: string[] = []; const itemUnlocks: string[] = []; const levels = { ...s.achievementLevels }; const titles = [...s.titles]; const userItems = [...s.userItems]; achievementDefinitions.forEach((definition) => { const progress = achievementProgress(definition.key, { ...s, userItems, achievementLevels: levels }); let level = levels[definition.key] ?? 0; while (level < definition.tiers.length && progress >= definition.tiers[level].target) { const tier = definition.tiers[level]; level += 1; coinBonus += tier.rewardCoin; unlocks.push(`${definition.name} · ${tierLabel[tier.tier]}`); if (tier.rewardTitle && !titles.includes(tier.rewardTitle)) titles.push(tier.rewardTitle); const rewardItem = avatarItemById(tier.rewardItemId); if (rewardItem && !userItems.some((item) => item.item_id === rewardItem.id && item.owned)) { userItems.push({ user_id: "local-jianghu-player", item_id: rewardItem.id, quantity: 1, owned: true, acquired_at: new Date().toISOString() }); itemUnlocks.push(rewardItem.name); } } levels[definition.key] = level; }); return { ...s, coin: s.coin + coinBonus, userItems, achievementLevels: levels, titles, _unlockEvents: unlocks, _itemUnlockEvents: itemUnlocks } as GameState & { _unlockEvents?: string[]; _itemUnlockEvents?: string[] }; };
    return { ...state,
      completeTask: (id) => { let reward: Reward | null = null; mutate((s) => { const task = s.tasks.find((item) => item.id === id); if (!task || task.completed) return s; const activeBoost = s.inventory.find((item) => item.id.startsWith("focus-") && item.activeUntil && new Date(item.activeUntil).getTime() > Date.now()); const boost = activeBoost ? (itemById(activeBoost.id)?.effect ?? 0) : 0; const base = expFor(task.difficulty); const bonus = s.streak >= 15 ? 1.3 : s.streak >= 8 ? 1.2 : s.streak >= 4 ? 1.1 : 1; const surprise = Math.random() < 0.1 ? (Math.random() < 0.5 ? "奇遇：雙倍經驗" : "奇遇：江湖幣 +20") : null; const earnedExp = Math.round(base * bonus * (1 + boost) * (surprise === "奇遇：雙倍經驗" ? 2 : 1)); const earnedCoin = 10 + (task.difficulty === "hard" ? 10 : task.difficulty === "epic" ? 25 : 0) + (surprise === "奇遇：江湖幣 +20" ? 20 : 0); const completedAt = new Date().toISOString(); const adventureCount = s.adventureCount + (surprise ? 1 : 0); const nextExp = s.exp + earnedExp; const needed = s.level * 100; const leveledUp = nextExp >= needed; const nextAttributes = { ...s.attributes, [task.type]: s.attributes[task.type] + attrFor(task.difficulty) };
        const next = grantAchievements({ ...s, tasks: s.tasks.map((item) => item.id === id ? { ...item, completed: true, completedAt } : item), history: [{ ...task, completed: true, completedAt }, ...s.history].slice(0, 100), exp: leveledUp ? nextExp - needed : nextExp, level: leveledUp ? s.level + 1 : s.level, coin: s.coin + earnedCoin, streak: s.streak + 1, attributes: nextAttributes, adventureCount }); const unlocks = (next as GameState & { _unlockEvents?: string[] })._unlockEvents ?? []; const itemUnlocks = (next as GameState & { _itemUnlockEvents?: string[] })._itemUnlockEvents ?? []; delete (next as GameState & { _unlockEvents?: string[] })._unlockEvents; delete (next as GameState & { _itemUnlockEvents?: string[] })._itemUnlockEvents; reward = { exp: earnedExp, attribute: attrFor(task.difficulty), coin: earnedCoin, type: task.type, surprise, leveledUp, achievementUnlocks: unlocks, itemUnlocks }; return next; }); return reward; },
      addTask: (task) => mutate((s) => ({ ...s, tasks: [{ ...task, id: Date.now().toString(), createdAt: new Date().toISOString(), completed: false }, ...s.tasks] })),
      updateTask: (id, patch) => mutate((s) => ({ ...s, tasks: s.tasks.map((t) => t.id === id ? { ...t, ...patch } : t) })),
      deleteTask: (id) => mutate((s) => ({ ...s, tasks: s.tasks.filter((t) => t.id !== id) })),
      buyItem: (id) => { let ok = false; mutate((s) => { const product = itemById(id); if (!product || s.coin < product.price || s.level < product.minLevel || (product.type !== "consumable" && s.ownedItems.includes(id))) return s; ok = true; if (product.type === "consumable") { const existing = s.inventory.find((item) => item.id === id); return { ...s, coin: s.coin - product.price, inventory: existing ? s.inventory.map((item) => item.id === id ? { ...item, quantity: item.quantity + 1 } : item) : [...s.inventory, { id, quantity: 1, acquiredAt: new Date().toISOString() }] }; } return { ...s, coin: s.coin - product.price, ownedItems: [...s.ownedItems, id] }; }); return ok; },
      buyAvatarItem: (id) => { let ok = false; mutate((s) => { const product = avatarItemById(id); if (!product || s.coin < product.price_coin || s.userItems.some((item) => item.item_id === id && item.owned)) return s; ok = true; return { ...s, coin: s.coin - product.price_coin, userItems: [...s.userItems, { user_id: "local-jianghu-player", item_id: id, quantity: 1, owned: true, acquired_at: new Date().toISOString() }] }; }); return ok; },
      equipItem: (id) => mutate((s) => s.ownedItems.includes(id) ? { ...s, equippedItem: id } : s),
      equipAvatarItem: (id) => mutate((s) => { const product = avatarItemById(id); if (!product || !s.userItems.some((item) => item.item_id === id && item.owned)) return s; return setAvatarEquipment(s, { ...s.avatarEquipment, [product.type]: id }); }),
      unequipAvatarSlot: (slot) => mutate((s) => setAvatarEquipment(s, { ...s.avatarEquipment, [slot]: defaultAvatarEquipment[slot] })),
      useItem: (id) => { let ok = false; mutate((s) => { const item = s.inventory.find((entry) => entry.id === id && entry.quantity > 0); const product = itemById(id); if (!item || !product) return s; ok = true; if (id === "streak-charm") return { ...s, inventory: s.inventory.map((entry) => entry.id === id ? { ...entry, quantity: entry.quantity - 1, activeUntil: new Date(Date.now() + (product.duration ?? 86400000)).toISOString() } : entry) }; return { ...s, inventory: s.inventory.map((entry) => entry.id === id ? { ...entry, quantity: entry.quantity - 1, activeUntil: new Date(Date.now() + (product.duration ?? 3600000)).toISOString() } : entry) }; }); return ok; },
      finishOnboarding: (sect, taskTitle) => mutate((s) => ({ ...s, onboarded: true, sect, tasks: [{ id: Date.now().toString(), title: taskTitle, description: "你的第一場修煉，現在開始。", type: sect === "健康派" ? "body" : sect === "學習派" ? "wisdom" : sect === "社交派" ? "reputation" : "inner", difficulty: "normal", due: "今天 21:00", completed: false, createdAt: new Date().toISOString() }, ...s.tasks] })),
      reset: () => { const resetState = { ...initial, tasks: initialTasks.map((task) => ({ ...task })), inventory: [{ id: "focus-small", quantity: 1, acquiredAt: new Date().toISOString() }] }; setState(resetState); AsyncStorage.setItem(KEY, JSON.stringify(resetState)).catch(() => undefined); },
    };
  }, [state]);
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}
export function useGame() { const value = useContext(StoreContext); if (!value) throw new Error("useGame must be used inside GameProvider"); return value; }
export const typeLabel: Record<TaskType, string> = { inner: "內力", body: "筋骨", wisdom: "悟性", reputation: "聲望" };
export const typeIcon: Record<TaskType, string> = { inner: "☯", body: "行", wisdom: "悟", reputation: "義" };
export const difficultyLabel: Record<Difficulty, string> = { normal: "普通", hard: "困難", epic: "史詩" };
