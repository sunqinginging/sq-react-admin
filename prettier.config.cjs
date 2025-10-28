module.exports = {
  // 指定每行的最大长度，超过该长度会换行
  printWidth: 80, // 默认值：80
  // 指定每个缩进级别的空格数
  tabWidth: 2, // 默认值：2
  // 使用 tab 还是空格缩进，true 表示使用 tab，false 表示使用空格
  useTabs: true, // 默认值：false
  // 是否在语句末尾添加分号
  semi: true, // 默认值：true
  // 使用单引号还是双引号，true 表示使用单引号
  singleQuote: true, // 默认值：false
  // 对象字面量中 key 是否使用引号
  quoteProps: "as-needed",
  // 可选值： "as-needed"（需要时才加）、"consistent"（保持一致）、"preserve"（保留原样）
  // JSX 中使用单引号还是双引号
  jsxSingleQuote: false, // 默认值：false
  // JSX 属性是否使用括号包裹
  bracketSpacing: true, // 默认值：true，{ foo: bar } vs {foo: bar}
  // JSX 标签的闭合方式
  jsxBracketSameLine: false,
  // 默认值：false, true 表示 <div /> 的 /> 会和最后一行在同一行
  // 箭头函数参数是否使用括号
  arrowParens: "always",
  // 可选值："always"（总是加括号）、"avoid"（只有一个参数时省略括号）
  // 行尾换行方式
  endOfLine: "lf",
  // 可选值： "lf"（\n）、"crlf"（\r\n）、"cr"（\r）、"auto"（维护原样）

  // 文件中空格和缩进的处理
  htmlWhitespaceSensitivity: "css",
  // 可选值："css"（遵循 CSS display 属性）、"strict"（严格）、"ignore"（忽略）

  // 在多行 HTML 或 Vue 模板中是否折行
  proseWrap: "preserve",
  // 可选值："always"（总是折行）、"never"（从不折行）、"preserve"（保持原样）

  // 是否在对象的最后一个属性后加逗号
  trailingComma: "es5",
  // 可选值："none"（不加）、"es5"（符合 ES5 规范）、"all"（尽可能加逗号）

  // 是否格式化 HTML、Vue、Angular、Markdown、JSON 等文件
  plugins: [], // 可以在这里添加 Prettier 插件，如 prettier-plugin-tailwindcss

  // 是否格式化嵌入代码块，如 Markdown 中的代码
  embeddedLanguageFormatting: "auto",
  // 可选值："auto"（自动）、"off"（关闭）

  // 对 HTML 标签是否单行处理
  singleAttributePerLine: false, // 默认 false，多属性允许在一行
};
