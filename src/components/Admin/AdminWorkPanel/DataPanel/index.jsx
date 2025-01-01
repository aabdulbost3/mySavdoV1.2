import './style.css';

import { TextField, Input } from '@mui/material';
import { DeleteSweep } from '@mui/icons-material';

import axios from 'axios';
import { NumericFormat } from 'react-number-format';
import { forwardRef, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Cookies from "js-cookie";
import { useDropzone } from 'react-dropzone';

import { PostSale } from '../../../../Redux/sale';
import { IMAGE_URL } from '../../../../utils';
import { GetData, PostData, PutData, DeleteData } from '../../../../Redux/data';
import Error500Page from '../../../500Component';
import LoadingAnimations from '../../../LoadingComponent';
import AddPhone from '../addPhone';

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

export default function DetailPanelOneExpandedRow() {
  const dispatch = useDispatch();
  const dataData = useSelector((state) => state.data);
  const [rows, setRows] = useState([]);
  const [id, setId] = useState(null);
  const [imgUpload, setImgUpload] = useState(null);
  const [imgPassUpload, setPassImgUpload] = useState(null);
  const [loading, setLoading] = useState(false);
  const [model, setModel] = useState(null);
  const [color, setColor] = useState(null);
  const [storage, setStorage] = useState(null);
  const [region, setRegion] = useState(null);
  const [additional, setAdditional] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [purchase, setPurchase] = useState(null);
  const [from, setFrom] = useState(null);
  const [imei, setImei] = useState(null);
  const [comment, setComment] = useState(null);
  const [image, setImage] = useState();
  const [values, setValues] = useState({ numberformat: 0 });
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState();
  const [deleteModal, setDeleteModal] = useState(false);
  const [shopModal, setShopModal] = useState(false);
  const navlink = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [focus, setFocus] = useState();
  const [selectedOptions, setSelectedOptions] = useState();
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [contextMenu, setContextMenu] = useState(null);

  const fileDropzone = useDropzone({
    onDrop: (files) => HandleFile(files),
    accept: 'image/*',
  });

  const passDropzone = useDropzone({
    onDrop: (files) => HandlePassFile(files),
    accept: 'image/*',
  });

  const options = [
    "Telefon Rasmi", "Passport Rasmi", "ID", "Model",
    "Xotira", "Rang", "Soni", "Telefon Raqam", "IMEI",
    "Olindi", "Holat", "Olingan Vaqt"
  ];

  const toggleDropdown = () => { setIsOpen(!isOpen); setContextMenu(null); };

  const handleOptionChange = (option) => {
    if (selectedOptions.includes(option)) {
      setSelectedOptions(selectedOptions.filter((item) => item !== option));
    } else {
      setSelectedOptions([...selectedOptions, option]);
    }
  };

  useEffect(() => {
    try {
      const savedFocus = Cookies.get("focus");
      const savedOptions = Cookies.get("selectedOptions");

      if (savedFocus !== undefined) {
        setFocus(savedFocus === "true");
      }
      if (savedOptions) {
        setSelectedOptions(JSON.parse(savedOptions));
      } else {
        const defaultOptions = ["ID", "Model", "IMEI", "Olindi", "Holat", "Olingan Vaqt"];
        setSelectedOptions(defaultOptions);
        Cookies.set("selectedOptions", JSON.stringify(defaultOptions));
      }
    } catch (error) {
      console.error("Error loading data from cookies:", error);
    }
  }, []);

  useEffect(() => {
    try {
      Cookies.set("focus", focus.toString());

    } catch (error) {
      console.error("Error saving focus state to cookies:", error);
    }
  }, [focus]);

  useEffect(() => {
    try {
      Cookies.set("selectedOptions", JSON.stringify(selectedOptions));
    } catch (error) {
      console.error("Error saving selectedOptions to cookies:", error);
    }
  }, [selectedOptions]);

  const setDefault = () => {
    setId(null);
    setImgUpload(null);
    setPassImgUpload(null);
    setModel(null);
    setColor(null);
    setStorage(null);
    setRegion(null);
    setAdditional(null)
    setQuantity(1);
    setPurchase(null);
    setFrom(null);
    setImei(null);
    setComment(null);
    setValues({ numberformat: 0 })
    setAddModal(false)
    setEditModal(null)
  };

  useEffect(() => {
    dispatch(GetData());
  }, [dispatch]);

  useEffect(() => {
    if (window.location.pathname === "/AdminPage/data/addProduct") {
      setDefault()
      setAddModal(true)
    }
  }, []);

  useEffect(() => {
    if (dataData.getData?.Success && dataData.getData.Data?.data.data) {
      const fetchedRows = dataData?.getData?.Data?.data?.data.map((elem, index) => ({
        image: elem.image,
        passImage: elem.passImage,
        id: index + 1,
        type: elem.type,
        model: elem.model,
        quantity: elem.quantity,
        from: elem.from,
        imei: elem.imei,
        purchase: elem.purchase,
        comment: elem.comment,
        productId: elem._id,
        stQuantity: elem.stQuantity,
        color: elem.color,
        storage: elem.storage,
        region: elem.region,
        additional: elem.additional,
        createdAt: elem.createdAt
      }));
      setRows(fetchedRows);
    }
  }, [dataData]);

  if (dataData.getData.Loading) {
    return <LoadingAnimations />;
  };

  if (!dataData.getData.Data?.data.data) {
    return <Error500Page />;
  };

  const HandleFile = (acceptedFiles) => {
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

  const HandlePassFile = (acceptedFiles) => {
    const formData = new FormData()
    formData.append('file', acceptedFiles[0])
    formData.append('upload_preset', Cookies.get("imageLink"))
    setLoading(true)
    const postImage = async () => {
      try {
        const response = await axios.post(`${IMAGE_URL}`, formData)
        setPassImgUpload(response?.data.secure_url)
        setLoading(false)
      } catch (error) {
        console.log(error);
      }
    }
    postImage()
  };

  const handleClose = () => {
    setDefault();
    navlink("/AdminPage/data");
    setShopModal(false);
  };

  const handleEdit = () => {
    setEditModal(contextMenu.productId);
    setId(contextMenu.productId);
    setImgUpload(contextMenu.image);
    setModel(contextMenu.model);
    setColor(contextMenu.color);
    setRegion(contextMenu.region);
    setStorage(contextMenu.storage);
    setAdditional(contextMenu.additional);
    setQuantity(contextMenu.quantity);
    setFrom(contextMenu.from);
    setPurchase(contextMenu.purchase);
    setComment(contextMenu.comment);
    setImei(contextMenu.imei);
    setPassImgUpload(contextMenu.passImage)
    setContextMenu(null);
  };

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
    setPurchase(event.target.value)
  };

  const saleProduct = async () => {
    setLoading(true)
    const body = {
      name: model,
      sold: values.numberformat,
      imei: imei
    };
    handleClose()
    await dispatch(PostSale({ id, body }));
    setValues({ numberformat: 0 })
    setDefault();
    await dispatch(GetData());
    setLoading(false)
  };

  const removeData = async (id) => {
    setLoading(true);
    await dispatch(DeleteData(id));
    await dispatch(GetData());
    setLoading(false);
  };

  const addData = async (event) => {
    event.preventDefault();
    setLoading(true);
    handleClose();
    const body = {
      type: "phone",
      model: model,
      quantity: quantity || 1,
      purchase: purchase,
      from: from,
      comment: comment,
      image: imgUpload,
      passImage: imgPassUpload,
      imei: imei,
      stQuantity: quantity || 1,
      color: color,
      storage: storage,
      region: region,
      additional: additional
    };
    await dispatch(PostData(body));
    setDefault();
    await dispatch(GetData());
    setLoading(false);
  };

  const editData = async (event) => {
    event.preventDefault();
    setLoading(true);
    const body = {
      type: "phone",
      model: model,
      quantity: quantity || 1,
      purchase: purchase,
      from: from,
      comment: comment,
      image: imgUpload,
      passImage: imgPassUpload,
      imei: imei,
      stQuantity: quantity || 1,
      color: color,
      storage: storage,
      region: region,
      additional: additional
    };
    await dispatch(PutData({ id, body }));
    setLoading(false);
    setDefault();
    await dispatch(GetData());
  };

  const searchRows = (event) => {
    const searchedRows = dataData?.getData?.Data?.data?.data.filter(e => e.imei.includes(event.target.value) || e.model.toLowerCase().includes(event.target.value.toLowerCase())).map((elem, index) => ({
      image: elem.image,
      passImage: elem.passImage,
      id: index + 1,
      type: elem.type,
      model: elem.model,
      quantity: elem.quantity,
      from: elem.from,
      imei: elem.imei,
      purchase: elem.purchase,
      comment: elem.comment,
      productId: elem._id,
      stQuantity: elem.stQuantity,
      color: elem.color,
      storage: elem.storage,
      region: elem.region,
      additional: elem.additional,
      createdAt: elem.createdAt
    }));
    setRows(searchedRows);
  };

  const handleContextMenu = (event) => {
    event.preventDefault();
    setMenuPosition({ x: event.nativeEvent.layerX, y: event.pageY - 289 });
  };

  const handleClick = () => {
    setContextMenu(null);
  };

  return (
    <div className='DataPanel'>
      {loading ? <LoadingAnimations /> : null}
      {isOpen ? <div className="overlay" onClick={toggleDropdown}></div> : null}
      {focus ? <div className="rowOverlay"></div> : null}
      {editModal ? <div className='editOverlay'></div> : null}

      <div className="PanelTop">
        <button className='focus' onClick={() => setFocus(!focus)}
          style={{
            zIndex: focus ? 106 : 1,
            background: focus ? "var(--black)" : "var(--white)",
            color: focus ? "var(--white)" : "var(--black)",
          }}
        >
          Focus
        </button>
        <form onSubmit={e => e.preventDefault()}>
          <input type="text" disabled={loading ? true : false} placeholder="𝄃𝄂𝄂𝄀 IMEI yoki Model bilan qidirish" onChange={searchRows}/>
          <button className="fa-solid fa-magnifying-glass" aria-label="search"></button>
        </form>
        <div className='selectBox'>
          <div className='selectTop' onClick={toggleDropdown}>
            Filter
            <span style={{ float: "right" }}><i style={isOpen ? { transform: "rotate(180deg)" } : null} class="fa-solid fa-caret-down"></i></span>
          </div>
          {isOpen && (
            <div className='options'>
              {options.map((option) => (
                <label
                  key={option}
                  style={{
                    background: selectedOptions.includes(option) ? "var(--secondary-black)" : "var(--white)",
                    color: selectedOptions.includes(option) ? "var(--white)" : "var(--black)",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={selectedOptions.includes(option)}
                    onChange={() => handleOptionChange(option)}
                    style={{ marginRight: "8px" }}
                  />
                  {option}
                </label>
              ))}
            </div>
          )}
        </div>
      </div>
      <AddPhone setAddModal={setAddModal} />
      {shopModal ? <div className="shopModal-backdrop" onClick={handleClose}>
        <div className="shopModal-container" onClick={(e) => e.stopPropagation()}>
          <button className="shopModal-closeButton" onClick={handleClose}>&times;</button>
          <img src={image} alt="phone" className="shopModal-image" />
          <h2 className="shopModal-heading">Rostan ham "{model}" ni sotmoqchimisiz?</h2>
          <p className="shopModal-description">
            Eslatib o'tamiz telefon sotilgandan keyin faqat yangi telefon qo'shish orqali telefonni qaytarsa bo'ladi!
          </p>
          <form onSubmit={saleProduct} className="shopModal-form">
            <TextField required label="Narxni kiriting" sx={{ mt: 2, width: "100%" }} value={values.numberformat} onChange={handleChange} name="numberformat" id="formatted-numberformat-input" InputProps={{ inputComponent: NumericFormatCustom }} variant="standard" />
            <button type="submit" className="shopModal-button" id={id}>
              Sotish
            </button>
          </form>
        </div>
      </div> : null}

      {deleteModal ? <div className="deleteModal-backdrop" onClick={() => setDeleteModal(null)}>
        <div className="deleteModal">
          <p className="deleteModal-text">Rostan ham "{deleteModal.model}" ni o'chirmoqchimisiz</p>
          <div className="deleteModal-actions">
            <button className="deleteModal-button cancel" onClick={() => setDeleteModal(null)}>
              Cancel
            </button>
            <button className="deleteModal-button confirm" onClick={() => removeData(deleteModal.productId)}>
              O'chirish
            </button>
          </div>
        </div>
      </div> : null}

      <table onContextMenu={!focus ? handleContextMenu : null} onClick={handleClick}>

        {contextMenu && !focus && (
          <div className='ContextMenu' style={{ top: menuPosition.y, left: menuPosition.x }}>
            <ul>
              <li onClick={() => handleEdit()}>
                <i className='fa-solid fa-square-pen' />
                <h4>O'zgartirish</h4>
              </li>
              <li onClick={() => setDeleteModal(contextMenu)}>
                <i className='fa-solid fa-trash-can' />
                <h4>O'chirish</h4>
              </li>
              <li onClick={() => { setModel(contextMenu.model); setImage(contextMenu.image); setId(contextMenu.productId); setShopModal(true); }}>
                <i className="fa-solid fa-cart-shopping" />
                <h4>Sotish</h4>
              </li>
            </ul>
          </div>
        )}

        <tr onContextMenu={handleClick} style={{ zIndex: focus ? 106 : 1 }}>
          <th hidden={selectedOptions ? !selectedOptions.includes("Telefon Rasmi") : false}>Rasmi</th>
          <th hidden={selectedOptions ? !selectedOptions.includes("Passport Rasmi") : false}>Passport</th>
          <th hidden={selectedOptions ? !selectedOptions.includes("ID") : false}>Id</th>
          <th hidden={selectedOptions ? !selectedOptions.includes("Model") : false}>Model</th>
          <th hidden={selectedOptions ? !selectedOptions.includes("Xotira") : false}>Xotira</th>
          <th hidden={selectedOptions ? !selectedOptions.includes("Rang") : false}>Rang</th>
          <th hidden={selectedOptions ? !selectedOptions.includes("Soni") : false}>Soni</th>
          <th hidden={selectedOptions ? !selectedOptions.includes("Telefon Raqam") : false}>Kimdan</th>
          <th hidden={selectedOptions ? !selectedOptions.includes("IMEI") : false}>IMEI</th>
          <th hidden={selectedOptions ? !selectedOptions.includes("Olindi") : false}>Olindi</th>
          <th hidden={selectedOptions ? !selectedOptions.includes("Holat") : false}>Holati</th>
          <th hidden={selectedOptions ? !selectedOptions.includes("Olingan Vaqt") : false}>Olingan Vaqti</th>
          <th hidden={(editModal || addModal) ? false : true}>Actions</th>
        </tr>

        {rows.map(elem => <tr onContextMenu={() => { setContextMenu(elem); setIsOpen(false); }} style={editModal === elem.productId ? { zIndex: 104 } : null}>
          <td hidden={!selectedOptions.includes("Telefon Rasmi")} style={{ width: "7%", textAlign: "center" }}>
            {editModal === elem.productId ? (
              imgUpload ? (
                <div className="image-preview">
                  <img src={imgUpload} alt="Uploaded Phone" className="modal-image" />
                  <DeleteSweep
                    className="delete-icon"
                    onClick={() => setImgUpload(null)}
                  />
                </div>
              ) : (
                <div
                  className="upload-box"
                  {...fileDropzone.getRootProps()}
                >
                  <input {...fileDropzone.getInputProps()} />
                  <p>Telefon rasmini shu yerga yuklang yoki bosib tanlang.</p>
                </div>
              )
            ) : (
              elem.image ? (
                <img src={elem.image} alt={`Product: ${elem.model}`} className="modal-image" />
              ) : (
                <i className="fa-solid fa-mobile-button" />
              )
            )}
          </td>
          <td hidden={!selectedOptions.includes("Passport Rasmi")} style={{ width: "7%", textAlign: "center" }}>
            {editModal === elem.productId ? (
              imgPassUpload ? (
                <div className="image-preview">
                  <img src={imgPassUpload} alt="Uploaded Passport" className="modal-image" />
                  <DeleteSweep
                    className="delete-icon"
                    onClick={() => setPassImgUpload(null)}
                  />
                </div>
              ) : (
                <div
                  className="upload-box"
                  {...passDropzone.getRootProps()}
                >
                  <input {...passDropzone.getInputProps()} />
                  <p>Passport rasmini shu yerga yuklang yoki bosib tanlang.</p>
                </div>
              )
            ) : (
              elem.passImage ? (
                <img src={elem.passImage} alt={`Product: ${elem.model}`} className="modal-image" />
              ) : (
                <i className="fa-solid fa-id-card" />
              )
            )}
          </td>
          {selectedOptions.includes("ID") && (
            <td style={{ width: "3%" }}>{elem.id || ""}</td>
          )}
          {selectedOptions.includes("Model") && (
            <td style={{ width: "11%" }}>
              {editModal === elem.productId ? (
                <Input
                  required
                  onChange={(event) => setModel(event.target.value)}
                  value={model || ""}
                  defaultValue={elem.model || ""}
                  placeholder="Modeli"
                />
              ) : (
                elem.model || ""
              )}
            </td>
          )}
          {selectedOptions.includes("Xotira") && (
            <td style={{ width: "9%" }}>
              {editModal === elem.productId ? (
                <Input
                  required
                  onChange={(event) => setStorage(event.target.value)}
                  value={storage || ""}
                  defaultValue={elem.storage || ""}
                  placeholder="Xotirasi"
                />
              ) : (
                elem.storage || ""
              )}
            </td>
          )}
          {selectedOptions.includes("Rang") && (
            <td style={{ width: "9%" }}>
              {editModal === elem.productId ? (
                <Input
                  required
                  onChange={(event) => setColor(event.target.value)}
                  value={color || ""}
                  defaultValue={elem.color || ""}
                  placeholder="Rangi"
                />
              ) : (
                elem.color || ""
              )}
            </td>
          )}
          {selectedOptions.includes("Soni") && (
            <td style={{ width: "5%" }}>
              {editModal === elem.productId ? (
                <Input
                  required
                  type='number'
                  onChange={(event) => setQuantity(event.target.value)}
                  value={quantity || ""}
                  defaultValue={elem.quantity || ""}
                  placeholder="Soni"
                />
              ) : (
                elem.quantity || ""
              )}
            </td>
          )}
          {selectedOptions.includes("Telefon Raqam") && (
            <td style={{ width: "7%" }}>
              {editModal === elem.productId ? (
                <Input
                  required
                  onChange={(event) => setFrom(event.target.value)}
                  value={from || ""}
                  defaultValue={elem.from || ""}
                  placeholder="Kimdan oldik?"
                />
              ) : (
                elem.from || ""
              )}
            </td>
          )}
          {selectedOptions.includes("IMEI") && (
            <td style={{ width: "10%" }}>
              {editModal === elem.productId ? (
                elem.quantity === 1 ? (
                  <Input
                    required
                    onChange={(event) => setImei(event.target.value)}
                    value={imei || ""}
                    defaultValue={elem.imei || ""}
                    placeholder="𝄃𝄂𝄂𝄀 IMEI"
                  />
                ) : (
                  ""
                )
              ) : (
                elem.imei || ""
              )}
            </td>
          )}
          {selectedOptions.includes("Olindi") && (
            <td style={{ width: "5%" }}>
              {editModal === elem.productId ? (
                <Input
                  required
                  type='number'
                  onChange={(event) => setPurchase(event.target.value)}
                  value={purchase || ""}
                  defaultValue={elem.purchase || ""}
                  placeholder="Olindi"
                />
              ) : (
                elem.purchase || ""
              )}
            </td>
          )}
          {selectedOptions.includes("Holat") && (
            <td style={{ width: "15%" }}>
              {editModal === elem.productId ? (
                <Input
                  required
                  onChange={(event) => setComment(event.target.value)}
                  value={comment || ""}
                  defaultValue={elem.comment || ""}
                  placeholder="Holati"
                />
              ) : (
                elem.comment || ""
              )}
            </td>
          )}
          <td hidden={!selectedOptions.includes("Olingan Vaqt")} style={{ width: "10%" }}>{new Date(elem.createdAt).toISOString().split('T')[0]}</td>
          {editModal === elem.productId ? <td className='editModal'>
            <button className='fa-solid fa-xmark' onClick={() => { setEditModal(null); setDefault(); }} />
            <button className='fa-solid fa-check' onClick={editData} />
          </td> : null}
        </tr>
        )}

        {addModal ? <tr>
          <td hidden={!selectedOptions.includes("Telefon Rasmi")} style={{ width: "7%", textAlign: "center" }}>
            {imgUpload ? (
              <div className="image-preview">
                <img src={imgUpload} alt="Uploaded Phone" className="modal-image" />
                <DeleteSweep
                  className="delete-icon"
                  onClick={() => setImgUpload(null)}
                />
              </div>
            ) : (
              <div
                className="upload-box"
                {...fileDropzone.getRootProps()}
              >
                <input {...fileDropzone.getInputProps()} />
                <p>Telefon rasmini shu yerga yuklang yoki bosib tanlang.</p>
              </div>)}
          </td>
          <td hidden={!selectedOptions.includes("Passport Rasmi")} style={{ width: "7%", textAlign: "center" }}>
            {imgPassUpload ? (
              <div className="image-preview">
                <img src={imgPassUpload} alt="Uploaded Passport" className="modal-image" />
                <DeleteSweep
                  className="delete-icon"
                  onClick={() => setPassImgUpload(null)}
                />
              </div>
            ) : (
              <div
                className="upload-box"
                {...passDropzone.getRootProps()}
              >
                <input {...passDropzone.getInputProps()} />
                <p>Passport rasmini shu yerga yuklang yoki bosib tanlang.</p>
              </div>
            )}
          </td>
          {selectedOptions.includes("ID") && (
            <td style={{ width: "3%" }}></td>
          )}
          {selectedOptions.includes("Model") && (
            <td style={{ width: "11%" }}>
              <Input
                required
                onChange={(event) => setModel(event.target.value)}
                value={model}
                placeholder="Modeli"
              />
            </td>
          )}
          {selectedOptions.includes("Xotira") && (
            <td style={{ width: "9%" }}>
              <Input
                required
                onChange={(event) => setStorage(event.target.value)}
                value={storage}
                placeholder="Xotirasi"
              />
            </td>
          )}
          {selectedOptions.includes("Rang") && (
            <td style={{ width: "9%" }}>
              <Input
                required
                onChange={(event) => setColor(event.target.value)}
                value={color}
                placeholder="Rangi"
              />
            </td>
          )}
          {selectedOptions.includes("Soni") && (
            <td style={{ width: "5%" }}>
              <Input
                required
                type='number'
                onChange={(event) => setQuantity(event.target.value)}
                value={quantity}
                placeholder="Soni"
              />
            </td>
          )}
          {selectedOptions.includes("Telefon Raqam") && (
            <td style={{ width: "7%" }}>
              <Input
                required
                onChange={(event) => setFrom(event.target.value)}
                value={from}
                placeholder="Kimdan oldik?"
              />
            </td>
          )}
          {selectedOptions.includes("IMEI") && (
            <td style={{ width: "10%" }}>
              {quantity === 1 ? (
                <Input
                  required
                  onChange={(event) => setImei(event.target.value)}
                  value={imei}
                  placeholder="𝄃𝄂𝄂𝄀 IMEI"
                />
              ) : (
                ""
              )}
            </td>
          )}
          {selectedOptions.includes("Olindi") && (
            <td style={{ width: "5%" }}>
              <Input
                required
                type='number'
                onChange={(event) => setPurchase(event.target.value)}
                value={purchase}
                placeholder="Olindi"
              />
            </td>
          )}
          {selectedOptions.includes("Holat") && (
            <td style={{ width: "15%" }}>
              <Input
                required
                onChange={(event) => setComment(event.target.value)}
                value={comment}
                placeholder="Holati"
              />
            </td>
          )}
          <td hidden={!selectedOptions.includes("Olingan Vaqt")} style={{ width: "10%" }}>{new Date().toISOString().split('T')[0]}</td>
          <td className='editModal'>
            <button className='fa-solid fa-xmark' onClick={() => { setAddModal(null); setDefault(); }} />
            <button className='fa-solid fa-check' onClick={addData} />
          </td>
        </tr> : null}
      </table>
    </div>
  );
}