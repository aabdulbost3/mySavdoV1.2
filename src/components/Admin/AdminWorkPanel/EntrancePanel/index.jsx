import "./style.css"

import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

import LoadingAnimations from "../../../LoadingComponent";
import { GetActivity } from "../../../../Redux/activity";
import Error500Page from "../../../500Component";
import CalendarPanel from "../CalendarPanel";

export function EntrancePanel() {
  const dispatch = useDispatch();
  const dataActivity = useSelector((state) => state.activity);

  useEffect(() => {
    dispatch(GetActivity());
  }, [dispatch]);
  if (dataActivity.getActivity.Error) {
    return <Error500Page />;
  }
  return (
    <div className="EntrancePanel">
      {!dataActivity.getActivity.Data?.data.data ? <LoadingAnimations/> : <CalendarPanel />}
    </div>
  )
}