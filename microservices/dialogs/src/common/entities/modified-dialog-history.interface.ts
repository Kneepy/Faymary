import { DialogHistory, ModifiedDialog, Modify } from 'src/common';

export interface ModifiedDialogHistory extends Modify<DialogHistory, {dialog: ModifiedDialog}> {}