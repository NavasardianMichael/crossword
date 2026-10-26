export type ToastTone = 'info' | 'success' | 'error'

export type Toast = { id: number; message: string; tone: ToastTone }

export type ToastState = { toasts: Toast[] }

export type ToastActions = {
  showToast: (toast: { message: string; tone?: ToastTone }) => number
  dismissToast: (id: number) => void
}
