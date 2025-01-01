import "./style.css";

import { Typography, Button, Modal, Box, TextField, MenuItem, FormControl, OutlinedInput, InputLabel, InputAdornment, IconButton, Input } from '@mui/material';
import { Visibility, VisibilityOff, AssignmentInd, Assignment, Tty, Fingerprint, DeleteSweep, Phone, Lock, Person } from '@mui/icons-material';
import { styled } from '@mui/material/styles';

import axios from 'axios';
import { useDropzone } from 'react-dropzone';
import { forwardRef, useState } from 'react';
import { IMaskInput } from 'react-imask';
import PropTypes from 'prop-types';
import Cookies from "js-cookie"

import { IMAGE_URL } from '../../utils';
import LoadingAnimations from '../LoadingComponent';

//style

const TextMaskCustom = forwardRef(function TextMaskCustom(props, ref) {
  const { onChange, ...other } = props;
  return (
    <IMaskInput
      {...other}
      mask="+### (#0) 000-00-00"
      definitions={{
        '#': /[1-9]/,
      }}
      inputRef={ref}
      onAccept={(value) => onChange({ target: { name: props.name, value } })}
      overwrite
    />
  );
});
TextMaskCustom.propTypes = {
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export function AdminModal({ open,setValues,values, setName, setSurname, setId, setPassword, setRole, setImgUpload, imgUpload, setLoading, addAdmin, handleClose, loading, role, id, editAdmin, name, surname, password, passId }) {
  const currencies = [
    {
      value: 'admin',
      label: 'admin',
    },
    {
      value: 'user',
      label: 'sotuvchi',
    }
  ];//
  const onDrop = (acceptedFiles) => {
    const formData = new FormData()
    formData.append('file', acceptedFiles[0])
    formData.append('upload_preset', Cookies.get("imageLink"))
    setLoading(true)
    const postImage = async () => {
      try {
        const response = await axios.post(`${IMAGE_URL}`, formData)
        setImgUpload(response?.data.secure_url)
        setLoading(false)
      } catch (error) {
        console.log(error);
      }
    }
    postImage()
  };
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: 'image/*',
  });
  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
  };
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    border: "none",
    borderRadius: "10px",
    borderColor: "var(--white)",
    backgroundColor: "#0C0C0C",
    color: "var(--white)",
    p: 4,
  };
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => event.preventDefault();
  return (
    <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
      <Box sx={style} noValidate>
        <div>
          <Typography id="modal-modal-title" sx={{ color: "var(--blue)", fontWeight: 800 }} variant="h5" component="h2">
            {id ? "Admin  ta'rifini o'zgartirish" : "Yangi admin qo'shish"}
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2, fontWeight: 700, color: "var(--white)" }}>
            Berilgan qismlarni to'ldirish orqali {id ? "admin ta'rifini o'zgartir" : "yangi admin qo'sh"}ing
          </Typography>
        </div>
        <form onSubmit={id ? editAdmin : addAdmin} autoComplete="off">
          {/* Name Input */}
          <Box sx={{ '& > :not(style)': { my: 1, width: '30ch' } }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
              <AssignmentInd sx={{ color: 'var(--green)', fontSize: 30, mr: 1 }} />
              <TextField
                autoComplete="off"
                name="UserName"
                required
                onChange={(event) => setName(event.target.value)}
                value={name}
                id="input-name"
                label="Ismi"
                variant="standard"
                sx={{
                  width: "100%",
                  '& .MuiInputBase-input': { color: 'white' },
                  '& .MuiInputLabel-root': { color: name?.length > 0 ? 'var(--blue)' : 'var(--white)' },
                  '& .MuiInput-underline:before': { borderBottomColor: 'gray' },
                  '& .MuiInput-underline:hover:before': { borderBottomColor: 'gray' },
                }}
              />
            </Box>
          </Box>

          {/* Surname Input */}
          <Box sx={{ '& > :not(style)': { width: '30ch' } }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
              <Assignment sx={{ color: 'var(--green)', fontSize: 30, mr: 1 }} />
              <TextField
                required
                onChange={(event) => setSurname(event.target.value)}
                value={surname}
                id="input-surname"
                label="Familiyasi"
                variant="standard"
                sx={{
                  width: "100%",
                  '& .MuiInputBase-input': { color: 'white' },
                  '& .MuiInputLabel-root': { color: surname?.length > 0 ? 'var(--blue)' : 'var(--white)' },
                  '& .MuiInput-underline:before': { borderBottomColor: 'gray' },
                  '& .MuiInput-underline:hover:before': { borderBottomColor: 'gray' },
                }}
              />
            </Box>
          </Box>

          {/* Passport ID Input */}
          <Box sx={{ '& > :not(style)': { my: 1, width: '30ch' } }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
              <Fingerprint sx={{ color: 'var(--green)', fontSize: 30, mr: 1 }} />
              <TextField
                required
                onChange={(event) => setId(event.target.value)}
                value={passId}
                id="input-passport"
                label="Passport ID"
                variant="standard"
                sx={{
                  width: "100%",
                  '& .MuiInputBase-input': { color: 'white' },
                  '& .MuiInputLabel-root': { color: passId?.length > 0 ? 'var(--blue)' : 'var(--white)' },
                  '& .MuiInput-underline:before': { borderBottomColor: 'gray' },
                  '& .MuiInput-underline:hover:before': { borderBottomColor: 'gray' },
                }}
              />
            </Box>
          </Box>

          {/* Phone Input */}
          <Box sx={{ '& > :not(style)': { my: 1, width: '30ch' } }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
              <Phone sx={{ color: 'var(--green)', fontSize: 30, mb: 1.5, mr: 1 }} />
              <FormControl
                required
                variant="standard"
                sx={{
                  m: 1,
                  width: '30ch',
                  '& .MuiInputBase-root': { color: 'white' }, // Input text color
                }}
              >
                <InputLabel
                  htmlFor="formatted-text-mask-input"
                  sx={{ color: values.textmask?.length > 0 ? 'var(--blue)' : 'var(--white)' }}
                >
                  Telefon raqami
                </InputLabel>
                <Input
                  required
                  value={values.textmask}
                  onChange={handleChange}
                  name="textmask"
                  id="formatted-text-mask-input"
                  inputComponent={TextMaskCustom}
                  sx={{
                    '& .MuiInputBase-input': { color: 'white' },
                    '&:before': { borderBottomColor: 'gray' },
                    '&:hover:before': { borderBottomColor: 'gray' },
                  }}
                />
              </FormControl>
            </Box>
          </Box>

          {/* Role Selector */}
          <FormControl
            sx={{
              mt: 3,
              width: '30ch',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <Person sx={{ color: 'var(--green)', fontSize: 30, mr: 1, mb: 2 }} />
            <TextField
              required
              onChange={(event) => setRole(event.target.value)}
              id="outlined-select-role"
              select
              label="Turi"
              value={role}
              helperText="Iltimos, foydalanuvchi rolini tanlang"
              InputLabelProps={{ style: { color: role?.length > 0 ? 'var(--blue)' : 'var(--white)' } }}
              FormHelperTextProps={{ style: { color: 'gray' } }}
              SelectProps={{ style: { color: 'white' } }}
              sx={{
                width: "100%",
                '& .MuiInputBase-root': { color: 'white' },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: 'gray' },
                  '&:hover fieldset': { borderColor: 'gray' },
                },
              }}
            >
              {currencies.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </FormControl>

          {/* Password Input */}
          <FormControl
            sx={{
              mt: 2,
              width: '30ch',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: '8px',
            }}
            variant="outlined"
          >
            <Lock sx={{ color: 'var(--green)', fontSize: 30, mr: 1, mb: 1 }} />
            <OutlinedInput
              required
              id="outlined-adornment-password"
              type={showPassword ? 'text' : 'password'}
              onChange={(event) => setPassword(event.target.value)}
              value={password}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                    sx={{ color: 'white' }}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              placeholder="Foydalanuvchi paroli"
              sx={{
                width: '100%',
                '& .MuiInputBase-input': { color: 'white' },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'white'
                  },
                  '&:hover fieldset': {
                    borderColor: 'white'
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'white'
                  },
                },
              }}
            />
          </FormControl>
          {imgUpload ? (
            <div className='image-preview'>
              <img src={imgUpload} alt="Uploaded" className='modal-image' />
              <DeleteSweep
                className="delete-icon"
                onClick={() => setImgUpload(null)}
              />
            </div>
          ) : (
            <div className='upload-box' {...getRootProps()}>
              <input {...getInputProps()} />
              <p>Foydalanuvchi rasmini shu yerga yuklang. Rasmni olib tashlang yoki shunchaki bosing.</p>
            </div>
          )}
          <Button disabled={loading ? true : false} sx={{ mt: 1,color: "var(--black)",fontWeight: 700, width: '100%', bgcolor: 'var(--orange)', '&:hover': { bgcolor: 'var(--white)' } }} type="submit" variant="contained">{id ? "Admin  Ta'rifini O'zgartirish" : "Yangi Admin Qo'shish"}</Button>
        </form>
        {loading ? <LoadingAnimations /> : null}
      </Box>
    </Modal >
  )
}