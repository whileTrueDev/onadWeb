import { useState } from 'react';
import { nanoid } from 'nanoid';
import { Typography, Grid } from '@material-ui/core';
import Button from '../../../../../atoms/button/customButton';
import Dialog from '../../../../../atoms/dialog/dialog';
import terms from '../../sources/contractTerms';
import useContractStyles from './contract.style';
// utils
import useDialog from '../../../../../utils/hooks/useDialog';

interface Term {
  title: string;
  state: string;
  text: string;
}
interface CompletedContractProps {
  open: boolean;
  handleClose: () => void;
}
function CompletedContract({ open, handleClose }: CompletedContractProps): JSX.Element {
  const classes = useContractStyles();

  const [selectedTerm, setSelectedTerm] = useState<Term | null>(null);
  const dialog = useDialog();

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm" title="약관 보기">
      <div>
        {terms.map(term => (
          <div key={term.state}>
            <Grid
              container
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              spacing={1}
            >
              <Grid item>
                <Typography component="p" className={classes.termTitle}>
                  {term.title}
                </Typography>
              </Grid>
              <Grid item>
                <Button
                  onClick={(): void => {
                    setSelectedTerm(term);
                    dialog.handleOpen();
                  }}
                >
                  약관보기
                </Button>
              </Grid>
            </Grid>
          </div>
        ))}

        {/* 약관 보기 Dialog */}
        {selectedTerm && (
          <Dialog
            open={dialog.open}
            onClose={dialog.handleClose}
            title={selectedTerm.title}
            fullWidth
            maxWidth="lg"
          >
            {/* 계약 내용 */}
            <div className={classes.inDialogContent}>
              {selectedTerm.text.split('\n').map(sentence => (
                <p key={nanoid()}>{sentence}</p>
              ))}
            </div>
          </Dialog>
        )}
      </div>
    </Dialog>
  );
}

export default CompletedContract;
