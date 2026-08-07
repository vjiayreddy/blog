import { ROLE_RANK, type Role } from "./constants";

export function hasMinRole(userRole: Role, required: Role): boolean {
  return ROLE_RANK[userRole] >= ROLE_RANK[required];
}

export function canManageUsers(role: Role): boolean {
  return hasMinRole(role, "ADMIN");
}

export function canPublish(role: Role): boolean {
  return hasMinRole(role, "EDITOR");
}

export function canEditAnyContent(role: Role): boolean {
  return hasMinRole(role, "EDITOR");
}

export function canEditOwnContent(role: Role): boolean {
  return hasMinRole(role, "AUTHOR");
}

export function canManageTaxonomies(role: Role): boolean {
  return hasMinRole(role, "EDITOR");
}

export function canManageSettings(role: Role): boolean {
  return hasMinRole(role, "ADMIN");
}

export function canViewAnalytics(role: Role): boolean {
  return hasMinRole(role, "ADMIN");
}

export function canUploadMedia(role: Role): boolean {
  return hasMinRole(role, "AUTHOR");
}

export function canAssignRole(actor: Role, target: Role): boolean {
  if (actor === "OWNER") return true;
  if (actor === "ADMIN") return target !== "OWNER" && target !== "ADMIN";
  return false;
}
