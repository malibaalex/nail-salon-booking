const Roles = {
  ADMIN: "ADMIN",
  RECEPTIONIST: "RECEPTIONIST",
  SALES_SUPPORT: "SALES_SUPPORT",
  CLIENT: "CLIENT",
} as const

type RolesKey = keyof typeof Roles

export { Roles, type RolesKey }
