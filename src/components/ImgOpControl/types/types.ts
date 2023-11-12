interface opBtnType {
  type: string
  label: string
  icon: any
}

interface dropDownPropType {
  type?: string
  icon?: any
  default_icon?: any
  label: string
  value: string
  options: dropDownOptionItem[]
}

interface dropDownOptionItem {
  label: string
  value: string
  icon?: any
  style: any
}

export type { opBtnType, dropDownPropType, dropDownOptionItem }
