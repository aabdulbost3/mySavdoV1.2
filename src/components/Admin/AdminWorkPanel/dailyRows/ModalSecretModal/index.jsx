import "./style.css";

import { Input, Button, TextField } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import AddTaskIcon from '@mui/icons-material/AddTask';
import EditIcon from '@mui/icons-material/Edit';

import { useState, useEffect, forwardRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NumericFormat } from 'react-number-format';
import dayjs from 'dayjs';
import Cookies from "js-cookie"

import { DeleteDefaultActivity, GetActivity, PostDefaultActivity, PutDefaultActivity } from '../../../../../Redux/activity';
import LoadingAnimations from '../../../../LoadingComponent';

const NumericFormatCustom = forwardRef(function NumericFormatCustom(props, ref) {
  const { onChange, ...other } = props;
  return (
    <NumericFormat
      {...other}
      getInputRef={ref}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: values.value,
          },
        });
      }}
      thousandSeparator
      valueIsNumericString
      prefix="$"
    />
  );
});

const ModalSecretModal = (date) => {
  const dispatch = useDispatch();
  const activityData = useSelector((state) => state.activity)
  const [loading, setLoading] = useState()
  const [addModal, setAddModal] = useState()
  const [editModal, setEditModal] = useState(null)
  const [model, setModel] = useState()
  const [valuesIn, setValuesIn] = useState(0);
  const [valuesOut, setValuesOut] = useState(0);

  useEffect(() => {
    dispatch(GetActivity())
  }, [dispatch])
  const dataMap = activityData?.getActivity?.Data?.data?.data
  const setDefault = () => {
    setAddModal(null)
    setValuesIn(0)
    setValuesOut(0)
    setModel(null)
    setEditModal(null)
  }
  const handleEdit = (elem) => {
    setEditModal(elem._id)
    setModel(elem.model)
    setValuesIn(elem.in)
    setValuesOut(elem.sold)
  }
  const addActivity = async () => {
    const body = {
      model: model,
      inner: Number(valuesIn),
      sold: Number(valuesOut)
    }
    setLoading(true)
    await dispatch(PostDefaultActivity(body))
    setDefault()
    await dispatch(GetActivity())
    setLoading(false)
  }
  const editActivity = async () => {
    const body = {
      model: model,
      inner: Number(valuesIn),
      sold: Number(valuesOut)
    }
    const id = editModal
    setLoading(true)
    await dispatch(PutDefaultActivity({body, id}))
    setDefault()
    await dispatch(GetActivity())
    setLoading(false)
  }
  const deleteActivity = async (id) => {
    setLoading(true)
    await dispatch(DeleteDefaultActivity(id))
    setDefault()
    await dispatch(GetActivity())
    setLoading(false)
  }
  const today =  dayjs().locale('en').format('MMMM D, YYYY') + 'y';
  return (
    <div className='DailyModal'>
      {loading ? <LoadingAnimations /> : null}
      <table>
        <tr>
          <th>Id</th>
          <th>Faoliyat</th>
          <th>Sotildi</th>
          <th>Olindi</th>
          <th>Kimdan</th>
          <th>Vaqti</th>
          <th>Foyda</th>
        </tr>
        {dataMap ? dataMap.filter(e => (e.sold == 0 && `${new Date(e.createdAt).toLocaleDateString('en-En', { day: 'numeric', month: 'long', year: 'numeric' })}y` == date.date) || (e.sold && `${new Date(e.createdAt).toLocaleDateString('en-En', { day: 'numeric', month: 'long', year: 'numeric' })}y` == date.date) || (e.type == "default" && `${new Date(e.createdAt).toLocaleDateString('en-En', { day: 'numeric', month: 'long', year: 'numeric' })}y` == date.date)).map((elem, index) =>
          <tr>
            <td style={{ width: "7%" }}>{index + 1}</td>
            <td style={{ width: "23%" }}>{editModal == elem._id ? <Input required onChange={(event) => setModel(event.target.value)} value={model} /> : `${elem.model}`}</td>
            <td style={{ width: "15%" }}>{editModal == elem._id ? <Input required onChange={(event) => setValuesOut(event.target.value)} value={valuesOut} /> : `${elem.sold}$`}</td>
            <td style={{ width: "15%" }}>{editModal == elem._id ? <Input required onChange={(event) => setValuesIn(event.target.value)} value={valuesIn} /> : `${elem.in}$`}</td>
            <td style={{ width: "10%" }}>{editModal == elem._id ? `` : `${elem.user}`}</td>
            <td style={{ width: "20%" }}>{editModal == elem._id ? `` : `${elem.date}`}</td>
            <td style={(elem.sold - elem.in) >= 0 ? {width: "10%",fontWeight:"bold",color:"white",backgroundColor:"#4a9a5a"} : {width: "10%",fontWeight:"bold",color:"white",backgroundColor:"red"}}>{editModal == elem._id ? `` : `${elem.sold - elem.in > 0 ? "+" : ""}${Math.round((elem.sold - elem.in + Number.EPSILON) * 100) / 100}`}</td>
            {JSON.parse(Cookies.get("user")).role == "admin" ?
              <div className="rowModal" style={editModal == elem._id ? { display: 'flex', width: "10%" } : null}>
                {editModal == elem._id ?
                  <>
                    <Button onClick={() => { setEditModal(null); setDefault() }} color="error" variant="contained">
                      Back
                    </Button>
                    <Button onClick={editActivity} color="primary" variant="contained">
                      <AddTaskIcon />
                    </Button>
                  </>
                  :
                  <>
                    <Button onClick={() => handleEdit(elem)} color="success" variant="contained">
                      <EditIcon />
                    </Button>
                    <Button onClick={() => deleteActivity(elem._id)} color="error" variant="contained">
                      <DeleteIcon />
                    </Button>
                  </>
                }
              </div>
              : null}
          </tr>
        ) : null}
        {date.date == today ? addModal ?
          <tr>
            <td style={{ width: "7%" }}></td>
            <td style={{ width: "23%" }}><Input required onChange={(event) => setModel(event.target.value)} value={model} placeholder='Faoliyatni kiriting' /></td>
            <td style={{ width: "15%" }}><TextField required value={valuesOut.numberformat} onChange={(event) => setValuesOut(event.target.value)} name="numberformat" id="formatted-numberformat-input" InputProps={{ inputComponent: NumericFormatCustom }} variant="standard" /></td>
            <td style={{ width: "15%" }}><TextField required value={valuesIn} onChange={(event) => setValuesIn(event.target.value)} name="numberformat" id="formatted-numberformat-input" InputProps={{ inputComponent: NumericFormatCustom }} variant="standard" /></td>
            <td style={{ width: "10%%" }}></td>
            <td style={{ width: "20%" }}></td>
            <div className="rowModal" style={{ justifyContent: "space-around", display: "flex", width: "12%",transform: "translateY(50%) translateX(-45%)" }}>
              <Button onClick={() => { setDefault() }} color="error" variant="contained">
                <DeleteIcon />
              </Button>
              <Button onClick={addActivity} color="primary" variant="contained">
                <AddTaskIcon />
              </Button>
            </div>
          </tr>
          :
          <Button sx={{ color: "black" }} onClick={() => setAddModal(true)}>
            <AddCircleOutlineIcon />
          </Button> : null
        }
      </table>
    </div>
  );
}

export default ModalSecretModal;
