// import React, { useEffect, useState, useReducer } from 'react';
// import { makeStyles } from '@material-ui/core/styles';
// import {
//   Grid, Divider, Slide, Collapse, Typography, Paper
// } from '@material-ui/core';
// import Button from '../../../atoms/CustomButtons/Button';
// import Dialog from '../../../atoms/Dialog/Dialog';
// import StyledItemText from '../../../atoms/StyledItemText';
// import CreatorTable from './sub/CreatorTable';

// const useStyles = makeStyles(theme => ({
//   root: {
//     width: '100%',
//     marginTop: '0px',
//     alignItem: 'center',
//     [theme.breakpoints.down('sm')]: {
//       margin: 0,
//     },
//   },
//   choice: {
//     padding: theme.spacing(3),
//     margin: '16px',
//     [theme.breakpoints.down('sm')]: {
//       padding: theme.spacing(1),
//     },
//   },
//   button: {
//     marginRight: theme.spacing(1),
//   },
//   end: {
//     color: '#fff',
//     marginRight: theme.spacing(1),
//   }
// }));

// // array State를 사용하는 Reducer
// const reducer = (state, action) => {
//   switch (action.type) {
//     case 'push':
//       return [...state, action.value];
//     case 'delete':
//       return state.filter(item => item !== action.value);
//     case 'reset':
//       return [];
//     default:
//       return state;
//   }
// };

// const SLIDE_TIMEOUT = 500;

// const Transition = React.forwardRef((props, ref) => (
//   <Slide
//     direction="up"
//     ref={ref}
//     {...props}
//   />
// ));

// const CreatorSelect = (props) => {
//   const {
//     setStepComplete, creatorList, checkedCreators, checkedCreatorsDispatch,
//     handleBack, handleNext, stepComplete
//   } = props;

//   const classes = useStyles();
//   const [creatorsText, setText] = useState('');
//   const [creatorNames, creatorNamesDispatch] = useReducer(reducer, []);

//   useEffect(() => {
//     const texts = creatorNames.reduce((text, creatorName) => {
//       const newText = text.concat(creatorName).concat(', ');
//       return newText;
//     }, '현재까지 선택된 크리에이터 :  ');
//     setText(texts);
//     if (checkedCreators.length >= 3) {
//       setStepComplete(true);
//     } else {
//       setStepComplete(false);
//     }
//   }, [checkedCreators, creatorNames, setStepComplete]);

//   return (
//     <Dialog
//       fullScreen
//       disableBackdropClick
//       title="3명 이상의 크리에이터를 선택하세요"
//       open
//       onClose={handleBack}
//       TransitionComponent={Transition}
//       TransitionProps={{
//         timeout: { enter: SLIDE_TIMEOUT, exit: SLIDE_TIMEOUT }
//       }}
//     >
//       <Grid container direction="column" spacing={2} className={classes.root}>
//         <Grid item>
//           <Grid container direction="column" spacing={2}>
//             <Grid item className={classes.item}>
//               <StyledItemText primary="넷째,&nbsp;&nbsp; 크리에이터 선택" secondary="해당 캠페인의 배너가 송출될 크리에이터를 선택하세요." />
//               <Divider component="hr" style={{ height: '2px' }} />
//             </Grid>
//             <Grid item>
//               <Paper className={classes.choice}>
//                 <StyledItemText primary={creatorsText} />
//               </Paper>
//             </Grid>
//             <Grid item>
//               <CreatorTable
//                 creatorList={creatorList}
//                 checkedCreators={checkedCreators}
//                 checkedCreatorsDispatch={checkedCreatorsDispatch}
//                 creatorNamesDispatch={creatorNamesDispatch}
//               />
//             </Grid>
//             <Grid item>
//               <Grid container direction="row">
//                 <Grid item>
//                   <Button onClick={handleBack} className={classes.button}>
//                 뒤로
//                   </Button>
//                 </Grid>
//                 <Collapse in={stepComplete}>
//                   <Grid item>
//                     <Button
//                       variant="contained"
//                       color="info"
//                       onClick={handleNext(false, 4)}
//                       className={classes.end}
//                     >
//                   다음
//                     </Button>
//                   </Grid>
//                 </Collapse>
//               </Grid>
//             </Grid>
//           </Grid>
//         </Grid>
//       </Grid>
//     </Dialog>
//   );
// };

// export default CreatorSelect;
