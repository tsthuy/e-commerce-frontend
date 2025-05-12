import { memo, useCallback, useRef, useState } from 'react';

import { CircleAlertIcon } from 'lucide-react';

import { Button, DetailsSection, Helmet } from '~/components/common';
import { ContentAdminLayout } from '~/components/layouts/admin';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  ScrollArea
} from '~/components/ui';

export const DialogPage = memo(() => {
  const [hasReadToBottom, setHasReadToBottom] = useState<boolean>(false);

  const contentRef = useRef<HTMLDivElement>(null);

  const handleScroll = useCallback(() => {
    const content = contentRef.current;
    if (!content) return;

    const scrollPercentage = content.scrollTop / (content.scrollHeight - content.clientHeight);

    if (scrollPercentage >= 0.99 && !hasReadToBottom) {
      setHasReadToBottom(true);
    }
  }, []);

  return (
    <Helmet title="Dialog">
      <ContentAdminLayout breadcrumb={[{ label: 'Storybook' }, { label: 'Components' }, { label: 'Dialog' }]}>
        <DetailsSection isHaveData>
          <div className="mb-10">
            <h2 className="mb-2 text-center text-xl font-bold">Dialog</h2>
            <p className="text-center text-base text-muted-foreground">A growing collection of dialog components.</p>
          </div>
          <div className="components__wrapper">
            <div className="components__item">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline">Alert dialog</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>Take a moment to review the details provided to ensure you understand the implications.</AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction>Okay</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
            <div className="components__item">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline">Alert dialog with icon</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <div className="flex flex-col gap-2 max-sm:items-center sm:flex-row sm:gap-4">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-full border border-border">
                      <CircleAlertIcon className="size-4" />
                    </div>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>Take a moment to review the details provided to ensure you understand the implications.</AlertDialogDescription>
                    </AlertDialogHeader>
                  </div>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction>Confirm</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
            <div className="components__item">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">Scrollable</Button>
                </DialogTrigger>
                <DialogContent className="flex max-h-[min(640px,80vh)] flex-col gap-0 p-0">
                  <ScrollArea className="flex max-h-full flex-col">
                    <DialogHeader className="contents space-y-0 text-left">
                      <DialogTitle className="px-6 pt-6">Frequently Asked Questions (FAQ)</DialogTitle>
                      <DialogDescription asChild>
                        <div className="p-6">
                          {[...new Array(50)].map((_, index) => (
                            <p key={index}>
                              Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam molestias ducimus dolor, earum ipsum architecto quod sapiente quam corrupti, eveniet tenetur veritatis
                              dolores, reiciendis similique laudantium alias sed sequi? Assumenda?
                            </p>
                          ))}
                        </div>
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="px-6 pb-6">
                      <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                      </DialogClose>
                      <DialogClose asChild>
                        <Button>Okay</Button>
                      </DialogClose>
                    </DialogFooter>
                  </ScrollArea>
                </DialogContent>
              </Dialog>
            </div>
            <div className="components__item">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">Scrollable (sticky header)</Button>
                </DialogTrigger>
                <DialogContent className="flex max-h-[min(640px,80vh)] flex-col gap-0 p-0">
                  <DialogHeader className="contents space-y-0 text-left">
                    <DialogTitle className="border-b border-border px-6 py-4">Frequently Asked Questions (FAQ)</DialogTitle>
                    <div className="overflow-y-auto">
                      <DialogDescription asChild>
                        <div className="px-6 py-4">
                          {[...new Array(50)].map((_, index) => (
                            <p key={index}>
                              Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam molestias ducimus dolor, earum ipsum architecto quod sapiente quam corrupti, eveniet tenetur veritatis
                              dolores, reiciendis similique laudantium alias sed sequi? Assumenda?
                            </p>
                          ))}
                        </div>
                      </DialogDescription>
                      <DialogFooter className="px-6 pb-6">
                        <DialogClose asChild>
                          <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <DialogClose asChild>
                          <Button>Okay</Button>
                        </DialogClose>
                      </DialogFooter>
                    </div>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </div>
            <div className="components__item">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">Scrollable (sticky footer)</Button>
                </DialogTrigger>
                <DialogContent className="flex max-h-[min(640px,80vh)] flex-col gap-0 p-0">
                  <div className="overflow-y-auto">
                    <DialogHeader className="contents space-y-0 text-left">
                      <DialogTitle className="px-6 pt-6">Frequently Asked Questions (FAQ)</DialogTitle>
                      <DialogDescription asChild>
                        <div className="p-6">
                          {[...new Array(50)].map((_, index) => (
                            <p key={index}>
                              Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam molestias ducimus dolor, earum ipsum architecto quod sapiente quam corrupti, eveniet tenetur veritatis
                              dolores, reiciendis similique laudantium alias sed sequi? Assumenda?
                            </p>
                          ))}
                        </div>
                      </DialogDescription>
                    </DialogHeader>
                  </div>
                  <DialogFooter className="border-t border-border px-6 py-4">
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <DialogClose asChild>
                      <Button>Okay</Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            <div className="components__item">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">Scrollable (sticky header + footer)</Button>
                </DialogTrigger>
                <DialogContent className="flex max-h-[min(640px,80vh)] flex-col gap-0 p-0">
                  <DialogHeader className="contents space-y-0 text-left">
                    <DialogTitle className="border-b border-border px-6 py-4">Frequently Asked Questions (FAQ)</DialogTitle>
                    <div className="overflow-y-auto">
                      <DialogDescription asChild>
                        <div className="px-6 py-4">
                          {[...new Array(50)].map((_, index) => (
                            <p key={index}>
                              Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam molestias ducimus dolor, earum ipsum architecto quod sapiente quam corrupti, eveniet tenetur veritatis
                              dolores, reiciendis similique laudantium alias sed sequi? Assumenda?
                            </p>
                          ))}
                        </div>
                      </DialogDescription>
                    </div>
                  </DialogHeader>
                  <DialogFooter className="border-t border-border px-6 py-4">
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <DialogClose asChild>
                      <Button>Okay</Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            <div className="components__item">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">Terms & Conditions</Button>
                </DialogTrigger>
                <DialogContent className="flex max-h-[min(640px,80vh)] flex-col gap-0 p-0">
                  <DialogHeader className="contents space-y-0 text-left">
                    <DialogTitle className="border-b border-border px-6 py-4">Frequently Asked Questions (FAQ)</DialogTitle>
                    <div ref={contentRef} className="overflow-y-auto" onScroll={handleScroll}>
                      <DialogDescription asChild>
                        <div className="px-6 py-4">
                          {[...new Array(50)].map((_, index) => (
                            <p key={index}>
                              Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam molestias ducimus dolor, earum ipsum architecto quod sapiente quam corrupti, eveniet tenetur veritatis
                              dolores, reiciendis similique laudantium alias sed sequi? Assumenda?
                            </p>
                          ))}
                        </div>
                      </DialogDescription>
                    </div>
                  </DialogHeader>
                  <DialogFooter className="border-t border-border px-6 py-4 sm:items-center">
                    {!hasReadToBottom && <span className="grow text-xs text-muted-foreground max-sm:text-center">Read all terms before accepting.</span>}
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <DialogClose asChild>
                      <Button disabled={!hasReadToBottom}>I agree</Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </DetailsSection>
      </ContentAdminLayout>
    </Helmet>
  );
});
