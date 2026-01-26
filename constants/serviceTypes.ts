export const SERVICE_TYPES = [
  {
    id: 'patient',
    name: 'Chăm bệnh nhân',
    icon: '🏥',
    description: 'Chăm sóc bệnh nhân tại nhà hoặc bệnh viện',
  },
  {
    id: 'baby',
    name: 'Chăm em bé',
    icon: '👶',
    description: 'Trông trẻ, chăm sóc trẻ sơ sinh',
  },
  {
    id: 'maternity',
    name: 'Chăm thai sản',
    icon: '🤱',
    description: 'Chăm sóc mẹ và bé sau sinh',
  },
  {
    id: 'elderly',
    name: 'Chăm người già',
    icon: '👴',
    description: 'Chăm sóc người cao tuổi',
  },
] as const;

export const SKILLS = [
  'Tiêm thuốc',
  'Sơ cứu',
  'Đo huyết áp',
  'Chăm sóc sau mổ',
  'Vật lý trị liệu',
  'Chăm sóc trẻ sơ sinh',
  'Chăm sóc người già',
  'Hỗ trợ ăn uống',
  'Vệ sinh cá nhân',
  'Quản lý thuốc',
] as const;

