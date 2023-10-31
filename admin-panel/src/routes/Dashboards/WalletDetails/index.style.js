import { lighten, makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(4),
    backgroundColor: lighten(theme.palette.background.paper, 0.1),
  },
  container: {
    maxHeight: 415,
  },
  table: {
    minWidth: 750,
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
  itmeCenter: {
    // display: "flex",
    // border:"1px solid red",
    padding: "10px",
  },
  bigDiv: {
    width: "60%",
    margin: "auto",
    // border:"1px solid red",
  },
  buttonDiv: {
    padding: "5px 20px",
    borderRadius: "5px",
    fontSize: "30px",
    background: "#3f51b5",
    color: "white"
  },
  CheckboxDiv: {
    display: "flex",
    alignItems: "center"
  },
}));

export default useStyles;
