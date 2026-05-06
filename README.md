# Zed Template Toolkit Extension

Syntax highlighting for [Template Toolkit](https://template-toolkit.org/) (`.tt`, `.tt2`, `.ttml`) files in [Zed](https://zed.dev/).

## Features

- **HTML highlighting** - Full HTML syntax highlighting within TT templates
- **TT directive delimiters** - `[% ... %]` and `[%# ... %]` are visually distinct
- **TT comments** - Highlighted as comments (different color)
- **Perl injection** - TT directive content receives Perl syntax highlighting
- **JavaScript/CSS** - `<script>` and `<style>` blocks retain proper highlighting
- **Chomping modifiers** - `[%- ... %]`, `[% ... -%]`, `[%- ... -%]`

## Supported File Extensions

| Extension | Description |
|-----------|-------------|
| `.tt`     | Template Toolkit |
| `.tt2`    | Template Toolkit 2 |
| `.ttml`   | Template Toolkit HTML |

## Supported TT Syntax

### Block Directives
```tt
[% IF user.logged_in %]
  <p>Welcome, [% user.name %]!</p>
[% END %]

[% FOREACH item IN list %]
  [% item %]
[% END %]

[% INCLUDE header.tt %]
[% PROCESS sidebar.tt %]
[% WRAPPER layout.tt %]...[% END %]
[% TRY %]...[% CATCH %]...[% END %]
[% SWITCH var %]...[% CASE 'x' %]...[% END %]
```

### Comments
```tt
[%# This is a TT comment - not visible in output %]
```

### Chomping
```tt
[%- 'no leading whitespace' %]
[% 'no trailing whitespace' -%]
[%- 'no whitespace at all' -%]
```

## Development

### Project Structure
```
zed-ttk/
├── extension.toml          # Extension manifest
├── extension.wasm          # Compiled Rust extension
├── Cargo.toml              # Rust dependencies
├── src/
│   └── lib.rs              # Extension entry point
├── grammars/
│   └── ttk.wasm            # Compiled tree-sitter grammar
├── languages/
│   └── ttk/
│       ├── config.toml     # Language configuration
│       ├── highlights.scm  # Syntax highlighting queries
│       └── injections.scm  # Language injection queries
└── test.tt                 # Test file
```

### Building from Source

The tree-sitter grammar source is at [github.com/janlimpens/tree-sitter-ttk](https://github.com/janlimpens/tree-sitter-ttk).

```bash
# Build the tree-sitter grammar
cd tree-sitter-ttk
tree-sitter generate
tree-sitter build --wasm

# Build the Zed extension
cd zed-ttk
cargo build --target wasm32-wasip1 --release
cp target/wasm32-wasip1/release/zed_ttk.wasm extension.wasm
```

## License

MIT
