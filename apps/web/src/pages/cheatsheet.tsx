import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Terminal, Keyboard, MonitorSmartphone } from 'lucide-react'

/* ── Primitives ─────────────────────────────────────────── */

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="shrink-0 rounded-md border border-border bg-muted px-1.5 py-0.5 font-mono text-[11px] leading-tight">
      {children}
    </kbd>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        {title}
      </h3>
      {children}
    </div>
  )
}

function Row({ keys, desc }: { keys: string; desc: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-border/40 py-1.5 last:border-0">
      <Kbd>{keys}</Kbd>
      <span className="text-right text-sm text-muted-foreground">{desc}</span>
    </div>
  )
}

function CompactTable({
  headers,
  rows,
}: {
  headers: string[]
  rows: string[][]
}) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/40">
            {headers.map((h, i) => (
              <th key={i} className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-border/40 last:border-0 hover:bg-muted/20 transition-colors">
              {row.map((cell, j) => (
                <td key={j} className="px-3 py-1.5">
                  {j === 0 ? <Kbd>{cell}</Kbd> : <span className="text-sm text-muted-foreground">{cell}</span>}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function CodeBlock({ children }: { children: string }) {
  return (
    <pre className="overflow-x-auto rounded-lg border border-border bg-muted/30 p-4 font-mono text-xs leading-relaxed text-muted-foreground">
      {children}
    </pre>
  )
}

/* ── Tabs ────────────────────────────────────────────────── */

const tabs = [
  { id: 'vim', label: 'Vim', icon: Keyboard },
  { id: 'tmux', label: 'Tmux', icon: MonitorSmartphone },
  { id: 'cli', label: 'CLI', icon: Terminal },
] as const

type TabId = (typeof tabs)[number]['id']

/* ── Page ────────────────────────────────────────────────── */

export function CheatsheetPage() {
  const [active, setActive] = useState<TabId>('vim')

  return (
    <div className="mx-auto max-w-4xl p-6 pb-20">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Floyd's Prod</h1>
        <p className="mt-1 text-sm text-muted-foreground">Shortcuts & tools — all in one place</p>
      </div>

      {/* Tab bar */}
      <div className="sticky top-0 z-10 -mx-1 mb-8 flex gap-1 rounded-xl border border-border bg-card/80 p-1 backdrop-blur-sm">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActive(t.id)}
            className={cn(
              'flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all',
              active === t.id
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground',
            )}
          >
            <t.icon className="h-4 w-4" />
            {t.label}
          </button>
        ))}
      </div>

      {/* ═══════════════════════ VIM ═══════════════════════ */}
      {active === 'vim' && (
        <div className="flex flex-col gap-8">
          {/* Config banner */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 rounded-lg border border-border bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
            <span>Config: <Kbd>~/.config/nvim/init.lua</Kbd></span>
            <span>Leader: <Kbd>Space</Kbd></span>
            <span>Theme: Catppuccin Mocha</span>
          </div>

          {/* My Custom Bindings */}
          <Section title="My Custom Bindings">
            <CompactTable
              headers={['Key', 'Action']}
              rows={[
                ['Space w', 'Save file'],
                ['Space e', 'Toggle file explorer (nvim-tree)'],
                ['Space ff', 'Find files (Telescope)'],
                ['Space fg', 'Live grep (Telescope)'],
                ['Space fb', 'List buffers (Telescope)'],
                ['Space fh', 'Help tags (Telescope)'],
                ['Space fr', 'Recent files (Telescope)'],
                ['Shift+H', 'Previous buffer'],
                ['Shift+L', 'Next buffer'],
                ['Ctrl+h/j/k/l', 'Navigate between windows'],
                ['V then J/K', 'Move selected lines down/up'],
                ['Space p', 'Paste without overwriting register (visual)'],
                ['Esc', 'Clear search highlight'],
                ['gcc', 'Toggle comment (line)'],
                ['gc', 'Toggle comment (visual selection)'],
              ]}
            />
          </Section>

          {/* LSP */}
          <Section title="LSP (when attached)">
            <CompactTable
              headers={['Key', 'Action']}
              rows={[
                ['gd', 'Go to definition'],
                ['gr', 'Go to references'],
                ['K', 'Hover documentation'],
                ['Space ca', 'Code action'],
                ['Space rn', 'Rename symbol'],
                ['Space D', 'Type definition'],
              ]}
            />
          </Section>

          {/* Modes */}
          <Section title="Modes">
            <div className="grid gap-1">
              <Row keys="i / a" desc="Insert before / after cursor" />
              <Row keys="I / A" desc="Insert at line start / end" />
              <Row keys="o / O" desc="New line below / above" />
              <Row keys="v / V / Ctrl-v" desc="Visual char / line / block" />
              <Row keys="R" desc="Replace mode (overwrite)" />
              <Row keys=":" desc="Command-line mode" />
              <Row keys="Esc / Ctrl-[" desc="Back to Normal" />
            </div>
          </Section>

          {/* Editing */}
          <Section title="Editing">
            <div className="grid gap-1">
              <Row keys="x" desc="Delete character" />
              <Row keys="dd / D" desc="Delete line / to end of line" />
              <Row keys="dw" desc="Delete word" />
              <Row keys="cw / cc / C" desc="Change word / line / to end" />
              <Row keys="r{char}" desc="Replace single character" />
              <Row keys="yy / yw" desc="Yank line / word" />
              <Row keys="p / P" desc="Paste after / before" />
              <Row keys="u / Ctrl+r" desc="Undo / redo" />
              <Row keys="." desc="Repeat last change" />
              <Row keys=">> / <<" desc="Indent / unindent line" />
              <Row keys="~" desc="Toggle case" />
              <Row keys="J" desc="Join line below" />
            </div>
          </Section>

          {/* Navigation */}
          <Section title="Navigation">
            <div className="grid gap-1">
              <Row keys="h j k l" desc="Left / down / up / right" />
              <Row keys="w / b / e" desc="Next word / prev word / end of word" />
              <Row keys="0 / ^ / $" desc="Line start / first char / line end" />
              <Row keys="gg / G" desc="File top / bottom" />
              <Row keys="{n}G / :{n}" desc="Go to line n" />
              <Row keys="Ctrl+d / Ctrl+u" desc="Half page down / up" />
              <Row keys="Ctrl+f / Ctrl+b" desc="Full page down / up" />
              <Row keys="{ / }" desc="Prev / next paragraph" />
              <Row keys="%" desc="Jump to matching bracket" />
              <Row keys="H / M / L" desc="Screen top / middle / bottom" />
              <Row keys="zz" desc="Center screen on cursor" />
            </div>
          </Section>

          {/* Search */}
          <Section title="Search & Replace">
            <div className="grid gap-1">
              <Row keys="/ {pattern}" desc="Search forward" />
              <Row keys="? {pattern}" desc="Search backward" />
              <Row keys="n / N" desc="Next / prev match" />
              <Row keys="* / #" desc="Search word under cursor fwd / bwd" />
              <Row keys="f{char} / F{char}" desc="Jump to char on line fwd / bwd" />
              <Row keys=":%s/old/new/g" desc="Replace all in file" />
              <Row keys=":%s/old/new/gc" desc="Replace all with confirm" />
              <Row keys=":s/old/new/g" desc="Replace all on current line" />
            </div>
          </Section>

          {/* Save / Quit / Buffers */}
          <Section title="Save, Quit & Buffers">
            <div className="grid gap-1">
              <Row keys=":w" desc="Save" />
              <Row keys=":q / :q!" desc="Quit / quit without saving" />
              <Row keys=":wq / :x / ZZ" desc="Save and quit" />
              <Row keys="ZQ" desc="Quit without saving" />
              <Row keys=":w {file}" desc="Save as" />
              <Row keys=":e {file}" desc="Open file in buffer" />
              <Row keys="Shift+L / Shift+H" desc="Next / prev buffer" />
              <Row keys=":bd" desc="Close buffer" />
              <Row keys=":ls" desc="List open buffers" />
              <Row keys=":sp / :vsp" desc="Horizontal / vertical split" />
              <Row keys="Ctrl-w h/j/k/l" desc="Move between splits" />
            </div>
          </Section>

          {/* Operators + Text Objects */}
          <Section title="Operators & Text Objects">
            <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-5">
              {[
                ['d', 'delete'],
                ['c', 'change'],
                ['y', 'yank'],
                ['> <', 'indent'],
                ['gU gu', 'case'],
              ].map(([k, v]) => (
                <div key={k} className="flex flex-col items-center rounded-lg border border-border bg-muted/20 px-3 py-2">
                  <Kbd>{k}</Kbd>
                  <span className="mt-1 text-[11px] text-muted-foreground">{v}</span>
                </div>
              ))}
            </div>
            <div className="grid gap-1">
              <Row keys="iw / aw" desc="Inner word / a word (with space)" />
              <Row keys={'i" / a"'} desc="Inside / around quotes" />
              <Row keys="i( / a(" desc="Inside / around parens" />
              <Row keys="it / at" desc="Inside / around HTML tag" />
              <Row keys="ip / ap" desc="Inner / a paragraph" />
            </div>
          </Section>

          {/* Combos */}
          <Section title="Power Combos">
            <div className="grid gap-1">
              <Row keys="ciw" desc="Change inner word" />
              <Row keys={'ci"'} desc="Change inside quotes" />
              <Row keys="di(" desc="Delete inside parens" />
              <Row keys="da{" desc="Delete around braces" />
              <Row keys="yip" desc="Yank inner paragraph" />
              <Row keys="=G" desc="Auto-indent to end of file" />
              <Row keys="ggVG" desc="Select entire file" />
              <Row keys="gv" desc="Reselect last selection" />
              <Row keys="Ctrl-v → I" desc="Block insert (multi-cursor)" />
            </div>
          </Section>

          {/* Registers */}
          <Section title="Registers">
            <div className="grid gap-1">
              <Row keys={'"ayy / "ap'} desc="Yank / paste with register a" />
              <Row keys={'"0p'} desc="Paste last yank (ignores deletes)" />
              <Row keys={'"+y / "+p'} desc="System clipboard yank / paste" />
              <Row keys=":reg" desc="View all registers" />
            </div>
          </Section>

          {/* Macros */}
          <Section title="Macros">
            <div className="grid gap-1">
              <Row keys="qa" desc="Record macro into register a" />
              <Row keys="q" desc="Stop recording" />
              <Row keys="@a / @@" desc="Play macro a / replay last" />
              <Row keys="10@a" desc="Play macro 10 times" />
            </div>
          </Section>

          {/* Marks */}
          <Section title="Marks & Jumps">
            <div className="grid gap-1">
              <Row keys="ma" desc="Set mark a at cursor" />
              <Row keys="'a / `a" desc="Jump to mark (line / exact)" />
              <Row keys="Ctrl-o / Ctrl-i" desc="Jump back / forward" />
              <Row keys="gi" desc="Go to last insert position + insert" />
            </div>
          </Section>

          {/* Advanced */}
          <Section title="Advanced">
            <div className="grid gap-1">
              <Row keys=":g/pattern/d" desc="Delete all matching lines" />
              <Row keys=":v/pattern/d" desc="Delete all non-matching lines" />
              <Row keys=":g/pattern/normal @a" desc="Run macro on matches" />
              <Row keys=":.!command" desc="Replace line with shell output" />
              <Row keys=":%!sort" desc="Sort entire file" />
              <Row keys=":norm Iprefix" desc='Prepend "prefix" to line' />
              <Row keys=":%norm A;" desc="Append ; to every line" />
              <Row keys=":argdo %s/old/new/g | w" desc="Replace across files" />
              <Row keys="Ctrl-a / Ctrl-x" desc="Increment / decrement number" />
              <Row keys="gf" desc="Open file under cursor" />
              <Row keys="== / gg=G" desc="Auto-indent line / whole file" />
              <Row keys=":earlier 5m" desc="Undo by time" />
              <Row keys="q:" desc="Command history window" />
            </div>
          </Section>

          {/* Plugins */}
          <Section title="Plugins">
            <div className="grid gap-1">
              <Row keys=":Lazy" desc="Open plugin manager" />
              <Row keys=":Lazy update" desc="Update all plugins" />
              <Row keys=":Mason" desc="Open LSP installer (U to update)" />
              <Row keys=":TSUpdate" desc="Update treesitter parsers" />
            </div>
          </Section>

          {/* macOS Notes */}
          <Section title="macOS / iTerm2">
            <ul className="space-y-1.5 text-sm text-muted-foreground">
              <li><Kbd>Ctrl+[</Kbd> is equivalent to <Kbd>Esc</Kbd></li>
              <li>Clipboard synced automatically (<Kbd>unnamedplus</Kbd>)</li>
              <li><Kbd>Cmd+1</Kbd>–<Kbd>Cmd+9</Kbd> switches tmux windows</li>
              <li>Which-key popup shows bindings after pressing leader</li>
            </ul>
          </Section>
        </div>
      )}

      {/* ═══════════════════════ TMUX ══════════════════════ */}
      {active === 'tmux' && (
        <div className="flex flex-col gap-8">
          {/* Prefix info */}
          <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
            <span>Prefix: <Kbd>Cmd+A</Kbd></span>
            <span className="text-border">|</span>
            <span>All commands below start with the prefix unless noted</span>
          </div>

          {/* Sessions */}
          <Section title="Sessions">
            <div className="grid gap-1">
              <Row keys="tmux new -s name" desc="New session" />
              <Row keys="tmux ls" desc="List sessions" />
              <Row keys="tmux a -t name" desc="Attach to session" />
              <Row keys="tmux kill-session -t name" desc="Kill session" />
              <Row keys="Prefix + d" desc="Detach from session" />
              <Row keys="Prefix + s" desc="Session picker" />
              <Row keys="Prefix + $" desc="Rename session" />
            </div>
          </Section>

          {/* Windows */}
          <Section title="Windows">
            <div className="grid gap-1">
              <Row keys="Prefix + c" desc="New window" />
              <Row keys="Prefix + ," desc="Rename window" />
              <Row keys="Prefix + &" desc="Close window" />
              <Row keys="Prefix + n / p" desc="Next / prev window" />
              <Row keys="Prefix + 0-9" desc="Switch to window by number" />
              <Row keys="Prefix + w" desc="Window picker" />
              <Row keys="Cmd+1–9" desc="Switch window (iTerm2 mapping)" />
            </div>
          </Section>

          {/* Panes */}
          <Section title="Panes">
            <div className="grid gap-1">
              <Row keys='Prefix + "' desc="Split horizontal" />
              <Row keys="Prefix + %" desc="Split vertical" />
              <Row keys="Prefix + arrow" desc="Navigate panes" />
              <Row keys="Prefix + z" desc="Toggle pane zoom (fullscreen)" />
              <Row keys="Prefix + x" desc="Close pane" />
              <Row keys="Prefix + !" desc="Pane to new window" />
              <Row keys="Prefix + {Space}" desc="Cycle pane layouts" />
              <Row keys="Prefix + q" desc="Show pane numbers (then press #)" />
            </div>
          </Section>

          {/* Resize */}
          <Section title="Resize Panes">
            <div className="grid gap-1">
              <Row keys="Prefix + Ctrl+arrow" desc="Resize in direction" />
              <Row keys="Prefix + Alt+arrow" desc="Resize by 5 cells" />
            </div>
          </Section>

          {/* Copy Mode */}
          <Section title="Copy Mode">
            <div className="grid gap-1">
              <Row keys="Prefix + [" desc="Enter copy / scroll mode" />
              <Row keys="h j k l / arrows" desc="Navigate (vi mode)" />
              <Row keys="Space" desc="Start selection" />
              <Row keys="Enter" desc="Copy selection to buffer" />
              <Row keys="Prefix + ]" desc="Paste from buffer" />
              <Row keys="q / Esc" desc="Exit copy mode" />
              <Row keys="/" desc="Search forward in copy mode" />
              <Row keys="?" desc="Search backward in copy mode" />
              <Row keys="g / G" desc="Top / bottom of scrollback" />
            </div>
            <p className="mt-3 text-xs text-muted-foreground italic">
              Tip: To yank inside Neovim, exit tmux copy mode first, then use <Kbd>V</Kbd> + movement + <Kbd>y</Kbd> in Normal mode. Use <Kbd>"+y</Kbd> to yank to system clipboard.
            </p>
          </Section>

          {/* Misc */}
          <Section title="Misc">
            <div className="grid gap-1">
              <Row keys="Prefix + :" desc="Command prompt" />
              <Row keys="Prefix + t" desc="Show clock" />
              <Row keys="Prefix + ?" desc="List all keybindings" />
              <Row keys="tmux source ~/.tmux.conf" desc="Reload config" />
            </div>
          </Section>
        </div>
      )}

      {/* ═══════════════════════ CLI ═══════════════════════ */}
      {active === 'cli' && (
        <div className="flex flex-col gap-8">
          {/* Banner */}
          <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
            Run <Kbd>funtime</Kbd> for a random fun tool!
          </div>

          {/* Modern Replacements */}
          <Section title="Modern CLI Replacements">
            <CompactTable
              headers={['Tool', 'Replaces', 'Usage']}
              rows={[
                ['bat', 'cat', 'bat file.ts — syntax highlight + line numbers'],
                ['eza', 'ls', 'eza -la --icons --git — icons + git status'],
                ['delta', 'diff', 'git config: core.pager = delta'],
                ['zoxide', 'cd', 'z project-name — smart cd'],
                ['doggo', 'dig', 'doggo example.com — DNS with color'],
                ['xh', 'curl', 'xh httpbin.org/get — friendly HTTP'],
                ['choose', 'cut/awk', '<cmd> | choose 0 2'],
                ['hyperfine', 'time', "hyperfine 'cmd1' 'cmd2' — benchmark"],
              ]}
            />
          </Section>

          {/* Productivity */}
          <Section title="Productivity">
            <CompactTable
              headers={['Tool', 'Usage', 'What it does']}
              rows={[
                ['fzf', '<cmd> | fzf', 'Fuzzy finder for anything'],
                ['navi', 'navi', 'Interactive cheatsheet tool'],
                ['atuin', 'atuin search', 'Shell history with context + sync'],
                ['broot', 'broot', 'Fuzzy filesystem tree navigator'],
                ['croc', 'croc send file.txt', 'Secure file transfer'],
                ['lazygit', 'lazygit', 'Terminal UI for git'],
                ['glow', 'glow README.md', 'Render markdown in terminal'],
              ]}
            />
          </Section>

          {/* System Info */}
          <Section title="System Info">
            <CompactTable
              headers={['Tool', 'Usage', 'What it does']}
              rows={[
                ['neofetch', 'neofetch', 'System info + ASCII logo'],
                ['fastfetch', 'fastfetch', 'Faster neofetch'],
                ['onefetch', 'onefetch', 'Git repo info (run inside repo)'],
                ['btop', 'btop', 'Beautiful system monitor'],
                ['procs', 'procs', 'Modern ps with color + tree view'],
                ['dust', 'dust', 'Disk usage (du replacement)'],
                ['duf', 'duf', 'Disk free (df replacement)'],
                ['bandwhich', 'sudo bandwhich', 'Bandwidth monitor by process'],
              ]}
            />
          </Section>

          {/* Rainbow & Visuals */}
          <Section title="Rainbow & Visuals">
            <CompactTable
              headers={['Tool', 'Usage', 'What it does']}
              rows={[
                ['lolcat', '<cmd> | lolcat', 'Rainbowify any output'],
                ['cmatrix', 'cmatrix', 'Matrix falling code (q to quit)'],
                ['cbonsai', 'cbonsai -l', 'Live-grow a bonsai tree'],
                ['pipes.sh', 'pipes.sh', 'Animated pipes screensaver'],
                ['nms', '<cmd> | nms', 'Sneakers-style decrypt effect'],
                ['asciiquarium', 'asciiquarium', 'Animated aquarium'],
                ['nyancat', 'nyancat', 'Nyan Cat animation'],
              ]}
            />
          </Section>

          {/* ASCII Art */}
          <Section title="ASCII Art & Text">
            <CompactTable
              headers={['Tool', 'Usage', 'What it does']}
              rows={[
                ['figlet', 'figlet "TEXT"', 'Big ASCII text (-f slant for fonts)'],
                ['toilet', 'toilet --gay "TEXT"', 'Colored big text'],
                ['cowsay', 'cowsay "msg"', 'ASCII cow (-f dragon, -l to list)'],
                ['fortune', 'fortune', 'Random quotes / jokes'],
                ['chafa', 'chafa image.jpg', 'Images in terminal'],
                ['jp2a', 'jp2a --colors img.jpg', 'Image to colored ASCII art'],
                ['pastel', 'pastel random | pastel format hex', 'Color tools'],
              ]}
            />
          </Section>

          {/* Other */}
          <Section title="Other">
            <CompactTable
              headers={['Tool', 'Usage', 'What it does']}
              rows={[
                ['sl', 'sl', 'Steam locomotive (mistype ls)'],
                ['genact', 'genact', 'Fake busy activity generator'],
                ['funtime', 'funtime', 'Random fun tool (--list to see all)'],
              ]}
            />
          </Section>

          {/* Combos */}
          <Section title="Combos">
            <CodeBlock>{`fortune | cowsay -f dragon | lolcat   # rainbow dragon quote
ls -la | nms                           # decrypt your file list
figlet "DONE" | lolcat                 # celebratory banner
eza -la --icons --git | lolcat        # rainbow file listing
bat --theme=Dracula src/App.tsx        # pretty code viewing
hyperfine 'fd .tsx' 'find . -name *.tsx'  # benchmark fd vs find`}</CodeBlock>
          </Section>
        </div>
      )}
    </div>
  )
}
