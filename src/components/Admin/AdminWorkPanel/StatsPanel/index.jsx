import './style.css';

import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

import Error500Page from '../../../500Component';
import { GetActivity } from '../../../../Redux/activity';
import { LineGraph } from './chartJs/Line';
import { CombinedChart } from './chartJs/Combined';
import LoadingAnimations from '../../../LoadingComponent';

export function StatsPanel() {
  const dispatch = useDispatch();
  const dataActivity = useSelector((state) => state.activity);

  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [availableYears, setAvailableYears] = useState([]);

  useEffect(() => {
    dispatch(GetActivity());
  }, [dispatch]);

  useEffect(() => {
    if (dataActivity?.getActivity?.Data?.data?.data) {
      const years = new Set();
      dataActivity.getActivity.Data.data.data.forEach((elem) => {
        const year = new Date(elem.createdAt).getFullYear();
        years.add(year);
      });
      setAvailableYears([...years]);
    }
  }, [dataActivity]);

  const handleYearChange = (e) => {
    setSelectedYear(Number(e.target.value));
  };

  return (
    <div className='statsPanel'>
      {dataActivity.getActivity?.Loading ? <LoadingAnimations/>: null}
      <select className='chartMonth' onChange={handleYearChange} value={selectedYear}>
        {availableYears.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>

      <LineGraph selectedYear={selectedYear} />
      <CombinedChart selectedYear={selectedYear} />
    </div>
  );
}
