export const ReceiveFiles = (e: Event) => {
    const fileList = (<DragEvent> e).dataTransfer?.files ?? (<HTMLInputElement> e.target).files

    if (!fileList) return []

    return Object.entries(fileList).map(([key, file]) => <File>file)
}