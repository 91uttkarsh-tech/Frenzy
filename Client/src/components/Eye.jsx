import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useSelector, useDispatch } from "react-redux";
import { setEye } from "state";

const Eye = ({ size = "1.8rem" }) => {
  const flag = useSelector((state) => state.eye);
  const Dispatch = useDispatch();
  function OpenClose() {
    Dispatch(setEye());
  }
  return (
      <div onClick={OpenClose}>
      {(flag )?(<RemoveRedEyeIcon sx={{height:size,width:size}}/>)
      :(<VisibilityOffIcon sx={{height:size,width:size}}/>)}
      </div>

  );
};

export default Eye;
