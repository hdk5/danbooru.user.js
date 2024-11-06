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
  {
    files: ['**/*.{ts,tsx}'],
    ...solid,
  },
)
