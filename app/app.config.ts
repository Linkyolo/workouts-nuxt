//app.config
export default defineAppConfig({
  ui: {
    colors: {
      primary: 'primary',
      secondary: 'secondary',
      tertiary: 'tertiary',
    },
    formField: {
      slots: {
        label: 'text-[var(--color-secondary)]',
        input: {
          slots:
          {
            placeholder: 'text-[var(--color-secondary)]'
          }
        }

      },
    },
    input: {

      base: 'text-white',
      root: 'text-[var(--color-secondary)]',
      slots:
      {
        //placeholder: 'text-[var(--color-bg)]'
        placeholder: 'text-[var(--color-secondary)]'
      },
      variants: {
        formField: {
          placeholder: 'text-[var(--color-secondary)]'
        }

      }
    }
  },
})
