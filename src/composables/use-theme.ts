export function useTheme() {
  const root = document.querySelector(':root')
  const key = '--primary-color'

  const getThemeColor = () => {
    return getComputedStyle(root!).getPropertyValue(key).trim()
  }

  const setThemeColor = (color: string) => {
    themeColor.value = color
    ;(root as HTMLAnchorElement)?.style.setProperty(key, color)
  }

  const isCheck = (color: string) => themeColor.value === color

  const themeColor = ref(getThemeColor())

  return {
    setThemeColor,
    themeColor,
    isCheck
  }
}
