from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "assets" / "images"
NAMES = (
    "jianghu-composited-profile-banner",
    "jianghu-achievement-banner",
    "jianghu-settings-banner",
    "jianghu-inventory-banner",
    "jianghu-market-banner",
    "jianghu-leaderboard-banner",
)


def compress(source: Path) -> None:
    output = source.with_suffix(".jpg")
    with Image.open(source) as original:
        image = original.convert("RGB")
        image.thumbnail((1280, 720), Image.Resampling.LANCZOS)
        image.save(output, "JPEG", quality=82, optimize=True, progressive=True)
    print(f"{source.name} -> {output.name}: {source.stat().st_size:,}B -> {output.stat().st_size:,}B")


if __name__ == "__main__":
    for name in NAMES:
        source = ASSETS / f"{name}.png"
        if not source.exists():
            if source.with_suffix(".jpg").exists():
                print(f"Skipping {source.name}: JPEG already exists")
                continue
            raise FileNotFoundError(f"Missing source asset: {source}")
        compress(source)
