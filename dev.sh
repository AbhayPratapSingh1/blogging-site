#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
GUID="${ITERM_SESSION_ID##*:}"

# ─── Colors ────────────────────────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}╔══════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║       Blogging Site Dev Launcher         ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════╝${NC}"

# ─── 1. Install dependencies (if needed) ──────────────────────────────
echo -e "\n${YELLOW}[1/1] Checking dependencies...${NC}"

install_if_needed() {
  local dir=$1
  local name=$2
  if [ ! -d "$dir/node_modules" ]; then
    echo -e "  Installing $name dependencies..."
    (cd "$dir" && npm install --silent)
    echo -e "${GREEN}  ✓ $name ready${NC}"
  else
    echo -e "${GREEN}  ✓ $name already installed${NC}"
  fi
}

install_if_needed "$ROOT/blogging-site-author-panel" "Admin Panel"
install_if_needed "$ROOT/blogging-site-public-panel" "Public Panel"

# Install Python deps if needed
if [ ! -f "$ROOT/server/.venv/bin/uvicorn" ]; then
  echo -e "  Installing Python venv..."
  (cd "$ROOT/server" && python3 -m venv .venv && .venv/bin/pip install -r requirements.txt --silent)
  echo -e "${GREEN}  ✓ Server Python ready${NC}"
else
  echo -e "${GREEN}  ✓ Server Python already installed${NC}"
fi

# ─── 2. Launch iTerm2 panes ───────────────────────────────────────────
echo -e "\n${YELLOW}Launching iTerm2...${NC}"

osascript <<APPLESCRIPT
set rootPath to "$ROOT"
set guid to "$GUID"

tell application "iTerm"
	activate

	-- ── Locate the session running this script (same window & tab) ──
	set found to missing value
	if guid is not "" then
		repeat with w in windows
			repeat with t in tabs of w
				repeat with s in sessions of t
					if (id of s) contains guid then
						set found to s
						set winObj to w
						set tabObj to t
						exit repeat
					end if
				end repeat
				if found is not missing value then exit repeat
			end repeat
			if found is not missing value then exit repeat
		end repeat
	end if

	-- Not running inside iTerm2: fall back to a new tab in the front window
	if found is missing value then
		tell current window
			create tab with default profile
			delay 0.3
			set found to current session
			set tabObj to current tab
			set winObj to current window
		end tell
	end if

	-- ── Tab 1: 2x2 grid of panes in the script's tab ──────────────
	-- s1 (top-left): FastAPI server
	tell found to split vertically with default profile
	delay 0.3
	-- s2 (top-right): admin panel
	set allS to sessions of tabObj
	set s2 to item (count of allS) of allS
	tell s2 to split horizontally with default profile
	delay 0.3
	-- s3 (bottom-right): public panel
	set allS to sessions of tabObj
	set s3 to item (count of allS) of allS
	-- s4 (bottom-left): root shell
	tell found to split horizontally with default profile
	delay 0.3
	set allS to sessions of tabObj
	set s4 to item (count of allS) of allS

	tell found to write text "cd '" & rootPath & "/server' && .venv/bin/uvicorn app.main:app --reload --port 4900"
	tell s2 to write text "cd '" & rootPath & "/blogging-site-author-panel' && npm start"
	tell s3 to write text "cd '" & rootPath & "/blogging-site-public-panel' && npm run dev"
	tell s4 to write text "cd '" & rootPath & "' && echo '📁 Root — port 4900 | 4901 | 4902 | 5435'"

	-- ── Tab 2: opencode ───────────────────────────────────────────
	tell winObj
		create tab with default profile
		delay 0.3
		tell current session to write text "cd '" & rootPath & "' && opencode"
	end tell

	-- ── Tab 3: docker postgres ────────────────────────────────────
	tell winObj
		create tab with default profile
		delay 0.3
		tell current session to write text "cd '" & rootPath & "'"
		tell current session to write text "docker rm -f blogging-postgres 2>/dev/null; docker run --name blogging-postgres -p 5435:5432 -e POSTGRES_DB=blogging_platform -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -v blogging-postgres-data:/var/lib/postgresql/data postgres:16"
	end tell
end tell
APPLESCRIPT

echo -e "\n${GREEN}All services started!${NC}"
echo -e "  ${BLUE}PostgreSQL${NC}  → localhost:5435 (Docker)"
echo -e "  ${BLUE}Server${NC}      → localhost:4900"
echo -e "  ${BLUE}Admin Panel${NC} → localhost:4901"
echo -e "  ${BLUE}Public Panel${NC}→ localhost:4902"
echo ""
