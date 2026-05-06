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

    // Tags can contain attributes AND TT directives (for inline [% ... %])
    start_tag: $ => seq(
      '<',
      alias($._start_tag_name, $.tag_name),
      repeat(choice($.attribute, $.tt_block)),
      '>',
    ),

    script_start_tag: $ => seq(
      '<',
      alias($._script_start_tag_name, $.tag_name),
      repeat(choice($.attribute, $.tt_block)),
      '>',
    ),

    style_start_tag: $ => seq(
      '<',
      alias($._style_start_tag_name, $.tag_name),
      repeat(choice($.attribute, $.tt_block)),
      '>',
    ),

    self_closing_tag: $ => seq(
      '<',
      alias($._start_tag_name, $.tag_name),
      repeat(choice($.attribute, $.tt_block)),
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

    attribute_name: _ => /[^<>\"'/=\s]+/,

    attribute_value: _ => /[^<>\"'=\s]+/,

    entity: _ => /&(#([xX][0-9a-fA-F]{1,6}|[0-9]{1,5})|[A-Za-z]{1,30});?/,

    quoted_attribute_value: $ => choice(
      seq('\'', optional(alias(/[^']+/, $.attribute_value)), '\''),
      seq('"', optional(alias(/[^"]+/, $.attribute_value)), '"'),
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
