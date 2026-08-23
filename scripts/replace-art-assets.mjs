#!/usr/bin/env node
import { promises as fs } from "node:fs";
import path from "node:path";
import process from "node:process";

const projectRoot = path.resolve(new URL("..", import.meta.url).pathname);
const assetsDir = path.join(projectRoot, "assets", "images");
const backupRoot = path.join(assetsDir, ".backup");

const targets = {
  "--banner": { filename: "jianghu-composited-profile-banner.jpg", label: "首頁名帖 Banner", format: "jpeg" },
  "--achievement-banner": { filename: "jianghu-achievement-banner.jpg", label: "成就功德碑 Banner", format: "jpeg" },
  "--settings-banner": { filename: "jianghu-settings-banner.jpg", label: "修煉設定 Banner", format: "jpeg" },
  "--inventory-banner": { filename: "jianghu-inventory-banner.jpg", label: "江湖行囊 Banner", format: "jpeg" },
  "--market-banner": { filename: "jianghu-market-banner.jpg", label: "江湖市集 Banner", format: "jpeg" },
  "--leaderboard-banner": { filename: "jianghu-leaderboard-banner.jpg", label: "比武擂台 Banner", format: "jpeg" },
  "--character": { filename: "jianghu-custom-character.png", label: "透明角色立繪（後續場景備用）", format: "png" },
};

function printHelp() {
  console.log(`江湖修煉手札圖片批次替換工具\n\n用法：\n  pnpm replace:art -- --banner ./incoming/home.jpg --market-banner ./incoming/market.jpg --dry-run\n  pnpm replace:art -- --achievement-banner ./incoming/achievement.jpg --settings-banner ./incoming/settings.jpg\n\n選項：\n  --banner <path>              首頁名帖 JPEG\n  --achievement-banner <path>  成就功德碑 JPEG\n  --settings-banner <path>     修煉設定 JPEG\n  --inventory-banner <path>    江湖行囊 JPEG\n  --market-banner <path>       江湖市集 JPEG\n  --leaderboard-banner <path>  比武擂台 JPEG\n  --character <path>           透明角色 PNG（後續場景備用）\n  --dry-run                    只檢查與顯示變更，不寫入檔案\n  --no-backup                  不建立舊檔備份（不建議）\n  --help                       顯示本說明\n`);
}

function parseArgs(argv) {
  const options = { dryRun: false, backup: true, values: {} };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--") continue;
    if (arg === "--help") return { ...options, help: true };
    if (arg === "--dry-run") options.dryRun = true;
    else if (arg === "--no-backup") options.backup = false;
    else if (targets[arg]) {
      const value = argv[index + 1];
      if (!value || value.startsWith("--")) throw new Error(`${arg} 需要檔案路徑。`);
      options.values[arg] = path.resolve(process.cwd(), value);
      index += 1;
    } else throw new Error(`不支援的參數：${arg}`);
  }
  return options;
}

async function readHeader(filePath, length) {
  const handle = await fs.open(filePath, "r");
  try {
    const header = Buffer.alloc(length);
    await handle.read(header, 0, length, 0);
    return header;
  } finally {
    await handle.close();
  }
}

async function assertImage(filePath, target) {
  const stat = await fs.stat(filePath);
  if (!stat.isFile() || stat.size < 100) throw new Error(`${target.label} 不是有效的圖片檔：${filePath}`);
  const ext = path.extname(filePath).toLowerCase();
  if (target.format === "png") {
    if (ext !== ".png") throw new Error(`${target.label} 必須是 PNG，才能保留透明背景：${filePath}`);
    const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
    if (!(await readHeader(filePath, 8)).equals(signature)) throw new Error(`${target.label} 不是有效的 PNG：${filePath}`);
    return;
  }
  if (!(ext === ".jpg" || ext === ".jpeg")) throw new Error(`${target.label} 必須是 JPEG（.jpg 或 .jpeg）：${filePath}`);
  const header = await readHeader(filePath, 3);
  if (!(header[0] === 0xff && header[1] === 0xd8 && header[2] === 0xff)) throw new Error(`${target.label} 不是有效的 JPEG：${filePath}`);
}

async function backupAndCopy(source, target, backupDir, dryRun) {
  if (dryRun) return;
  await fs.mkdir(backupDir, { recursive: true });
  try { await fs.copyFile(target, path.join(backupDir, path.basename(target))); } catch (error) { if (error.code !== "ENOENT") throw error; }
  await fs.copyFile(source, target);
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) return printHelp();
  if (Object.keys(options.values).length === 0) throw new Error("至少要提供一個場景或角色資產。使用 --help 查看用法。");
  const inputs = Object.entries(options.values);
  for (const [arg, source] of inputs) await assertImage(source, targets[arg]);
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const backupDir = path.join(backupRoot, timestamp);
  const copied = [];
  for (const [arg, source] of inputs) {
    const target = path.join(assetsDir, targets[arg].filename);
    await backupAndCopy(source, target, backupDir, options.dryRun);
    copied.push(`${targets[arg].label}: ${path.relative(projectRoot, target)}`);
  }
  console.log(options.dryRun ? "[dry-run] 圖片格式、尺寸與目標已檢查，未寫入檔案。" : "圖片替換完成；靜態資產引用名稱保持不變。" );
  if (options.backup && !options.dryRun) console.log(`備份目錄：${path.relative(projectRoot, backupDir)}`);
  console.log(`資產：\n  ${copied.join("\n  ")}`);
}

main().catch((error) => { console.error(`替換失敗：${error.message}`); process.exitCode = 1; });
