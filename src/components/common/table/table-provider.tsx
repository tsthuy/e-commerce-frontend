import type { PropsWithChildren } from 'react';
import { createContext, useContext, useState } from 'react';

import type { SetStateType } from '~/types';

import { ToggleGroup, ToggleGroupItem, Tooltip, TooltipContent, TooltipTrigger } from '~/components/ui';

import { dataTableConfig, type DataTableConfig } from './';

type FeatureFlagValue = DataTableConfig['featureFlags'][number]['value'];

interface TasksTableContextProps {
  featureFlags: Array<FeatureFlagValue>;
  setFeatureFlags: SetStateType<Array<FeatureFlagValue>>;
}

const TasksTableContext = createContext<TasksTableContextProps>({
  featureFlags: [],
  setFeatureFlags: () => {}
});

export function useTasksTable(): TasksTableContextProps {
  const context = useContext(TasksTableContext);
  if (!context) {
    throw new Error('useTasksTable must be used within a TasksTableProvider');
  }
  return context;
}

export function TasksTableProvider({ children }: PropsWithChildren): React.JSX.Element {
  const [featureFlags, setFeatureFlags] = useState<FeatureFlagValue[]>([]);

  return (
    <TasksTableContext.Provider
      value={{
        featureFlags,
        setFeatureFlags
      }}
    >
      <div className="w-full overflow-x-auto">
        <ToggleGroup className="w-fit" size="sm" type="multiple" value={featureFlags} variant="outline" onValueChange={(value: FeatureFlagValue[]) => setFeatureFlags(value)}>
          {dataTableConfig.featureFlags.map((flag) => (
            <Tooltip key={flag.value} delayDuration={0}>
              <ToggleGroupItem asChild className="whitespace-nowrap px-3 text-xs" value={flag.value}>
                <TooltipTrigger>
                  <flag.icon aria-hidden="true" className="mr-2 size-3.5 shrink-0" />
                  {flag.label}
                </TooltipTrigger>
              </ToggleGroupItem>
              <TooltipContent align="start" className="flex max-w-60 flex-col space-y-1.5 border bg-background py-2 font-semibold text-foreground" side="bottom" sideOffset={6}>
                <div>{flag.tooltipTitle}</div>
                <div className="text-xs text-muted-foreground">{flag.tooltipDescription}</div>
              </TooltipContent>
            </Tooltip>
          ))}
        </ToggleGroup>
      </div>
      {children}
    </TasksTableContext.Provider>
  );
}
