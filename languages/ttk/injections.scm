; ============================================================
; Template Toolkit (TT) - language injections
; ============================================================

; Inject JavaScript into <script> tags
((script_element (raw_text) @injection.content)
 (#set! injection.language "javascript"))

; Inject CSS into <style> tags
((style_element (raw_text) @injection.content)
 (#set! injection.language "css"))

; Inject Perl into TT directives
; TT uses Perl-like syntax inside [% ... %] directives
((tt_directive (tt_directive_content) @injection.content)
 (#set! injection.language "perl"))

; Inject Perl into TT line directives
((tt_line_directive (tt_line_directive_text) @injection.content)
 (#set! injection.language "perl"))

; TT comments - treat as comment language
((tt_comment) @injection.content
 (#set! injection.language "comment"))
