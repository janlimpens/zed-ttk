/**
 * @file HTML grammar with Template Toolkit directives for tree-sitter
 * @author Jan Limpens
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: 'ttk',

  extras: $ => [
    $.comment,
    /\s+/,
  ],

  externals: $ => [
    $._start_tag_name,
    $._script_start_tag_name,
    $._style_start_tag_name,
    $._end_tag_name,
    $.erroneous_end_tag_name,
    '/>',
    $._implicit_end_tag,
    $.raw_text,
    $.comment,
    $.tt_directive_content,
    $.tt_line_directive_text,
  ],

  rules: {
    document: $ => repeat($._node),

    doctype: $ => seq(
      '<!',
      alias($._doctype, 'doctype'),
      /[^>]+/,
      '>',
    ),

    _doctype: _ => /[Dd][Oo][Cc][Tt][Yy][Pp][Ee]/,

    _node: $ => choice(
      $.doctype,
      $.entity,
      $.text,
      $.element,
      $.script_element,
      $.style_element,
      $.erroneous_end_tag,
      $.tt_block,
      $.tt_line,
    ),

    element: $ => choice(
      seq(
        $.start_tag,
        repeat($._node),
        choice($.end_tag, $._implicit_end_tag),
      ),
      $.self_closing_tag,
    ),

    script_element: $ => seq(
      alias($.script_start_tag, $.start_tag),
      optional($.raw_text),
      $.end_tag,
    ),

    style_element: $ => seq(
      alias($.style_start_tag, $.start_tag),
      optional($.raw_text),
      $.end_tag,
    ),

    // Tags can contain TT directives AND attributes
    // tt_block MUST come first so [% is matched before [ gets parsed as attribute
    start_tag: $ => seq(
      '<',
      alias($._start_tag_name, $.tag_name),
      repeat(choice($.tt_block, $.attribute)),
      '>',
    ),

    script_start_tag: $ => seq(
      '<',
      alias($._script_start_tag_name, $.tag_name),
      repeat(choice($.tt_block, $.attribute)),
      '>',
    ),

    style_start_tag: $ => seq(
      '<',
      alias($._style_start_tag_name, $.tag_name),
      repeat(choice($.tt_block, $.attribute)),
      '>',
    ),

    self_closing_tag: $ => seq(
      '<',
      alias($._start_tag_name, $.tag_name),
      repeat(choice($.tt_block, $.attribute)),
      '/>',
    ),

    end_tag: $ => seq(
      '</',
      alias($._end_tag_name, $.tag_name),
      '>',
    ),

    erroneous_end_tag: $ => seq(
      '</',
      $.erroneous_end_tag_name,
      '>',
    ),

    attribute: $ => seq(
      $.attribute_name,
      optional(seq(
        '=',
        choice(
          $.attribute_value,
          $.quoted_attribute_value,
        ),
      )),
    ),

    attribute_name: _ => token(prec(-1, /[^<>"'/=\s]+/)),

    attribute_value: _ => /[^<>"'=\s]+/,

    entity: _ => /&(#([xX][0-9a-fA-F]{1,6}|[0-9]{1,5})|[A-Za-z]{1,30});?/,

    // Inner text inside quoted attribute values — stop before quote or [ (for TT blocks)
    _dq_text: _ => token(prec(-1, /[^"\[]+/)),
    _sq_text: _ => token(prec(-1, /[^'\[]+/)),

    quoted_attribute_value: $ => choice(
      seq(
        '"',
        repeat(choice(
          $.tt_block,
          alias($._dq_text, $.attribute_value),
        )),
        '"',
      ),
      seq(
        "'",
        repeat(choice(
          $.tt_block,
          alias($._sq_text, $.attribute_value),
        )),
        "'",
      ),
    ),

    // Exclude % and [ from text start (TT directives)
    text: _ => /[^<>&\[%\s]([^<>&\[%\n]*[^<>&\[%\s])?/,

    // Template Toolkit block directives: [% ... %] or [%- ... -%]
    tt_block: $ => choice(
      $.tt_directive,
      $.tt_comment,
    ),

    // TT directive: [% content %]
    // Chomping modifiers (-) appear as part of the content
    tt_directive: $ => seq(
      '[%',
      optional($.tt_directive_content),
      '%]',
    ),

    // TT comment: [%# comment %]
    tt_comment: $ => seq(
      '[%#',
      optional($.tt_directive_content),
      '%]',
    ),

    // Template Toolkit line directives: % at start of line
    tt_line: $ => choice(
      $.tt_line_directive,
      $.tt_line_comment,
    ),

    tt_line_directive: $ => seq(
      '%',
      optional($.tt_line_directive_text),
    ),

    tt_line_comment: $ => seq(
      '%#',
      optional($.tt_line_directive_text),
    ),
  },
});
