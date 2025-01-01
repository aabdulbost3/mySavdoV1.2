import "./style.css"

import { Grid, Typography, Button, CardMedia, CardContent, CardActions, Card } from '@mui/material';

import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

import LoadingAnimations from '../../../LoadingComponent';
import Error500Page from '../../../500Component';
import { AdminModal } from '../../../modalComponent';
import EmptyComponent from '../../../emptyComponent';
import { DeleteAdmin, GetAdmin, GetAdminId, PostAdmin, PutAdmin } from '../../../../Redux/admin';
import MessageComponent from "../../../messageComponent";

export default function UsersPanel() {
  const dispatch = useDispatch()
  const dataAdmin = useSelector(state => state.admin)
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [imgUpload, setImgUpload] = useState(null);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(null);
  const [surname, setSurname] = useState(null);
  const [id, setId] = useState(null);
  const [role, setRole] = useState(null);
  const [password, setPassword] = useState(null);
  const [searchUser, setSearchUser] = useState(null);
  const [values, setValues] = useState({
    textmask: '+998 (00) 000-00-00'
  });
  const [alert, setAlert] = useState(null);
  const [alertColor, setAlertColor] = useState(null);
  const [alertDuration, setAlertDuration] = useState(null);

  useEffect(() => {
    dispatch(GetAdmin())
  }, [dispatch])
  let dataMap = dataAdmin?.getAdmin?.Data?.data?.data
  const handleOpen = () => setOpen(true)
  const handleClose = () => { setOpen(false); setDefault() }

  const setDefault = () => {
    setName(null)
    setSurname(null)
    setId(null)
    setRole(null)
    setPassword(null)
    setImgUpload(null)
    setEditId(null)
    setValues({
      ...values,
      textmask: '+998 (00) 000-00-00',
    });
  }
  const defaultAlert = () => {
    setAlert(null)
    setAlertColor(null)
    setAlertDuration(null)
  }
  const addAdmin = async (event) => {
    event.preventDefault();
    setLoading(true)
    handleClose()
    const body = {
      name: name,
      surname: surname,
      password: password,
      image: imgUpload,
      phone: values.textmask,
      role: role,
      passId: id,
    }
    await dispatch(PostAdmin(body)).then(e => {
      setAlertDuration(3000)
      setAlertColor("var(--blue)")
      setAlert("Admin added successfully")
    }).catch(err => {
      setAlertDuration(7000)
      setAlertColor("var(--red)")
      setAlert(err.response ? setAlert(`${err.response.data.status} Error. ${err.response.data.message}`) : setAlert(err.message))
    })
    setLoading(false)
    setDefault()
    await dispatch(GetAdmin())
  }
  const editAdmin = async (event) => {
    event.preventDefault();
    setLoading(true)
    handleClose()
    const body = {
      name: name,
      surname: surname,
      password: password,
      image: imgUpload,
      phone: values.textmask,
      role: role,
      passId: id,
    }
    await dispatch(PutAdmin({ editId, body })).then((e) => {
      setAlertDuration(3000);
      setAlertColor("var(--orange)");
      setAlert("Admin changed successfully");
    }).catch(err => {
      setAlertDuration(7000)
      setAlertColor("var(--red)")
      setAlert(err.response ? setAlert(`${err.response.data.status} Error. ${err.response.data.message}`) : setAlert(err.message))
    })
    setLoading(false)
    setDefault()
    await dispatch(GetAdmin())
  }

  const removeAdmin = async (e) => {
    setLoading(true)
    await dispatch(DeleteAdmin(e.target.id)).then(e => {
      setAlertDuration(3000)
      setAlertColor("var(--green)")
      setAlert("Admin removed successfully")
    }).catch(err => {
      setAlertDuration(7000)
      setAlertColor("var(--red)")
      setAlert(err.response ? setAlert(`${err.response.data.status} Error. ${err.response.data.message}`) : setAlert(err.message))
    })
    setLoading(false)
    await dispatch(GetAdmin())
  }

  const OpenEditModal = async (event) => {
    await setEditId(event.target.id);
    setOpen(true);
    await dispatch(GetAdminId(event.target.id)).then((res) => {
      res.payload.data.data.forEach((e) => {
        setName(e.name);
        setSurname(e.surname);
        setId(e.id);
        setRole(e.role);
        setPassword(e.password);
        setImgUpload(e.image);
        setId(e.passId);
        setValues({
          ...values,
          textmask: e.phone,
        });
      });
    });
  }
  if (searchUser) {
    dataMap = dataAdmin?.getAdmin?.Data?.data?.data?.filter(e => e.name.toLowerCase().includes(searchUser.toLowerCase()))
  }
  return (
    <div className="UsersPanel">
      {loading ? <LoadingAnimations /> : null}
      {alert ? <MessageComponent duration={alertDuration} color={alertColor} message={alert} onClose={defaultAlert} /> : null}
      <div className="PanelTop">
        <form onSubmit={e => e.preventDefault()}>
          <input type="text" placeholder="Ism bilan qidirish" onChange={e => setSearchUser(e.target.value)} disabled={loading ? true : false} value={searchUser} />
          <button className="fa-solid fa-magnifying-glass" aria-label="search"></button>
        </form>
        <button className="addAdmin" onClick={handleOpen} disabled={dataAdmin.getAdmin?.Error || loading ? true : false}>Admin qo'shish <i className="fa-solid fa-address-book" /></button>
      </div>
      <AdminModal open={open} setId={setId} setValues={setValues} values={values} setName={setName} setPassword={setPassword} setRole={setRole} setSurname={setSurname} setImgUpload={setImgUpload} imgUpload={imgUpload} setLoading={setLoading} addAdmin={addAdmin} handleClose={handleClose} loading={loading} role={role} id={editId} editAdmin={editAdmin} name={name} surname={surname} password={password} passId={id} />
      <Grid container spacing={3} direction="row" justify="flex-start" alignItems="flex-start" sx={{ padding: 3 }}>
        {dataAdmin.getAdmin?.Success ?
          dataMap.length > 0 ? dataMap.map((elem, index) =>
            <Card sx={{ maxWidth: 345, margin: 2, borderRadius: "10px", backgroundColor: "#212121" }}>
              <CardMedia component="img" alt="admin image" height="auto" image={elem.image} />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div" sx={{ color: "var(--white)" }}>
                  Ism Familiya: {elem.name} {elem.surname}
                </Typography>
                <Typography variant="body2" sx={{ color: "#EEEEEE" }}>
                  Turi: {elem.role}
                </Typography>
                <Typography variant="body2" sx={{ color: "#EEEEEE" }}>
                  Telefon Raqami: {elem.phone}
                </Typography>
                <Typography variant="body2" sx={{ color: "#EEEEEE" }}>
                  Passport Id: {elem.passId}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" sx={{ color: "var(--green)" }} id={elem._id} onClick={OpenEditModal}>O'zgartirish</Button>
                <Button size="small" sx={{ color: "red" }} id={elem._id} onClick={removeAdmin}>O'chirish</Button>
              </CardActions>
            </Card>
          ) : <EmptyComponent />
          : dataAdmin.getAdmin?.Loading ? <LoadingAnimations /> : dataAdmin.getAdmin?.Error ? <Error500Page /> : null}
      </Grid>
    </div>
  );
}
