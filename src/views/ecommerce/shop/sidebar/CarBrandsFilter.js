import React, { Fragment, useEffect, useState } from 'react'
import classnames from 'classnames'
import { CardText, Input, Label, NavLink } from 'reactstrap'
import Select from 'react-select'
import { selectThemeColors } from '@utils'
import { useDispatch } from 'react-redux'
import { handleParamsUpdates } from '../../store'
import useUserData from '../../../../utility/hooks/useUserData'

const maxCheckedOptions = 10
export default function CarBrandsFilter({ suggestions }) {
  const dispatch = useDispatch()
  const userData = useUserData()
  // ** State
  const [selectedCarBrands, setselectedCarBrands] = useState([])
  useEffect(() => {
    setselectedCarBrands(userData?.car_brands.map((item) => { return { value: item.id, label:item.name, logo: item.logo } }))
  }, [])
  // ** Loops through Checked partCategories
  const handleCheckboxUpdate = (e, item) => {
    setselectedCarBrands((prevState) => {
      const newState = prevState.filter((selectedItem) => { return selectedItem !== item })
      dispatch(handleParamsUpdates({car_brands: JSON.stringify(newState.map((item) => { return item.value }))}))
      return newState
    })
  }
  const handleChanges = (values) => {
      setselectedCarBrands(values)
      dispatch(handleParamsUpdates({car_brands: JSON.stringify(values.map((item) => { return item.value }))}))
    }


    const renderCheckedPartCategories = () => {
        if (selectedCarBrands.length) {
            return (
                selectedCarBrands.map(item => {
                    return (
                    <li key={item.label}>
                        <div className='form-check'>
                        <Input type='checkbox' id={item.label} defaultChecked={true} onChange={(e) => handleCheckboxUpdate(e, item)}/>
                        <Label className='form-check-label' for={item.label} >
                            {item.label}
                        </Label>
                        </div>
                        <span>{item.total}</span>
                    </li>
                    )
                }).slice(0, maxCheckedOptions)
            )
        } else {
        return null
        }
    }

  return (
    <Fragment>
        <Select
            isClearable={false}
            isMulti
            theme={selectThemeColors}
            className={classnames('react-select mb-2')}
            classNamePrefix='select'
            controlShouldRenderValue={false}
            onChange={handleChanges}
            value={selectedCarBrands}
            options={suggestions}
        />
        <ul className='list-unstyled brand-list'>
            {renderCheckedPartCategories()}
        </ul>
    </Fragment>
  )
}
