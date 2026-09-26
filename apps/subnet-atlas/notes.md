# Subnet Atlas

Draw your own network as a blueprint map from a scan you ran yourself. Built on stream 2026-09-26 from gleamray's (Twitch) request for a network discovery app with ICMP/SNMP discovery, a DB and a topology UI. A browser can't send ICMP or SNMP, so discovery happens in the user's terminal (`sudo nmap -sn <cidr>`, `arp -a`, `ip neigh`) and the app parses the pasted output. It stays client-side on purpose: every row in our Supabase DB is readable by everyone, and home network details (hostnames, MACs) shouldn't be public.

## log
- 2026-09-26: v1.
  - Parser covers nmap -sn (name/IP, MAC + vendor, open-port lines if present), macOS/Linux `arp -a`, Windows `arp -a` (the `Interface:` line marks the scanning PC as YOU), and `ip neigh`. Fallback: any IPv4 addresses in the text.
  - Drops multicast, broadcast and 0/127 addresses and ff:ff / 01:00:5e / 33:33 MACs. In nmap output, the single host without a MAC is the scanner, tagged YOU.
  - `guessType()` works from hostname + vendor + ports. Order matters: console before switch (Nintendo-Switch), gateway before AP (a Ubiquiti gateway), the AP check before the router check (TP-Link Deco). Randomized MACs (bit 0x02) → phone.
  - Gateway choice: a router-ish name, else the first usable IP, else the last, else the lowest IP.
  - Auto links: infra (switch/AP/firewall) hangs off the router. Wireless types go round-robin across APs as dashed Wi-Fi links, wired types across switches, otherwise everything goes straight to the router.
  - Two layouts, chosen at layout time and saved as `state.mode`:
    - Wide screens: a tree with leaf grids. Leaves after row 1 get a `bus` trunk route on the block's left edge.
    - Phones (<560px): an indented outline with labels beside the cards.
  - The tapped device scrolls above the bottom-sheet panel on phones.
  - Editing panel (name, type, IP, link/unlink mode, remove with undo), list/table view (accessible alternative), zoom buttons and pinch/wheel zoom.
  - Saves to localStorage. Share = `#m=` base64url JSON with types, names, IPs and positions (never MACs or vendors), validated on load.
  - Sample network button with a made-up house.
  - Blueprint look: warm paper, pannable SVG grid pattern, ink lines, rust accent. Fonts: Big Shoulders Display + IBM Plex Mono. Hand-drawn SVG icons instead of emoji.

## issues
- `[hidden]` needs `display:none!important`: `.empty`/`.panel` set display:grid and the attribute lost, showing both at once.
- A CSS `text-anchor:middle` on `.nm` beats the SVG `text-anchor` attribute. Outline labels use the `.st` class instead.

## todos
- SNMP: parse `snmpwalk` LLDP/CDP neighbour tables into real links (gleamray mentioned SNMP).
- Export PNG of the map.
- Paste a second scan to merge (show what's new since last time).
- Group by VLAN / multiple subnets.
