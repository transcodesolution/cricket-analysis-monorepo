import { useEffect, useState } from "react";
import { PERMISSION_CONFIG } from "../utils/permissionChecks";
import { checkPermissions, usePermissionStore } from "../store/src";

type TPermissionKey = keyof typeof PERMISSION_CONFIG;

export const usePermissions = () => {
  const { permissions } = usePermissionStore();
  const [checkedPermissions, setCheckedPermissions] = useState<Record<TPermissionKey, boolean>>({} as Record<TPermissionKey, boolean>);

  useEffect(() => {
    const permissionsChecked = Object.keys(PERMISSION_CONFIG).reduce((acc: { [k: string]: boolean }, key) => {
      acc[key] = checkPermissions({ permissions: PERMISSION_CONFIG[key] });
      return acc;
    }, {});

    setCheckedPermissions(permissionsChecked);
  }, [permissions]);

  return checkedPermissions;
};