; ============================================================
; Template Toolkit (TT) - highlights for tree-sitter-ttk
; ============================================================

; === HTML parts (from the tree-sitter HTML grammar) ===

(tag_name) @tag
(erroneous_end_tag_name) @tag.error
(doctype) @tag.doctype
(attribute_name) @attribute
(quoted_attribute_value) @string
(comment) @comment
(entity) @string.special

"=" @operator

[
  "<"
  ">"
  "<!"
  "</"
  "/>"
] @punctuation.bracket

; === Template Toolkit directive delimiters ===

; TT block directive delimiters: [% and %]
; These frame the TT directives
[
  "[%"
  "%]"
] @keyword.directive

; TT comment delimiter
"[%#" @keyword.directive

; === Template Toolkit comments ===
; Whole [%# ... %] blocks are comments
(tt_comment) @comment
