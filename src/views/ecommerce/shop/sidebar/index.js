import { Fragment, useEffect } from 'react'
// ** Third Party Components
/*eslint-disable*/
import classnames from 'classnames'
import { Filter, RefreshCw, Star } from 'react-feather'

// ** Reactstrap Imports
import { Card, CardBody, Row, Col, Input, Button, Label, ButtonGroup } from 'reactstrap'
import Select from 'react-select'
// ** Styles
import '@styles/react/libs/noui-slider/noui-slider.scss'
import { selectThemeColors } from '@utils'
import { useDispatch, useSelector } from 'react-redux'
import ComponentSpinner from '../../../../@core/components/spinner/Loading-spinner'
import PartCategoryFilter from './PartCategoryFilter'
import CarBrandsFilter from './CarBrandsFilter'
import { handleParamsUpdates } from '../../store'
import { loadFormOptions } from '../../../../redux/formOptions'

const Sidebar = props => {
    // ** Props
    const {sidebarOpen, applyFilter, clearFilter} = props
    // ** State
    const dispatch = useDispatch()
    const formOptions = useSelector(state => state.formOptions)
    const sidebarParams = useSelector(state => state.ecommerce.sidebarParams)
    //** Effect
    useEffect(() => {
        const loadData = async () => {
            if (formOptions.isLoading) {
                dispatch(loadFormOptions())
            }            
        }
        loadData()
    }, [])

    const wilayasUpdated = (value) => {
        dispatch(handleParamsUpdates({wilaya_id: value.value}))
    }
    const carTypesUpdated = (e, itemID) => {
        dispatch(handleParamsUpdates({ car_types: JSON.stringify([itemID]) }))
    }

    return (
        <div className='sidebar-detached sidebar-left'>
        <div className='sidebar'>
            <div
                className={classnames('sidebar-shop', {
                    show: sidebarOpen
                })}
            >
            <Row>
                <Col sm='12'>
                <h6 className='filter-heading d-none d-lg-block'>Filters</h6>
                </Col>
            </Row>
            <Card>
                
                <CardBody>
                    <div className='text-center mt-1'>
                        <Button className='me-1' color='primary' onClick={() => applyFilter()}>
                            <Filter size={14}/>
                            <span className='align-middle ms-25'>Filter</span>
                        </Button>
                        <Button color='primary' outline onClick={() => clearFilter()}>
                            <RefreshCw size={14} />
                            <span className='align-middle ms-25'>Reset</span>
                        </Button>
                    </div>
                    { formOptions.isLoading ? (<div className='mt-2'>
                        <ComponentSpinner/>
                    </div>) : (
                        <Fragment>
                            <div id='post-categories'>
                                <h6 className='filter-title'>Wilayas</h6>
                                <Select
                                    theme={selectThemeColors}
                                    className={classnames('react-select')}
                                    classNamePrefix='select'
                                    options={formOptions.wilayas}
                                    onChange={wilayasUpdated}
                                />
                            </div>

                            <div id='post-categories'>
                                <h6 className='filter-title'>Car Types</h6>
                                <ul className='list-unstyled categories-list'>
                                    <li>
                                        <div className='form-check'>
                                            <Input
                                                type='radio'
                                                id={0}
                                                name='car-types-radio'
                                                onClick={(e) => carTypesUpdated(e, null)}
                                                defaultChecked={true}
                                            />
                                            <Label className='form-check-label' for={0}>
                                                All
                                            </Label>
                                        </div>
                                    </li>
                                {formOptions.car_types.map(item => {
                                    return (
                                    <li key={item.id}>
                                        <div className='form-check'>
                                            <Input
                                                type='radio'
                                                id={item.id}
                                                name='car-types-radio'
                                                onClick={(e) => carTypesUpdated(e, item.id)}
                                            />
                                            <Label className='form-check-label' for={item.id}>
                                                {item.label}
                                            </Label>
                                        </div>
                                    </li>
                                    )
                                })}
                                </ul>
                            </div>
                            <div className='brands'>
                                <h6 className='filter-title'>Part Categories</h6>
                                <PartCategoryFilter suggestions={formOptions.part_categories} />
                            </div>
                            <div className='brands'>
                                <h6 className='filter-title'>Car Brands</h6>
                                <CarBrandsFilter suggestions={formOptions.car_brands} />
                            </div>
                        </Fragment>
                    ) }
                </CardBody>
            </Card>
            </div>
        </div>
        </div>
    )
}

export default Sidebar
