import type { ReactNode } from "react";
import { RefreshCw, Workflow } from "lucide-react";
import { Button } from "@/components/ui/button.js";
import { useZCodeIntl } from "@/i18n/IntlProvider.js";

interface WorkProjectWorkflowsLayoutProps {
  children: ReactNode;
  onRefresh(): void;
  refreshing?: boolean;
}

/**
 * Work 模式「项目工作流」容器的壳：页头 + 滚动区 + 空态。
 * 数据与分组交给调用方（页用中枢的项目组，预览用样例组），壳只负责稳定的版式。
 */
export function WorkProjectWorkflowsLayout({
  children,
  onRefresh,
  refreshing = false,
}: WorkProjectWorkflowsLayoutProps) {
  const { intl } = useZCodeIntl();
  const hasContent = Boolean(children);

  return (
    <main className="flex h-full min-h-0 flex-1 flex-col bg-background">
      <div className="min-h-0 flex-1 overflow-y-auto [scrollbar-gutter:stable]">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-4 py-4 md:px-6 md:py-6">
          <header className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <Workflow className="size-4 text-foreground-subtle" aria-hidden="true" />
                <h1 className="text-ui-lg font-medium text-foreground">
                  {intl.formatMessage({ id: "workProjectWorkflows.title" })}
                </h1>
                <span className="rounded-full border border-border px-2 py-0.5 text-ui-xs text-foreground-subtle">
                  {intl.formatMessage({ id: "workProjectWorkflows.modeLabel" })}
                </span>
              </div>
              <p className="mt-1 max-w-2xl text-ui-xs leading-5 text-foreground-subtle">
                {intl.formatMessage({ id: "workProjectWorkflows.subtitle" })}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              disabled={refreshing}
              aria-busy={refreshing}
            >
              <RefreshCw className={refreshing ? "animate-spin" : undefined} />
              {intl.formatMessage({ id: "workProjectWorkflows.refresh" })}
            </Button>
          </header>
          {hasContent ? (
            <div className="flex flex-col gap-3">{children}</div>
          ) : (
            <section className="rounded-lg border border-dashed border-border bg-card/40 px-6 py-12 text-center">
              <Workflow className="mx-auto size-6 text-foreground-subtlest" aria-hidden="true" />
              <div className="mt-3 text-ui-sm font-medium text-foreground">
                {intl.formatMessage({ id: "workProjectWorkflows.empty.title" })}
              </div>
              <p className="mx-auto mt-1 max-w-md text-ui-xs leading-5 text-foreground-subtle">
                {intl.formatMessage({ id: "workProjectWorkflows.empty.description" })}
              </p>
            </section>
          )}
        </div>
      </div>
    </main>
  );
}
