export enum ObjectAccessGroupType {}

export interface ObjectAccessGroup {
  type: ObjectAccessGroupType;
  id: string;
}

export enum ObjectPermission {
  READ = "read",
  WRITE = "write",
}

export interface ObjectAclRule {
  group: ObjectAccessGroup;
  permission: ObjectPermission;
}

export interface ObjectAclPolicy {
  owner: string;
  visibility: "public" | "private";
  aclRules?: Array<ObjectAclRule>;
}

function isPermissionAllowed(requested: ObjectPermission, granted: ObjectPermission): boolean {
  if (requested === ObjectPermission.READ) {
    return [ObjectPermission.READ, ObjectPermission.WRITE].includes(granted);
  }
  return granted === ObjectPermission.WRITE;
}

export async function canAccessObject({
  userId,
  objectFile,
  requestedPermission,
}: {
  userId?: string;
  objectFile: { isPublic?: boolean; owner?: string; aclRules?: ObjectAclRule[] };
  requestedPermission: ObjectPermission;
}): Promise<boolean> {
  if (objectFile.isPublic && requestedPermission === ObjectPermission.READ) return true;
  if (!userId) return false;
  if (objectFile.owner === userId) return true;
  for (const rule of objectFile.aclRules ?? []) {
    if (isPermissionAllowed(requestedPermission, rule.permission)) return true;
  }
  return false;
}
