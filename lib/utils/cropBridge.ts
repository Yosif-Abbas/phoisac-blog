type CropResult = { file: File; url: string };

let pendingResolve: ((value: CropResult) => void) | null = null;
let pendingReject: ((reason?: any) => void) | null = null;

export const requestEditorCrop = (file: File): Promise => {
  return new Promise((resolve, reject) => {
    pendingResolve = resolve;
    pendingReject = reject;

    // Tell React to open the modal
    const event = new CustomEvent("open-editor-crop", { detail: { file } });
    window.dispatchEvent(event);
  });
};

export const resolveEditorCrop = (file: File, url: string) => {
  if (pendingResolve) pendingResolve({ file, url });
  resetBridge();
};

export const rejectEditorCrop = () => {
  if (pendingReject) pendingReject(new Error("Crop cancelled"));
  resetBridge();
};

const resetBridge = () => {
  pendingResolve = null;
  pendingReject = null;
};
