import React, { Fragment, useEffect, useState } from 'react'
import AutoComplete from '@components/autocomplete'
import classnames from 'classnames'
import { Input, Label, NavLink } from 'reactstrap'
import { Search } from 'react-feather'
import Select from 'react-select'
import { selectThemeColors } from '@utils'
import { useDispatch, useSelector } from 'react-redux'
import { handleParamsUpdates } from '../../store'

const maxCheckedOptions = 10
export default function PartCategoriesFilter({suggestions }) {
    const dispatch = useDispatch()
    const userData = useSelector(state => state.authentication).userData
    // ** State
    const [selectedItems, setSelectedItems] = useState([])
  useEffect(() => {
    setSelectedItems(userData?.part_categories.map((item) => { return { value: item.id, label:item.name } }))
    // dispatch(handleParamsUpdates({part_categories: JSON.stringify(userData?.part_categories.map((item) => { return item.id }))}))
  }, [])
  const renderCheckedPartCategories = () => {
    // ** Loops through Checked partCategories
    const handleCheckboxUpdate = (e, item) => {
      setSelectedItems((prevState) => {
        const newState = prevState.filter((selectedItem) => { return selectedItem !== item })
        dispatch(handleParamsUpdates({part_categories: JSON.stringify(newState.map((item) => { return item.value }))}))
        return newState
      })
    }
    if (selectedItems.length) {
        return (
            selectedItems.map(item => {
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
  const handleChanges = (values) => {
    setSelectedItems(values)
    dispatch(handleParamsUpdates({part_categories: JSON.stringify(values.map((item) => { return item.value }))}))
  }
  return (
    <Fragment>
        <Select
            isClearable={false}
            isMulti
            theme={selectThemeColors}
            className={classnames('react-select mb-2')}
            classNamePrefix='select'
            options={suggestions}
            controlShouldRenderValue={false}
            onChange={handleChanges}
            value={selectedItems}
        />
        <ul className='list-unstyled brand-list'>
            {renderCheckedPartCategories()}
        </ul>
    </Fragment>
  )
}
