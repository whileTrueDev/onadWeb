import { Button, makeStyles, TextField } from '@material-ui/core';
import { Add, ArrowDownward, ArrowUpward, Close } from '@material-ui/icons';
import * as React from 'react';
import { MerchandiseOption } from '../../../../../utils/hooks/query/useMarketerMerchandisesList';
import { SwapableListItemResult } from '../../../../../utils/hooks/useSwappableListItem';

const useStyles = makeStyles(theme => ({
  textField: {
    margin: theme.spacing(1, 0),
  },
  smallInput: {
    height: 35,
  },
  container: { marginBottom: theme.spacing(1) },
  option: {
    marginBottom: theme.spacing(2),
  },
  flexCenter: { display: 'flex', alignItems: 'center' },
  button: { margin: theme.spacing(0, 1) },
}));
export interface MerchandiseOptionInputProps {
  options: MerchandiseOption[];
  optionOperations: Pick<
    SwapableListItemResult<MerchandiseOption>,
    | 'handleChange'
    | 'addItem'
    | 'downItemPosition'
    | 'removeItem'
    | 'upItemPosition'
    | 'handleReset'
  >;
  inputClassName?: string;
  textFieldClassName?: string;
  closeCollapse: () => void;
}
export default function MerchandiseOptionInput({
  options,
  optionOperations,
  inputClassName,
  textFieldClassName,
  closeCollapse,
}: MerchandiseOptionInputProps): React.ReactElement {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      {/* <Test datas={options} handleChange={optionOperations.handleChange} /> */}
      {options
        .map((opt, idx1) => ({ ...opt, id: idx1 + 1 }))
        .map((option, idx) => (
          // eslint-disable-next-line react/no-array-index-key
          <div className={classes.option} key={option.id}>
            <div className={classes.flexCenter}>
              <TextField
                className={textFieldClassName || classes.textField}
                variant="outlined"
                style={{ maxWidth: 150 }}
                InputProps={{ className: inputClassName || classes.smallInput }}
                placeholder="옵션명"
                id={`option-name${idx}`}
                name="type"
                value={option.type}
                onChange={optionOperations.handleChange(idx, 'type')}
              />
              <TextField
                className={textFieldClassName || classes.textField}
                variant="outlined"
                fullWidth
                placeholder="옵션값"
                style={{ marginLeft: 8 }}
                InputProps={{ className: inputClassName || classes.smallInput }}
                id={`option-value${idx}`}
                name="name"
                value={option.name}
                onChange={optionOperations.handleChange(idx, 'name')}
              />
            </div>
            <div className={classes.flexCenter}>
              <TextField
                className={textFieldClassName || classes.textField}
                variant="outlined"
                style={{ maxWidth: 142 }}
                placeholder="옵션가격"
                type="number"
                InputProps={{ className: inputClassName || classes.smallInput }}
                // eslint-disable-next-line react/jsx-no-duplicate-props
                inputProps={{ min: 0, step: 1 }}
                id={`option-price${idx}`}
                name="additionalPrice"
                value={option.additionalPrice}
                onChange={optionOperations.handleChange(idx, 'additionalPrice')}
              />

              <Button
                className={classes.button}
                variant="outlined"
                size="small"
                onClick={(): void => {
                  if (options.length === 1) {
                    closeCollapse();
                    optionOperations.handleReset();
                  } else optionOperations.removeItem(idx);
                }}
              >
                <Close fontSize="small" />
                옵션제거
              </Button>

              {idx !== 0 && (
                <Button
                  className={classes.button}
                  variant="outlined"
                  size="small"
                  onClick={() => {
                    optionOperations.upItemPosition(idx);
                  }}
                >
                  <ArrowUpward fontSize="small" />
                  위로
                </Button>
              )}

              {idx !== options.length - 1 && (
                <Button
                  className={classes.button}
                  variant="outlined"
                  size="small"
                  onClick={() => {
                    optionOperations.downItemPosition(idx);
                  }}
                >
                  <ArrowDownward fontSize="small" />
                  아래로
                </Button>
              )}
            </div>
          </div>
        ))}
      <Button
        variant="contained"
        size="small"
        onClick={() =>
          optionOperations.addItem({
            type: '',
            name: '',
            additionalPrice: '',
          })
        }
      >
        <Add fontSize="small" />
        옵션추가
      </Button>
    </div>
  );
}
