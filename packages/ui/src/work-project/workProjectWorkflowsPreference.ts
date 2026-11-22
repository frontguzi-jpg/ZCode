// Work 模式「项目工作流」容器的关停开关。
// 形态假设（项目级聚合是否有用）未验证前，允许用户/支持同学用 localStorage 一键退场：
// 缺省开启；`0`/`false`/`off`/`no`（大小写、首尾空白不敏感）为关闭。
export const WORK_PROJECT_WORKFLOWS_STORAGE_KEY = "zcode:work-project-workflows";

const DISABLED_VALUES = new Set(["0", "false", "off", "no"]);

/** 判定单个存储值是否表示「关闭」；null 表示没写过，按缺省开启。 */
export function isWorkProjectWorkflowsDisabledValue(value: string | null): boolean {
  if (value === null) return false;
  return DISABLED_VALUES.has(value.trim().toLowerCase());
}

export function isWorkProjectWorkflowsEnabled(): boolean {
  let stored: string | null = null;
  try {
    stored = window.localStorage.getItem(WORK_PROJECT_WORKFLOWS_STORAGE_KEY);
  } catch {
    // 隐私模式或存储被禁用时按缺省开启处理，与其它本地偏好一致。
    return true;
  }
  return !isWorkProjectWorkflowsDisabledValue(stored);
}
