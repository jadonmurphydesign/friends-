'use client'

// just going to paste in a headlessui modal i made in an old project

import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { Friend } from '@/types/friends';

interface ModalProps {
  open: boolean | Friend;
  setOpen: (open: boolean) => void;
  submitAction?: () => void | Promise<void>;
  title: string;
  titleIcon?: React.ReactNode;
  content?: React.ReactNode;
  submitText?: string;
  submitType?: "severe" | "normal";
  cancelText?: string;
  cancelAction?: () => void;
  submitDisabled?: boolean;
}

export default function Modal({
  open, setOpen, title, titleIcon, content,
  submitAction, submitText, cancelText, cancelAction, submitType, submitDisabled
}: ModalProps) {

  let submitColor = "bg-blue-600 hover:bg-blue-500 text-white";
  if (submitType === "severe" && !submitDisabled) {
    submitColor = "bg-red-600 hover:bg-red-500 text-white";
  } else if (submitDisabled) {
    submitColor = "bg-gray-300 text-gray-500 cursor-not-allowed";
  }

  return (
    <Dialog open={typeof open === "object" ? Boolean(open.id) : open} onClose={setOpen} className="relative z-10">
      <DialogBackdrop
        transition
        aria-hidden="true"
        className="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-lg sm:p-6 data-closed:sm:translate-y-0 data-closed:sm:scale-95"
          >
            <div className="sm:flex sm:items-start">
              {titleIcon}
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <DialogTitle as="h3" className="text-base font-semibold text-gray-900">
                  {title}
                </DialogTitle>
                {content}
              </div>
            </div>
            <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
              {submitAction && submitText && (
                <button
                  disabled={submitDisabled}
                  type="button"
                  onClick={async () => {
                    await submitAction();
                    if (!submitDisabled) setOpen(false);
                  }}
                  className={`inline-flex w-full justify-center rounded-md ${submitColor} px-3 py-2 text-sm font-semibold shadow-xs sm:ml-3 sm:w-auto`}
                >
                  {submitText}
                </button>
              )}
              {cancelText && (
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    if (cancelAction) cancelAction();
                  }}
                  className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                >
                  {cancelText}
                </button>
              )}
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
