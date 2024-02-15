import antfu from '@antfu/eslint-config'
import solid from 'eslint-plugin-solid/configs/typescript'

export default antfu(
  {
    typescript: {
      tsconfigPath: 'tsconfig.json',
    },
    formatters: {
      css: true,
      html: true,
      markdown: true,
    },
  },
  // @ts-expect-error solid types are broken
  {
    files: ['**/*.{ts,tsx}'],
    ...solid,
  },
)
