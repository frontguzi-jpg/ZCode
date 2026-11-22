import { useCallback, useMemo, useState } from "react";
import { resolveWorkspaceKey } from "@zcode/shared";
import { useSavedWorkflowProjectOptions } from "@/project-sidebar/useSavedWorkflowProjectOptions.js";
import type { AutomationWorkspaceOption } from "@/settings/automationWorkspaceOptions.js";
import { SavedWorkflowProjectGroup } from "@/settings/saved-workflows/SavedWorkflowProjectGroup.js";
import type {
  SavedWorkflowGroupState,
  SavedWorkflowProjectTarget,
  SavedWorkflowsOpenArtifactParams,
  SavedWorkflowsOpenRunParams,
} from "@/settings/saved-workflows/savedWorkflowContract.js";
import type { SavedWorkflowLaunchTarget } from "@/settings/saved-workflows/useSavedWorkflowLauncher.js";
import { WorkProjectWorkflowsLayout } from "@/work-project/WorkProjectWorkflowsLayout.js";

interface WorkProjectWorkflowsPageProps {
  /** 活动 workspace：只用于给所属项目组打「当前」标记，不参与任何 target。 */
  workspacePath?: string | null;
  workspaceIdentity?: string;
  onCreateViaChat?: (prompt: string, target: SavedWorkflowProjectTarget) => void;
  onNavigateToLaunchedRun?: (target: SavedWorkflowLaunchTarget, sessionId: string) => void;
  onOpenWorkflowRun?: (params: SavedWorkflowsOpenRunParams) => void;
  onOpenWorkflowArtifact?: (params: SavedWorkflowsOpenArtifactParams) => void;
}

const IGNORE_GROUP_STATE = (_workspaceKey: string, _state: SavedWorkflowGroupState): void => {};

function resolveProjectKey(project: AutomationWorkspaceOption): string {
  return resolveWorkspaceKey({
    workspacePath: project.workspacePath,
    ...(project.workspaceIdentity ? { workspaceIdentity: project.workspaceIdentity } : {}),
  });
}

/**
 * Work 模式「项目工作流」容器：按项目聚合已保存工作流。
 *
 * 只读投影——列表、运行历史、详情、运行和「通过对话创建」全部复用中枢的项目组，
 * 容器自身只持有刷新计数器与「哪个项目正在看详情」。
 */
export function WorkProjectWorkflowsPage({
  workspacePath,
  workspaceIdentity,
  onCreateViaChat,
  onNavigateToLaunchedRun,
  onOpenWorkflowRun,
  onOpenWorkflowArtifact,
}: WorkProjectWorkflowsPageProps) {
  const projects = useSavedWorkflowProjectOptions();
  const [refreshSeq, setRefreshSeq] = useState(0);
  const [detail, setDetail] = useState<{ projectKey: string; name: string } | null>(null);

  const currentProjectKey = useMemo(() => {
    if (!workspacePath) return null;
    return resolveWorkspaceKey({
      workspacePath,
      ...(workspaceIdentity ? { workspaceIdentity } : {}),
    });
  }, [workspaceIdentity, workspacePath]);

  const handleRefresh = useCallback(() => setRefreshSeq((seq) => seq + 1), []);

  return (
    <WorkProjectWorkflowsLayout onRefresh={handleRefresh}>
      {projects.length === 0
        ? null
        : projects.map((project) => {
            const projectKey = resolveProjectKey(project);
            const mode =
              detail?.projectKey === projectKey
                ? ({ kind: "detail", name: detail.name } as const)
                : ({ kind: "list" } as const);
            return (
              <SavedWorkflowProjectGroup
                key={projectKey}
                project={project}
                isCurrent={projectKey === currentProjectKey}
                refreshSeq={refreshSeq}
                mode={mode}
                onStateChange={IGNORE_GROUP_STATE}
                onOpenDetail={(name) => setDetail({ projectKey, name })}
                onBack={() => setDetail(null)}
                {...(onNavigateToLaunchedRun ? { onNavigateToLaunchedRun } : {})}
                {...(onCreateViaChat ? { onCreateViaChat } : {})}
                {...(onOpenWorkflowRun ? { onOpenWorkflowRun } : {})}
                {...(onOpenWorkflowArtifact ? { onOpenWorkflowArtifact } : {})}
              />
            );
          })}
    </WorkProjectWorkflowsLayout>
  );
}
