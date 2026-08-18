# 华韵 Hua Yun — notes

## log
- 2026-08-18 v1.0: Chinese traditional culture showcase, per chat's 中文 request. 4 tabs:
  古乐 (original generative pentatonic engine — 宫商角徵羽 ladder walk with guzheng-style
  plucks [detuned tri+sine, pitch-bend transient, bright zing], occasional grace notes,
  flute answers w/ vibrato LFO, sub-octave drone; 3 曲风 modes 溪山/月夜/闹春 varying
  root/tempo/flute density; 13-string visual plucks in sync; volume slider; lookahead
  scheduler via nextAt — synthesized, zero samples, royalty-free by construction, stated
  in-app), 文化 (8 expandable cards: 书法/京剧/茶道/瓷器/剪纸/武术/诗词/灯彩 with giant
  watermark 字), 城探 (6 cities 北京/西安/苏州/成都/杭州/泉州, each 一景/一味/一刻),
  节庆 (6 festival banners 春节→重阳, gradient palettes + papercut edge + emoji art).
  Ma Shan Zheng + Noto Serif SC, 中国红/gold/paper aesthetic, seal stamp, swaying lanterns
  (reduced-motion kill). lang=zh-CN. No external links (verified by probe grep).
  15/15 probe + desktop & 390px mobile screenshots.

## issues
- Headless screenshots show tofu boxes — sandbox has no CJK fonts and Google Fonts is
  blackholed in the harness; real browsers load Noto Serif SC. DOM text verified instead.
- Audio scheduler runs on real AudioContext time — probe asserts state flags, not sound.

## todos
- Could add 灯谜 (lantern riddle) mini-game to 节庆 if chat wants interactivity.
