import React, { useMemo, useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { CharacterAvatar } from "@/components/character-avatar";
import { JianghuPageAtmosphere, JianghuPaperPanel, JianghuSceneBanner, jianghuColors } from "@/components/jianghu-ui";
import { ScreenContainer } from "@/components/screen-container";
import { leaderboardBanner } from "@/lib/custom-assets";
import { useGame } from "@/lib/game-store";

const names = ["墨池聽雨", "青衫客", "不二劍", "小樓一夜", "雲遊少俠", "竹影清風", "南山客"];
const podiumTones = ["#C58A2B", "#8498A0", "#B87444"];

export default function LeaderboardScreen() {
  const game = useGame();
  const [tab, setTab] = useState("本週榜");
  const rows = useMemo(() => names.map((name, index) => ({ name, exp: 1280 - index * 137 + (name === game.nickname ? game.exp : 0), sect: ["效率派", "學習派", "健康派", "社交派"][index % 4] })).sort((a, b) => b.exp - a.exp), [game.exp, game.nickname]);
  const invite = () => Alert.alert("門派邀請令", "JH-7K2M9\n\n已備好邀請令，正式版本可接入系統分享功能。");

  return <ScreenContainer containerClassName="bg-[#F4F1E7]" className="px-4"><View style={styles.page}><JianghuPageAtmosphere /><ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
    <JianghuSceneBanner source={leaderboardBanner} kicker="比武擂台 · 英雄榜" title="江湖榜" detail="每一次修煉，都是與昨日自己的論劍。"><Pressable onPress={invite} style={({ pressed }) => [styles.invite, pressed && styles.pressed]}><Text style={styles.inviteText}>發出邀請令</Text></Pressable></JianghuSceneBanner>
    <View style={styles.sectionHead}><View><Text style={styles.kicker}>門派英雄榜</Text><Text style={styles.heading}>誰與我爭鋒</Text></View><Text style={styles.hint}>依修為排序</Text></View>
    <JianghuPaperPanel style={styles.tabs}>{["本週榜", "本月榜", "總榜"].map((entry) => <Pressable key={entry} onPress={() => setTab(entry)} style={({ pressed }) => [styles.tab, tab === entry && styles.tabActive, pressed && styles.pressed]}><Text style={[styles.tabText, tab === entry && styles.tabTextActive]}>{entry}</Text></Pressable>)}</JianghuPaperPanel>
    <JianghuPaperPanel style={styles.myRank}><CharacterAvatar equipment={game.avatarEquipment} height={60} style={styles.myRankAvatar} accessibilityLabel="江湖榜中的目前角色外觀" /><View style={styles.myRankCopy}><Text style={styles.myRankKicker}>本座名次 · 同步目前裝備</Text><Text style={styles.myRankName}>{game.nickname}</Text><Text style={styles.myRankSect}>{game.sect} · Lv.{game.level}</Text></View><Text style={styles.myRankExp}>{game.exp} EXP</Text></JianghuPaperPanel>
    <JianghuPaperPanel style={styles.podium}><Text style={styles.podiumKicker}>擂台前三甲</Text><View style={styles.podiumRow}>{[rows[1], rows[0], rows[2]].map((row, index) => <View key={row.name} style={[styles.podiumPlace, index === 1 && styles.podiumFirst]}><View style={[styles.medal, { borderColor: podiumTones[index] }]}><Text style={[styles.medalText, { color: podiumTones[index] }]}>{index === 0 ? "貳" : index === 1 ? "壹" : "參"}</Text></View><Text numberOfLines={1} style={styles.podiumName}>{row.name}</Text><Text style={[styles.podiumExp, { color: podiumTones[index] }]}>{row.exp} EXP</Text></View>)}</View></JianghuPaperPanel>
    <Text style={styles.listTitle}>英雄名冊</Text><JianghuPaperPanel style={styles.rankList}>{rows.slice(3).map((row, index) => <View key={row.name} style={styles.rankRow}><Text style={styles.rank}>{index + 4}</Text><View style={styles.avatar}><Text style={styles.avatarText}>{row.name.slice(0, 1)}</Text></View><View style={styles.rankCopy}><Text style={styles.rankName}>{row.name}</Text><Text style={styles.rankSect}>{row.sect}</Text></View><Text style={styles.rankExp}>{row.exp} EXP</Text></View>)}</JianghuPaperPanel>
  </ScrollView></View></ScreenContainer>;
}

const styles = StyleSheet.create({
  page: { flex: 1, position: "relative" }, scroll: { zIndex: 1 }, content: { paddingTop: 12, paddingBottom: 34 },
  invite: { position: "absolute", right: 12, top: 12, borderRadius: 12, paddingHorizontal: 10, paddingVertical: 7, backgroundColor: "rgba(201,77,66,0.94)", borderWidth: 1, borderColor: "#A83B32" }, inviteText: { color: "#FFFFFF", fontSize: 10, lineHeight: 13, fontWeight: "900" },
  sectionHead: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", marginTop: 18, marginBottom: 10 }, kicker: { color: "#A66B2E", fontSize: 10, lineHeight: 14, letterSpacing: 1, fontWeight: "900" }, heading: { color: jianghuColors.ink, fontSize: 21, lineHeight: 27, fontWeight: "900", marginTop: 2 }, hint: { color: jianghuColors.muted, fontSize: 11, lineHeight: 15, fontWeight: "800" },
  tabs: { flexDirection: "row", padding: 5, borderRadius: 18, marginBottom: 13 }, tab: { flex: 1, alignItems: "center", paddingVertical: 9, borderRadius: 13 }, tabActive: { backgroundColor: jianghuColors.indigo }, tabText: { color: "#6F837B", fontSize: 12, lineHeight: 16, fontWeight: "800" }, tabTextActive: { color: "#FFF5D8", fontWeight: "900" },
  myRank: { minHeight: 74, marginBottom: 13, paddingHorizontal: 13, paddingVertical: 7, flexDirection: "row", alignItems: "center", gap: 8, borderColor: "#C4D9D0" }, myRankAvatar: { marginLeft: -5 }, myRankCopy: { flex: 1 }, myRankKicker: { color: "#A66B2E", fontSize: 9, lineHeight: 12, fontWeight: "900" }, myRankName: { color: jianghuColors.ink, fontSize: 14, lineHeight: 18, fontWeight: "900", marginTop: 1 }, myRankSect: { color: "#73867E", fontSize: 10, lineHeight: 14, marginTop: 1 }, myRankExp: { color: jianghuColors.gold, fontSize: 11, lineHeight: 15, fontWeight: "900" },
  podium: { padding: 16, borderColor: "#D2C3A5" }, podiumKicker: { color: "#7D663C", fontSize: 10, lineHeight: 14, letterSpacing: 0.9, fontWeight: "900", textAlign: "center" }, podiumRow: { flexDirection: "row", justifyContent: "space-around", alignItems: "flex-end", marginTop: 12 }, podiumPlace: { alignItems: "center", width: "30%", paddingBottom: 8 }, podiumFirst: { paddingBottom: 20 }, medal: { width: 42, height: 42, borderRadius: 14, borderWidth: 2, alignItems: "center", justifyContent: "center", backgroundColor: "#F7F2E4" }, medalText: { fontSize: 18, lineHeight: 23, fontWeight: "900" }, podiumName: { color: jianghuColors.ink, fontSize: 12, lineHeight: 16, fontWeight: "900", marginTop: 7, maxWidth: "100%" }, podiumExp: { fontSize: 9, lineHeight: 13, fontWeight: "900", marginTop: 3 },
  listTitle: { color: "#55706B", fontSize: 11, lineHeight: 15, letterSpacing: 1, fontWeight: "900", marginTop: 19, marginBottom: 7, marginLeft: 10 }, rankList: { overflow: "hidden" }, rankRow: { minHeight: 64, flexDirection: "row", alignItems: "center", gap: 10, paddingHorizontal: 13, borderBottomWidth: 1, borderBottomColor: "#E5DECF" }, rank: { width: 20, color: "#8D9387", fontSize: 12, lineHeight: 16, textAlign: "center", fontWeight: "900" }, avatar: { width: 36, height: 36, borderRadius: 13, alignItems: "center", justifyContent: "center", backgroundColor: "#E2EBE2", borderWidth: 1, borderColor: "#B9CCC0" }, avatarText: { color: jianghuColors.jade, fontSize: 15, lineHeight: 19, fontWeight: "900" }, rankCopy: { flex: 1 }, rankName: { color: jianghuColors.ink, fontSize: 13, lineHeight: 18, fontWeight: "900" }, rankSect: { color: "#7B8D86", fontSize: 10, lineHeight: 14, marginTop: 2 }, rankExp: { color: jianghuColors.gold, fontSize: 10, lineHeight: 14, fontWeight: "900" }, pressed: { opacity: 0.8, transform: [{ scale: 0.98 }] },
});
