import { memo } from 'react';

import { DetailsSection, Helmet } from '~/components/common';
import { ContentAdminLayout } from '~/components/layouts/admin';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui';

const TABS = [
  {
    value: 'tab-1',
    label: 'Tab 1',
    content: 'Content for Tab 1'
  },
  {
    value: 'tab-2',
    label: 'Tab 2',
    content: 'Content for Tab 2'
  },
  {
    value: 'tab-3',
    label: 'Tab 3',
    content: 'Content for Tab 3'
  }
];

export const TabPage = memo(() => {
  return (
    <Helmet title="Tab">
      <ContentAdminLayout breadcrumb={[{ label: 'Storybook' }, { label: 'Components' }, { label: 'Tab' }]}>
        <DetailsSection isHaveData>
          <div className="mb-10">
            <h2 className="mb-2 text-center text-xl font-bold">Tab</h2>
            <p className="text-center text-base text-muted-foreground">A growing collection of tab components.</p>
          </div>
          <div className="components__wrapper">
            <div className="components__item">
              <Tabs defaultValue={TABS[0].value}>
                <TabsList>
                  {TABS.map(({ value, label }) => (
                    <TabsTrigger key={value} value={value}>
                      {label}
                    </TabsTrigger>
                  ))}
                </TabsList>
                {TABS.map(({ value, content }) => (
                  <TabsContent key={value} value={value}>
                    <p className="p-4 text-center text-xs text-muted-foreground">{content}</p>
                  </TabsContent>
                ))}
              </Tabs>
            </div>
            <div className="components__item">
              <Tabs defaultValue={TABS[0].value}>
                <TabsList className="bg-transparent">
                  {TABS.map(({ value, label }) => (
                    <TabsTrigger key={value} className="data-[state=active] data-[state=active]:bg-muted" value={value}>
                      {label}
                    </TabsTrigger>
                  ))}
                </TabsList>
                {TABS.map(({ value, content }) => (
                  <TabsContent key={value} value={value}>
                    <p className="p-4 text-center text-xs text-muted-foreground">{content}</p>
                  </TabsContent>
                ))}
              </Tabs>
            </div>
            <div className="components__item">
              <Tabs defaultValue={TABS[0].value}>
                <TabsList className="gap-1 bg-transparent">
                  {TABS.map(({ value, label }) => (
                    <TabsTrigger key={value} className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-none" value={value}>
                      {label}
                    </TabsTrigger>
                  ))}
                </TabsList>
                {TABS.map(({ value, content }) => (
                  <TabsContent key={value} value={value}>
                    <p className="p-4 text-center text-xs text-muted-foreground">{content}</p>
                  </TabsContent>
                ))}
              </Tabs>
            </div>
            <div className="components__item">
              <Tabs defaultValue={TABS[0].value}>
                <TabsList className="h-auto rounded-none border-b border-border bg-transparent p-0">
                  {TABS.map(({ value, label }) => (
                    <TabsTrigger
                      key={value}
                      className="relative rounded-none py-2 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary"
                      value={value}
                    >
                      {label}
                    </TabsTrigger>
                  ))}
                </TabsList>
                {TABS.map(({ value, content }) => (
                  <TabsContent key={value} value={value}>
                    <p className="p-4 text-center text-xs text-muted-foreground">{content}</p>
                  </TabsContent>
                ))}
              </Tabs>
            </div>
            <div className="components__item">
              <Tabs defaultValue={TABS[0].value}>
                <TabsList className="h-auto gap-2 rounded-none border-b border-border bg-transparent px-0 py-1 text-foreground">
                  {TABS.map(({ value, label }) => (
                    <TabsTrigger
                      key={value}
                      className="relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 hover:bg-accent hover:text-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent"
                      value={value}
                    >
                      {label}
                    </TabsTrigger>
                  ))}
                </TabsList>
                {TABS.map(({ value, content }) => (
                  <TabsContent key={value} value={value}>
                    <p className="p-4 text-center text-xs text-muted-foreground">{content}</p>
                  </TabsContent>
                ))}
              </Tabs>
            </div>
            <div className="components__item">
              <Tabs defaultValue={TABS[0].value}>
                <TabsList className="h-auto -space-x-px bg-background p-0 shadow-sm shadow-black/5 rtl:space-x-reverse">
                  {TABS.map(({ value, label }) => (
                    <TabsTrigger
                      key={value}
                      className="relative overflow-hidden rounded-none border border-border py-2 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 first:rounded-s last:rounded-e data-[state=active]:bg-muted data-[state=active]:after:bg-primary"
                      value={value}
                    >
                      {label}
                    </TabsTrigger>
                  ))}
                </TabsList>
                {TABS.map(({ value, content }) => (
                  <TabsContent key={value} value={value}>
                    <p className="p-4 text-center text-xs text-muted-foreground">{content}</p>
                  </TabsContent>
                ))}
              </Tabs>
            </div>
            <div className="components__item">
              <Tabs defaultValue={TABS[0].value}>
                <TabsList className="relative h-auto w-full gap-0.5 bg-transparent p-0 before:absolute before:inset-x-0 before:bottom-0 before:h-px before:bg-border">
                  {TABS.map(({ value, label }) => (
                    <TabsTrigger
                      key={value}
                      className="overflow-hidden rounded-b-none border-x border-t border-border bg-muted py-2 data-[state=active]:z-10 data-[state=active]:shadow-none"
                      value={value}
                    >
                      {label}
                    </TabsTrigger>
                  ))}
                </TabsList>
                {TABS.map(({ value, content }) => (
                  <TabsContent key={value} value={value}>
                    <p className="p-4 text-center text-xs text-muted-foreground">{content}</p>
                  </TabsContent>
                ))}
              </Tabs>
            </div>
          </div>
        </DetailsSection>
      </ContentAdminLayout>
    </Helmet>
  );
});
