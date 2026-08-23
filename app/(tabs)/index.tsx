import { useEffect, useMemo, useRef, useState } from "react";
import { Alert, Animated, FlatList, Image, Modal, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";

import { CharacterAvatar } from "@/components/character-avatar";
import { JianghuPageAtmosphere, JianghuPaperPanel, jianghuColors } from "@/components/jianghu-ui";
import { ScreenContainer } from "@/components/screen-container";
import { customHeroBanner } from "@/lib/custom-assets";
import { difficultyLabel, levelTitle, taskArt, typeIcon, typeLabel, useGame, type Attributes, type Difficulty, type Reward, type Task, type TaskType } from "@/lib/game-store";

const filters: { key: "all" | TaskType; label: string }[] = [
  { key: "all", label: "全部" }, { key: "inner", label: "內力" }, { key: "body", label: "筋骨" }, { key: "wisdom", label: "悟性" }, { key: "reputation", label: "聲望" },
];

const taskColors: Record<TaskType, string> = { inner: "#329B97", body: "#D89538", wisdom: "#7866B8", reputation: "#C94D42" };
const taskSeals: Record<TaskType, string> = { inner: "氣", body: "力", wisdom: "悟", reputation: "名" };
const attributes: { key: keyof Attributes; label: string; seal: string; color: string }[] = [
  { key: "inner", label: "內力", seal: "氣", color: "#5CC5BB" }, { key: "body", label: "筋骨", seal: "力", color: "#F0B35E" }, { key: "wisdom", label: "悟性", seal: "悟", color: "#A696DD" }, { key: "reputation", label: "聲望", seal: "名", color: "#EB8D7A" },
];

export default function HomeScreen() {
  const game = useGame();
  const [filter, setFilter] = useState<"all" | TaskType>("all");
  const [reward, setReward] = useState<Reward | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const rewardFlight = useRef(new Animated.Value(0)).current;
  const visibleTasks = useMemo(() => game.tasks.filter((task) => filter === "all" || task.type === filter), [game.tasks, filter]);
  const expProgress = Math.min(game.exp / Math.max(game.level * 100, 1), 1);
  const completed = game.tasks.filter((task) => task.completed).length;
  const taskProgress = game.tasks.length ? completed / game.tasks.length : 0;

  const completeTask = (task: Task) => {
    const result = game.completeTask(task.id);
    if (!result) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => undefined);
    rewardFlight.setValue(0);
    Animated.timing(rewardFlight, { toValue: 1, duration: 720, useNativeDriver: true }).start();
    setReward(result);
  };

  return (
    <ScreenContainer containerClassName="bg-[#F4F1E7]" className="px-4">
      <View style={styles.page}>
        <JianghuPageAtmosphere />
        <FlatList
          data={visibleTasks}
          keyExtractor={(item) => item.id}
          style={styles.list}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={
            <>
              <View style={styles.hero}>
                <Image source={customHeroBanner} style={StyleSheet.absoluteFillObject} resizeMode="cover" />
                <View style={styles.heroShade} />
                <View style={styles.heroTextShade} />
                <CharacterAvatar equipment={game.avatarEquipment} height={298} style={styles.heroAvatar} accessibilityLabel="融入山門名帖的目前角色外觀" />
                <View style={styles.heroCopy}>
                  <View style={styles.heroMeta}>
                    <Text style={styles.heroKicker}>江湖修煉手札 · 今日名帖</Text>
                    <View style={styles.coinPill}><Text style={styles.coinMark}>◈</Text><Text style={styles.coinText}>{game.coin}</Text></View>
                  </View>
                  <Text style={styles.heroName}>早安，{game.nickname}</Text>
                  <Text style={styles.heroSect}>{game.sect} · 門派弟子</Text>
                  <Text style={styles.heroRealm}>{levelTitle(game.level)}</Text>
                  <Text style={styles.heroLevel}>境界 Lv.{game.level}</Text>
                  <View style={styles.expTrack}><View style={[styles.expFill, { width: `${expProgress * 100}%` }]} /></View>
                  <Text style={styles.expText}>修為 {game.exp} / {game.level * 100}</Text>
                  <View style={styles.streak}><Text style={styles.streakSeal}>連</Text><Text style={styles.streakText}>連續修煉 {game.streak} 日</Text></View>
                </View>
                <View style={styles.attributeBelt}>
                  {attributes.map((attribute) => {
                    const value = game.attributes[attribute.key];
                    return <View key={attribute.key} style={styles.attributeItem}>
                      <View style={[styles.attributeSeal, { borderColor: `${attribute.color}B8` }]}><Text style={[styles.attributeSealText, { color: attribute.color }]}>{attribute.seal}</Text></View>
                      <View style={styles.attributeTextRow}><Text style={styles.attributeLabel}>{attribute.label}</Text><Text style={styles.attributeValue}>{value}</Text></View>
                      <View style={styles.attributeTrack}><View style={[styles.attributeFill, { width: `${Math.min(value / 2, 100)}%`, backgroundColor: attribute.color }]} /></View>
                    </View>;
                  })}
                </View>
              </View>

              <View style={styles.sceneBridge}><View style={styles.bridgeMist} /><Text style={styles.bridgeText}>山門晨霧 · 今日修行自此展開</Text><View style={styles.bridgeMist} /></View>

              <JianghuPaperPanel style={styles.taskbook}>
                <View style={styles.taskbookHeader}>
                  <View style={styles.taskbookSeal}><Text style={styles.taskbookSealText}>令</Text></View>
                  <View style={styles.taskbookCopy}><Text style={styles.taskbookKicker}>門派任務簿</Text><Text style={styles.taskbookTitle}>今日江湖試煉</Text></View>
                  <View style={styles.taskbookCount}><Text style={styles.taskbookCountValue}>{completed} / {game.tasks.length}</Text><Text style={styles.taskbookCountText}>項完成</Text></View>
                </View>
                <View style={styles.overallTrack}><View style={[styles.overallFill, { width: `${taskProgress * 100}%` }]} /></View>
                <Text style={styles.progressHint}>{completed === game.tasks.length && game.tasks.length > 0 ? "今日試煉盡數完成，功力精進。" : "完成試煉，修為與江湖幣將回饋至名帖。"}</Text>
                <View style={styles.filters}>{filters.map((item) => <Pressable key={item.key} onPress={() => setFilter(item.key)} style={({ pressed }) => [styles.filter, filter === item.key && styles.filterActive, pressed && styles.pressed]}><Text style={[styles.filterSeal, filter === item.key && styles.filterSealActive]}>{item.key === "all" ? "令" : taskSeals[item.key]}</Text><Text style={[styles.filterText, filter === item.key && styles.filterTextActive]}>{item.label}</Text></Pressable>)}</View>
                <View style={styles.listGuide}><Text style={styles.listGuideText}>長按試煉可刪除，點擊任務可編輯。</Text><Text style={styles.listGuideMark}>劍印</Text></View>
              </JianghuPaperPanel>
              <Text style={styles.taskListLabel}>今日待辦</Text>
            </>
          }
          renderItem={({ item, index }) => <TaskRow task={item} first={index === 0} last={index === visibleTasks.length - 1} onComplete={() => completeTask(item)} onEdit={() => router.push({ pathname: "/task", params: { id: item.id } })} onDelete={() => Alert.alert("刪除試煉", "確定要刪除這項任務嗎？", [{ text: "取消" }, { text: "刪除", style: "destructive", onPress: () => game.deleteTask(item.id) }])} />}
          ListEmptyComponent={<JianghuPaperPanel style={styles.empty}><Text style={styles.emptySeal}>閒</Text><Text style={styles.emptyTitle}>今日無事，正好修煉</Text><Text style={styles.emptyText}>接取一項新的江湖試煉，為名帖添上一筆修為。</Text></JianghuPaperPanel>}
        />
        <Animated.View pointerEvents="none" style={[styles.rewardFlight, { opacity: rewardFlight.interpolate({ inputRange: [0, 0.18, 0.82, 1], outputRange: [0, 1, 1, 0] }), transform: [{ translateY: rewardFlight.interpolate({ inputRange: [0, 1], outputRange: [210, -122] }) }, { scale: rewardFlight.interpolate({ inputRange: [0, 0.4, 1], outputRange: [0.7, 1.15, 0.9] }) }] }]}><Text style={styles.rewardFlightText}>✦ 修為 + 江湖幣</Text></Animated.View>
        <Pressable style={({ pressed }) => [styles.fab, pressed && styles.fabPressed]} onPress={() => setShowAdd(true)}><View style={styles.fabSeal}><Text style={styles.fabSealText}>令</Text></View><Text style={styles.fabLabel}>接取試煉</Text></Pressable>
        <AddTaskModal visible={showAdd} onClose={() => setShowAdd(false)} />
        <RewardModal reward={reward} onClose={() => setReward(null)} />
      </View>
    </ScreenContainer>
  );
}

function TaskRow({ task, first, last, onComplete, onEdit, onDelete }: { task: Task; first: boolean; last: boolean; onComplete: () => void; onEdit: () => void; onDelete: () => void }) {
  return <Pressable onPress={onEdit} onLongPress={onDelete} style={({ pressed }) => [styles.taskRow, first && styles.taskRowFirst, last && styles.taskRowLast, task.completed && styles.taskRowDone, pressed && styles.pressed]}>
    <View style={[styles.taskSeal, { borderColor: `${taskColors[task.type]}AA` }]}><Image source={{ uri: taskArt[task.type] }} style={styles.taskArt} resizeMode="contain" /><Text style={[styles.taskFallback, { color: taskColors[task.type] }]}>{typeIcon[task.type]}</Text></View>
    <View style={styles.taskCopy}><View style={styles.taskTop}><Text numberOfLines={1} style={[styles.taskTitle, task.completed && styles.completed]}>{task.title}</Text><Text style={[styles.difficulty, task.difficulty === "epic" && styles.epicDifficulty]}>{difficultyLabel[task.difficulty]}</Text></View><Text style={styles.taskDescription}>{typeLabel[task.type]} · {task.due}</Text></View>
    {task.completed ? <View style={styles.doneSeal}><Text style={styles.doneSealText}>成</Text></View> : <Pressable style={({ pressed }) => [styles.completeButton, pressed && styles.pressed]} onPress={(event) => { event.stopPropagation(); onComplete(); }}><Text style={styles.completeText}>完成</Text></Pressable>}
  </Pressable>;
}

function AddTaskModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const game = useGame(); const [title, setTitle] = useState(""); const [type, setType] = useState<TaskType>("inner"); const [difficulty, setDifficulty] = useState<Difficulty>("normal");
  const save = () => { if (!title.trim()) return; game.addTask({ title: title.trim(), description: "新的修煉目標", type, difficulty, due: "今天 21:00" }); setTitle(""); onClose(); };
  return <Modal visible={visible} transparent animationType="slide"><View style={styles.modalBackdrop}><JianghuPaperPanel style={styles.sheet}><Text style={styles.sheetKicker}>接取江湖令</Text><Text style={styles.sheetTitle}>立下新的修煉之約</Text><TextInput placeholder="例如：完成專案簡報" placeholderTextColor="#8D958F" value={title} onChangeText={setTitle} style={styles.input} returnKeyType="done" onSubmitEditing={save} /><Text style={styles.inputLabel}>選擇武學令牌</Text><View style={styles.choiceRow}>{filters.slice(1).map((item) => <Pressable key={item.key} onPress={() => setType(item.key as TaskType)} style={({ pressed }) => [styles.choice, type === item.key && styles.choiceActive, pressed && styles.pressed]}><Text style={[styles.choiceSeal, type === item.key && styles.choiceSealActive]}>{taskSeals[item.key as TaskType]}</Text><Text style={type === item.key ? styles.choiceTextActive : styles.choiceText}>{item.label}</Text></Pressable>)}</View><Text style={styles.inputLabel}>試煉難度印章</Text><View style={styles.choiceRow}>{(["normal", "hard", "epic"] as Difficulty[]).map((item) => <Pressable key={item} onPress={() => setDifficulty(item)} style={({ pressed }) => [styles.difficultyChoice, difficulty === item && styles.difficultyChoiceActive, pressed && styles.pressed]}><Text style={difficulty === item ? styles.difficultyChoiceTextActive : styles.difficultyChoiceText}>{difficultyLabel[item]}</Text></Pressable>)}</View><View style={styles.sheetActions}><Pressable onPress={onClose} style={({ pressed }) => [styles.cancel, pressed && styles.pressed]}><Text style={styles.cancelText}>先不接取</Text></Pressable><Pressable onPress={save} style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}><Text style={styles.primaryText}>接取試煉</Text></Pressable></View></JianghuPaperPanel></View></Modal>;
}

function RewardModal({ reward, onClose }: { reward: Reward | null; onClose: () => void }) {
  return <Modal visible={Boolean(reward)} transparent animationType="fade"><View style={styles.modalBackdrop}><JianghuPaperPanel style={styles.rewardCard}><View style={styles.rewardSeal}><Text style={styles.rewardSealText}>{reward?.leveledUp ? "破" : "成"}</Text></View><Text style={styles.rewardKicker}>{reward?.leveledUp ? "境界突破" : "修煉大成"}</Text><Text style={styles.rewardTitle}>{reward?.leveledUp ? "恭喜突破新境界！" : "這一招，完成得漂亮"}</Text><Text style={styles.rewardBody}>修為 +{reward?.exp}　屬性 +{reward?.attribute}　江湖幣 +{reward?.coin}</Text>{reward?.surprise ? <Text style={styles.surprise}>{reward.surprise}</Text> : null}{reward?.achievementUnlocks.length ? <AchievementStampSequence unlocks={reward.achievementUnlocks} /> : null}{reward?.itemUnlocks.length ? <View style={styles.itemRewardBox}><Text style={styles.itemRewardTitle}>外觀獎勵已收入行囊</Text>{reward.itemUnlocks.map((item) => <Text key={item} style={styles.itemRewardText}>✦ {item} · 可至角色頁試穿與裝備</Text>)}</View> : null}<Pressable style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]} onPress={onClose}><Text style={styles.primaryText}>收下獎勵</Text></Pressable></JianghuPaperPanel></View></Modal>;
}

function AchievementStampSequence({ unlocks }: { unlocks: string[] }) {
  const landing = useRef(new Animated.Value(0)).current;
  const glow = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    landing.setValue(0);
    glow.setValue(0);
    const land = Animated.timing(landing, { toValue: 0.82, duration: 210, useNativeDriver: true });
    const settle = Animated.parallel([
      Animated.timing(landing, { toValue: 1, duration: 110, useNativeDriver: true }),
      Animated.sequence([
        Animated.timing(glow, { toValue: 1, duration: 90, useNativeDriver: true }),
        Animated.timing(glow, { toValue: 0, duration: 360, useNativeDriver: true }),
      ]),
    ]);
    land.start(({ finished }) => {
      if (!finished) return;
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => undefined);
      settle.start();
    });
    return () => { land.stop(); settle.stop(); };
  }, [glow, landing, unlocks]);

  return <View style={achievementStampStyles.wrap} accessibilityLabel={`已解鎖成就：${unlocks.join("、")}`}>
    <Animated.View pointerEvents="none" style={[achievementStampStyles.glow, { opacity: glow, transform: [{ scale: glow.interpolate({ inputRange: [0, 1], outputRange: [0.55, 1.25] }) }] }]} />
    <Animated.View style={[achievementStampStyles.stamp, { opacity: landing.interpolate({ inputRange: [0, 0.18, 1], outputRange: [0, 1, 1] }), transform: [{ translateY: landing.interpolate({ inputRange: [0, 0.82, 1], outputRange: [-44, 2, 0] }) }, { rotate: landing.interpolate({ inputRange: [0, 0.82, 1], outputRange: ["-9deg", "1.5deg", "0deg"] }) }, { scale: landing.interpolate({ inputRange: [0, 0.82, 1], outputRange: [1.35, 0.91, 1] }) }] }]}>
      <View style={achievementStampStyles.stampInner}><Text style={achievementStampStyles.stampGlyph}>功</Text><Text style={achievementStampStyles.stampCaption}>門派認證</Text></View>
    </Animated.View>
    <View style={achievementStampStyles.copy}><Text style={achievementStampStyles.title}>功德名冊已落印</Text><Text style={achievementStampStyles.subtitle}>新的江湖成就已記入門派名冊。</Text>{unlocks.map((unlock) => <Text key={unlock} style={achievementStampStyles.unlock}>✦ {unlock}</Text>)}</View>
  </View>;
}

const styles = StyleSheet.create({
  page: { flex: 1, position: "relative" }, list: { zIndex: 1 }, listContent: { paddingTop: 12, paddingBottom: 122 },
  hero: { minHeight: 312, borderRadius: 28, overflow: "hidden", backgroundColor: "#315F78", shadowColor: "#315F78", shadowOpacity: 0.28, shadowRadius: 14, shadowOffset: { width: 0, height: 6 }, elevation: 5 }, heroShade: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(18,56,62,0.18)" }, heroTextShade: { position: "absolute", top: 0, bottom: 0, left: 0, width: "70%", backgroundColor: "rgba(10,39,44,0.53)" }, heroAvatar: { position: "absolute", right: -8, bottom: -15, zIndex: 2 }, heroCopy: { width: "67%", padding: 18, paddingBottom: 68, zIndex: 3 }, heroMeta: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 6 }, heroKicker: { color: "#D6F7EC", fontSize: 9, lineHeight: 13, letterSpacing: 0.62, fontWeight: "900" }, coinPill: { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 8, paddingVertical: 5, borderRadius: 14, backgroundColor: "rgba(255,240,200,0.92)" }, coinMark: { color: jianghuColors.gold, fontSize: 12, lineHeight: 14 }, coinText: { color: "#8E5A1D", fontSize: 11, lineHeight: 14, fontWeight: "900" }, heroName: { color: "#FFFDF6", fontSize: 24, lineHeight: 30, fontWeight: "900", marginTop: 9 }, heroSect: { color: "#D6F7EC", fontSize: 11, lineHeight: 16, fontWeight: "800", marginTop: 3 }, heroRealm: { color: "#FFE7A0", fontSize: 17, lineHeight: 22, fontWeight: "900", marginTop: 7 }, heroLevel: { color: "#FFF0C8", fontSize: 10, lineHeight: 14, fontWeight: "900", marginTop: 2 }, expTrack: { height: 8, borderRadius: 10, overflow: "hidden", marginTop: 12, backgroundColor: "rgba(5,31,35,0.70)" }, expFill: { height: "100%", borderRadius: 10, backgroundColor: "#FFE18A" }, expText: { color: "#D5F7EB", fontSize: 10, lineHeight: 14, marginTop: 4 }, streak: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 10 }, streakSeal: { width: 20, height: 20, borderRadius: 10, borderWidth: 1, borderColor: "rgba(255,225,138,0.6)", color: "#FFE7A0", fontSize: 10, lineHeight: 18, fontWeight: "900", textAlign: "center" }, streakText: { color: "#FFF4C6", fontSize: 11, lineHeight: 15, fontWeight: "900" },
  attributeBelt: { position: "absolute", left: 12, right: 12, bottom: 12, minHeight: 58, borderRadius: 17, paddingHorizontal: 6, paddingVertical: 6, backgroundColor: "rgba(20,59,62,0.84)", borderWidth: 1, borderColor: "rgba(255,225,138,0.34)", flexDirection: "row", alignItems: "center", gap: 2, zIndex: 4 }, attributeItem: { flex: 1, alignItems: "center" }, attributeSeal: { width: 20, height: 20, borderRadius: 10, borderWidth: 1, alignItems: "center", justifyContent: "center" }, attributeSealText: { fontSize: 10, lineHeight: 13, fontWeight: "900" }, attributeTextRow: { flexDirection: "row", alignItems: "baseline", gap: 3, marginTop: 2 }, attributeLabel: { color: "#D7F7EF", fontSize: 9, lineHeight: 12, fontWeight: "800" }, attributeValue: { color: "#FFFFFF", fontSize: 11, lineHeight: 13, fontWeight: "900" }, attributeTrack: { width: "78%", height: 3, borderRadius: 4, overflow: "hidden", marginTop: 3, backgroundColor: "rgba(255,255,255,0.22)" }, attributeFill: { height: "100%", borderRadius: 4 },
  sceneBridge: { height: 41, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 }, bridgeMist: { flex: 1, height: 1, backgroundColor: "rgba(118,151,139,0.30)" }, bridgeText: { color: "#7D948B", fontSize: 10, lineHeight: 14, fontWeight: "800" },
  taskbook: { padding: 16 }, taskbookHeader: { flexDirection: "row", alignItems: "center", gap: 10 }, taskbookSeal: { width: 39, height: 39, borderRadius: 12, backgroundColor: "#315F78", borderWidth: 1, borderColor: "#B99459", alignItems: "center", justifyContent: "center" }, taskbookSealText: { color: "#FFE7A0", fontSize: 18, lineHeight: 23, fontWeight: "900" }, taskbookCopy: { flex: 1 }, taskbookKicker: { color: "#A86B35", fontSize: 10, lineHeight: 13, letterSpacing: 0.8, fontWeight: "900" }, taskbookTitle: { color: jianghuColors.ink, fontSize: 21, lineHeight: 27, fontWeight: "900", marginTop: 1 }, taskbookCount: { alignItems: "flex-end" }, taskbookCountValue: { color: jianghuColors.cinnabar, fontSize: 15, lineHeight: 19, fontWeight: "900" }, taskbookCountText: { color: jianghuColors.muted, fontSize: 9, lineHeight: 12, fontWeight: "800" }, overallTrack: { height: 7, borderRadius: 7, backgroundColor: "#E6DECA", overflow: "hidden", marginTop: 14 }, overallFill: { height: "100%", backgroundColor: jianghuColors.gold, borderRadius: 7 }, progressHint: { color: "#71817B", fontSize: 11, lineHeight: 16, marginTop: 7 }, filters: { flexDirection: "row", flexWrap: "wrap", gap: 7, marginTop: 14 }, filter: { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 9, paddingVertical: 7, borderRadius: 15, borderWidth: 1, borderColor: "#DAD2C2", backgroundColor: "#FFFDF6" }, filterActive: { backgroundColor: "#315F78", borderColor: "#315F78" }, filterSeal: { color: "#84958B", fontSize: 10, lineHeight: 13, fontWeight: "900" }, filterSealActive: { color: "#FFE7A0" }, filterText: { color: "#6E837C", fontSize: 11, lineHeight: 14, fontWeight: "800" }, filterTextActive: { color: "#FFFFFF" }, listGuide: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderTopWidth: 1, borderTopColor: "#E7E0D2", paddingTop: 10, marginTop: 14 }, listGuideText: { color: "#87968E", fontSize: 10, lineHeight: 14 }, listGuideMark: { color: "#B78344", fontSize: 10, lineHeight: 14, fontWeight: "900" }, taskListLabel: { color: "#55706B", fontSize: 11, lineHeight: 15, letterSpacing: 1, fontWeight: "900", marginTop: 15, marginBottom: 7, marginLeft: 10 },
  taskRow: { minHeight: 72, flexDirection: "row", alignItems: "center", gap: 11, paddingVertical: 12, paddingHorizontal: 13, backgroundColor: "rgba(255,253,246,0.93)", borderLeftWidth: 1, borderRightWidth: 1, borderBottomWidth: 1, borderColor: "#DED6C7" }, taskRowFirst: { borderTopWidth: 1, borderTopLeftRadius: 20, borderTopRightRadius: 20 }, taskRowLast: { borderBottomLeftRadius: 20, borderBottomRightRadius: 20 }, taskRowDone: { backgroundColor: "rgba(234,239,228,0.92)" }, taskSeal: { width: 42, height: 42, borderRadius: 15, backgroundColor: "#EAF1EA", borderWidth: 1, alignItems: "center", justifyContent: "center", overflow: "hidden" }, taskArt: { width: 31, height: 31 }, taskFallback: { position: "absolute", fontSize: 16, lineHeight: 19, fontWeight: "900" }, taskCopy: { flex: 1, minWidth: 0 }, taskTop: { flexDirection: "row", alignItems: "center", gap: 6 }, taskTitle: { flexShrink: 1, color: jianghuColors.ink, fontSize: 14, lineHeight: 19, fontWeight: "900" }, completed: { color: "#91A19A", textDecorationLine: "line-through" }, difficulty: { color: "#477561", backgroundColor: "#E1F0E4", paddingHorizontal: 6, paddingVertical: 3, borderRadius: 7, fontSize: 9, lineHeight: 12, fontWeight: "900" }, epicDifficulty: { color: "#7A4B72", backgroundColor: "#F0E0EC" }, taskDescription: { color: "#7C8E87", fontSize: 11, lineHeight: 15, marginTop: 4 }, completeButton: { borderRadius: 13, paddingHorizontal: 11, paddingVertical: 9, backgroundColor: jianghuColors.cinnabar, borderWidth: 1, borderColor: "#A83B32" }, completeText: { color: "#FFFFFF", fontSize: 11, lineHeight: 14, fontWeight: "900" }, doneSeal: { width: 32, height: 32, borderRadius: 16, borderWidth: 1, borderColor: "#78A685", alignItems: "center", justifyContent: "center", backgroundColor: "#E2F0E4" }, doneSealText: { color: "#4D8A5D", fontSize: 12, lineHeight: 16, fontWeight: "900" },
  fab: { position: "absolute", right: 18, bottom: 18, minHeight: 56, borderRadius: 20, paddingHorizontal: 15, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 7, backgroundColor: jianghuColors.cinnabar, borderWidth: 1, borderColor: "#96362E", shadowColor: jianghuColors.cinnabar, shadowOpacity: 0.28, shadowRadius: 9, elevation: 6, zIndex: 4 }, fabPressed: { transform: [{ scale: 0.96 }] }, fabSeal: { width: 26, height: 26, borderRadius: 9, borderWidth: 1, borderColor: "rgba(255,231,160,0.72)", alignItems: "center", justifyContent: "center" }, fabSealText: { color: "#FFE7A0", fontSize: 13, lineHeight: 17, fontWeight: "900" }, fabLabel: { color: "#FFFFFF", fontSize: 12, lineHeight: 15, fontWeight: "900" }, rewardFlight: { position: "absolute", alignSelf: "center", zIndex: 3, backgroundColor: "rgba(49,95,120,0.92)", borderRadius: 16, paddingHorizontal: 12, paddingVertical: 7, borderWidth: 1, borderColor: "#FFE7A0" }, rewardFlightText: { color: "#FFE7A0", fontSize: 11, lineHeight: 14, fontWeight: "900" },
  empty: { alignItems: "center", paddingVertical: 34, paddingHorizontal: 24 }, emptySeal: { width: 42, height: 42, borderRadius: 14, backgroundColor: "#E5EEE4", color: jianghuColors.jade, fontSize: 21, lineHeight: 41, fontWeight: "900", textAlign: "center" }, emptyTitle: { color: jianghuColors.ink, fontSize: 17, lineHeight: 23, fontWeight: "900", marginTop: 11 }, emptyText: { color: jianghuColors.muted, fontSize: 12, lineHeight: 18, textAlign: "center", marginTop: 6 },
  modalBackdrop: { flex: 1, backgroundColor: "rgba(26,50,49,0.58)", justifyContent: "center", alignItems: "center", padding: 22 }, sheet: { width: "100%", padding: 21 }, sheetKicker: { color: jianghuColors.cinnabar, fontSize: 11, lineHeight: 15, letterSpacing: 1, fontWeight: "900" }, sheetTitle: { color: jianghuColors.ink, fontSize: 23, lineHeight: 30, fontWeight: "900", marginTop: 4, marginBottom: 18 }, input: { borderWidth: 1, borderColor: "#D5CEBF", backgroundColor: "#F7F3E8", borderRadius: 15, padding: 14, color: jianghuColors.ink, fontSize: 15, lineHeight: 20 }, inputLabel: { color: "#52716D", fontWeight: "900", fontSize: 12, lineHeight: 16, marginTop: 18, marginBottom: 9 }, choiceRow: { flexDirection: "row", gap: 7, flexWrap: "wrap" }, choice: { flexDirection: "row", alignItems: "center", gap: 4, borderWidth: 1, borderColor: "#D9D1C0", borderRadius: 13, paddingHorizontal: 10, paddingVertical: 8, backgroundColor: "#FFFDF6" }, choiceActive: { backgroundColor: "#315F78", borderColor: "#315F78" }, choiceSeal: { color: "#7E948B", fontSize: 11, lineHeight: 14, fontWeight: "900" }, choiceSealActive: { color: "#FFE7A0" }, choiceText: { color: "#6E837C", fontSize: 11, lineHeight: 14, fontWeight: "800" }, choiceTextActive: { color: "#FFFFFF", fontSize: 11, lineHeight: 14, fontWeight: "900" }, difficultyChoice: { borderWidth: 1, borderColor: "#D9D1C0", borderRadius: 13, paddingHorizontal: 13, paddingVertical: 9, backgroundColor: "#FFFDF6" }, difficultyChoiceActive: { backgroundColor: "#C98536", borderColor: "#B16C22" }, difficultyChoiceText: { color: "#6E837C", fontSize: 11, lineHeight: 14, fontWeight: "800" }, difficultyChoiceTextActive: { color: "#FFFFFF", fontSize: 11, lineHeight: 14, fontWeight: "900" }, sheetActions: { flexDirection: "row", justifyContent: "flex-end", alignItems: "center", gap: 12, marginTop: 22 }, cancel: { paddingHorizontal: 8, paddingVertical: 12 }, cancelText: { color: "#71817B", fontSize: 12, lineHeight: 16, fontWeight: "800" }, primaryButton: { borderRadius: 15, paddingHorizontal: 20, paddingVertical: 13, backgroundColor: jianghuColors.cinnabar, borderWidth: 1, borderColor: "#A83B32" }, primaryText: { color: "#FFFFFF", fontSize: 12, lineHeight: 16, fontWeight: "900" },
  rewardCard: { width: "100%", padding: 25, alignItems: "center", borderWidth: 2, borderColor: "#E6C273" }, rewardSeal: { width: 52, height: 52, borderRadius: 17, borderWidth: 2, borderColor: "#D99632", backgroundColor: "#FFF1C9", alignItems: "center", justifyContent: "center" }, rewardSealText: { color: "#B07022", fontSize: 25, lineHeight: 31, fontWeight: "900" }, rewardKicker: { color: jianghuColors.cinnabar, fontSize: 11, lineHeight: 15, fontWeight: "900", letterSpacing: 1, marginTop: 11 }, rewardTitle: { color: jianghuColors.ink, fontSize: 21, lineHeight: 28, fontWeight: "900", marginTop: 5, textAlign: "center" }, rewardBody: { color: jianghuColors.muted, fontSize: 13, lineHeight: 19, marginTop: 10, textAlign: "center" }, surprise: { color: "#B07022", fontSize: 12, lineHeight: 17, fontWeight: "900", marginTop: 10 }, unlockBox: { alignSelf: "stretch", borderRadius: 15, padding: 12, marginTop: 14, backgroundColor: "#EEF4E8", borderWidth: 1, borderColor: "#D7E3D2" }, unlockTitle: { color: jianghuColors.jade, fontSize: 12, lineHeight: 16, fontWeight: "900" }, unlockText: { color: "#416A61", fontSize: 12, lineHeight: 17, fontWeight: "800", marginTop: 4 }, itemRewardBox: { alignSelf: "stretch", borderRadius: 15, padding: 12, marginTop: 10, backgroundColor: "#FFF4DF", borderWidth: 1, borderColor: "#E8C586" }, itemRewardTitle: { color: "#9A661B", fontSize: 12, lineHeight: 16, fontWeight: "900" }, itemRewardText: { color: "#795938", fontSize: 11, lineHeight: 16, fontWeight: "800", marginTop: 4 },
  pressed: { opacity: 0.82, transform: [{ scale: 0.985 }] },
});

const achievementStampStyles = StyleSheet.create({
  wrap: { alignSelf: "stretch", minHeight: 116, marginTop: 15, borderRadius: 17, overflow: "hidden", padding: 13, paddingLeft: 96, justifyContent: "center", backgroundColor: "#F5E9D2", borderWidth: 1, borderColor: "#DDB16A" },
  glow: { position: "absolute", left: 4, top: 11, width: 78, height: 78, borderRadius: 39, backgroundColor: "rgba(255, 213, 104, 0.58)" },
  stamp: { position: "absolute", left: 18, top: 22, width: 62, height: 62, borderRadius: 19, alignItems: "center", justifyContent: "center", backgroundColor: "#C94D42", borderWidth: 2, borderColor: "#A63830", shadowColor: "#8E2D28", shadowOpacity: 0.22, shadowRadius: 5, shadowOffset: { width: 0, height: 3 }, elevation: 3 },
  stampInner: { width: 48, height: 48, borderRadius: 14, borderWidth: 1, borderColor: "rgba(255,239,205,0.76)", alignItems: "center", justifyContent: "center" },
  stampGlyph: { color: "#FFF2CF", fontSize: 25, lineHeight: 28, fontWeight: "900" },
  stampCaption: { color: "#FFE7B3", fontSize: 7, lineHeight: 10, fontWeight: "900", letterSpacing: 0.3, marginTop: -1 },
  copy: { minWidth: 0 },
  title: { color: "#8F3D2F", fontSize: 13, lineHeight: 18, fontWeight: "900" },
  subtitle: { color: "#866A50", fontSize: 10, lineHeight: 15, marginTop: 2 },
  unlock: { color: "#714538", fontSize: 11, lineHeight: 16, fontWeight: "900", marginTop: 4 },
});
