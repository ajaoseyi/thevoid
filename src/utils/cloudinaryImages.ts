const CONTENT_CREATION_IMAGE_BY_NAME = {
  one: 'https://res.cloudinary.com/dcoza82oi/image/upload/v1772290763/content-creation-one_qu4ctu.jpg',
  two: 'https://res.cloudinary.com/dcoza82oi/image/upload/v1772290769/content-creation-two_di2g7r.jpg',
  three: 'https://res.cloudinary.com/dcoza82oi/image/upload/v1772290770/content-creation-three_af5mhy.jpg',
  four: 'https://res.cloudinary.com/dcoza82oi/image/upload/v1772290773/content-creation-four_hj6dwn.jpg',
  five: 'https://res.cloudinary.com/dcoza82oi/image/upload/v1772290762/content-creation-five_xpqk2x.jpg',
  six: 'https://res.cloudinary.com/dcoza82oi/image/upload/v1772290765/content-creation-six_wmvfdq.jpg',
  seven: 'https://res.cloudinary.com/dcoza82oi/image/upload/v1772290767/content-creation-seven_r6ixba.jpg',
  eight: 'https://res.cloudinary.com/dcoza82oi/image/upload/v1772290761/content-creation-eight_nsuuqh.jpg',
} as const

const DESIGN_BRANDING_IMAGE_BY_NAME = {
  one: 'https://res.cloudinary.com/dcoza82oi/image/upload/v1772290747/design-branding-one_i1rfag.jpg',
  three: 'https://res.cloudinary.com/dcoza82oi/image/upload/v1772290757/design-branding-three_avl31x.jpg',
  four: 'https://res.cloudinary.com/dcoza82oi/image/upload/v1772290784/design-branding-four_tfclnq.jpg',
  five: 'https://res.cloudinary.com/dcoza82oi/image/upload/v1772290780/design-branding-five_o9mvnr.jpg',
  six: 'https://res.cloudinary.com/dcoza82oi/image/upload/v1772290752/design-branding-six_duqpbd.jpg',
  seven: 'https://res.cloudinary.com/dcoza82oi/image/upload/v1772290749/design-branding-seven_bqszif.jpg',
  eight: 'https://res.cloudinary.com/dcoza82oi/image/upload/v1772290780/design-branding-eight_ggibqb.jpg',
  ten: 'https://res.cloudinary.com/dcoza82oi/image/upload/v1772290764/design-branding-ten_xbkdz2.jpg',
  eleven: 'https://res.cloudinary.com/dcoza82oi/image/upload/v1772290779/design-branding-eleven_e0oqrw.jpg',
  twelve: 'https://res.cloudinary.com/dcoza82oi/image/upload/v1772290761/design-branding-twelve_rcingq.jpg',
  thirteen: 'https://res.cloudinary.com/dcoza82oi/image/upload/v1772290754/design-branding-thirteen_pyd32v.jpg',
} as const

const CONTENT_NAME_BY_NUMBER = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight'] as const
const DESIGN_NAME_BY_NUMBER = [
  'one',
  'two',
  'three',
  'four',
  'five',
  'six',
  'seven',
  'eight',
  'nine',
  'ten',
  'eleven',
  'twelve',
  'thirteen',
] as const

type ContentImageName = keyof typeof CONTENT_CREATION_IMAGE_BY_NAME
type DesignImageName = keyof typeof DESIGN_BRANDING_IMAGE_BY_NAME

const DEFAULT_CONTENT_IMAGE = CONTENT_CREATION_IMAGE_BY_NAME.one
const DEFAULT_DESIGN_IMAGE = DESIGN_BRANDING_IMAGE_BY_NAME.one

export const getContentCreationImageByName = (name: string) => {
  const key = name as ContentImageName
  return CONTENT_CREATION_IMAGE_BY_NAME[key] ?? DEFAULT_CONTENT_IMAGE
}

export const getContentCreationImageByNumber = (number: number) => {
  const name = CONTENT_NAME_BY_NUMBER[number - 1]
  return name ? getContentCreationImageByName(name) : DEFAULT_CONTENT_IMAGE
}

export const getDesignBrandingImageByName = (name: string) => {
  const key = name as DesignImageName
  return DESIGN_BRANDING_IMAGE_BY_NAME[key] ?? DEFAULT_DESIGN_IMAGE
}

export const getDesignBrandingImageByNumber = (number: number) => {
  const name = DESIGN_NAME_BY_NUMBER[number - 1]
  return name ? getDesignBrandingImageByName(name) : DEFAULT_DESIGN_IMAGE
}
